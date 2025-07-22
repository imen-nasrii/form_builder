import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, requireAuth, requireAdmin } from "./auth";
import { setupEnhancedAuth, requireAuth as requireAuthEnhanced, requireAdmin as requireAdminEnhanced, requireUser } from "./auth-enhanced";
import bcrypt from "bcryptjs";
import { insertFormSchema, insertTemplateSchema, insertNotificationSchema } from "@shared/schema";
import { notificationService } from "./notification-service";
import type { User } from "@shared/schema";
import { apiService, type ApiDataSource } from "./services/apiService";
import { aiAssistant } from "./anthropic";
import { generateAIResponse, validateJSON } from "./ai-helpers";
import { nanoid } from "nanoid";
import crypto from "crypto";
import fs from "fs";
import path from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication with role-based access
  await setupAuth(app);

  // Auth routes are now handled in auth.ts

  // Get all users (admin only)
  app.get('/api/admin/users', requireAdmin, async (req: any, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Update user role (admin only)
  app.patch('/api/admin/users/:userId/role', requireAdmin, async (req: any, res) => {
    try {
      const { userId } = req.params;
      const { role } = req.body;
      
      if (!['admin', 'user'].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      await storage.updateUserRole(userId, role);
      res.json({ message: "Role updated successfully" });
    } catch (error) {
      console.error("Error updating role:", error);
      res.status(500).json({ message: "Failed to update role" });
    }
  });

  // Enable 2FA (admin users)
  app.post('/api/auth/enable-2fa', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "2FA only available for admin users" });
      }

      const secret = crypto.randomBytes(32).toString('hex');
      await storage.enableTwoFactor(userId, secret);
      
      res.json({ secret, message: "2FA enabled successfully" });
    } catch (error) {
      console.error("Error enabling 2FA:", error);
      res.status(500).json({ message: "Failed to enable 2FA" });
    }
  });

  // Verify 2FA token
  app.post('/api/auth/verify-2fa', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { token } = req.body;

      // Create 2FA token with 5 minute expiry
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
      await storage.createTwoFactorToken({
        userId,
        token,
        expiresAt
      });

      const isValid = await storage.verifyTwoFactorToken(userId, token);
      
      if (isValid) {
        res.json({ success: true, message: "2FA verification successful" });
      } else {
        res.status(400).json({ success: false, message: "Invalid or expired token" });
      }
    } catch (error) {
      console.error("Error verifying 2FA:", error);
      res.status(500).json({ message: "Failed to verify 2FA token" });
    }
  });

  // Create new user (admin only)
  app.post('/api/admin/users', requireAdmin, async (req: any, res) => {
    try {
      const { email, password, role } = req.body;
      
      console.log('Create user request:', { email, role });

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password before creating user
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create user
      const newUser = await storage.createUser({
        email,
        password: hashedPassword,
        role: role || 'user'
      });

      console.log('User created successfully:', newUser.id);

      // Remove password from response
      const { password: _, ...userResponse } = newUser;
      res.status(201).json(userResponse);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Failed to create user' });
    }
  });

  // Delete user (admin only)
  app.delete('/api/admin/users/:userId', requireAdmin, async (req: any, res) => {
    try {
      const { userId } = req.params;
      
      console.log('Delete user request:', userId);

      await storage.deleteUser(userId);
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Failed to delete user' });
    }
  });

  // Get user-specific statistics
  app.get('/api/analytics/stats', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const stats = await storage.getUserStatistics(userId);
      res.json(stats);
    } catch (error) {
      console.error('Error fetching user statistics:', error);
      res.status(500).json({ message: 'Failed to fetch statistics' });
    }
  });

  // Get admin dashboard statistics
  app.get('/api/admin/stats', requireAdmin, async (req: any, res) => {
    try {
      const stats = await storage.getAdminStatistics();
      res.json(stats);
    } catch (error) {
      console.error('Error fetching admin statistics:', error);
      res.status(500).json({ message: 'Failed to fetch admin statistics' });
    }
  });

  // Update form status, priority, and comments (for task management)
  app.patch('/api/forms/:id/status', requireAuth, async (req: any, res) => {
    try {
      const formId = parseInt(req.params.id);
      const { status, priority, comment } = req.body;
      const userId = req.user.id;
      
      console.log('Updating form status:', { formId, status, priority, comment, userId });
      
      // Build update object with only provided fields
      const updateData: any = {};
      if (status) updateData.status = status;
      if (priority) updateData.priority = priority;
      
      const updatedForm = await storage.updateForm(formId, updateData);
      
      if (!updatedForm) {
        return res.status(404).json({ message: "Form not found" });
      }
      
      // Create notifications for status changes
      if (status && updatedForm.assignedTo) {
        await notificationService.notifyTaskStatusChange(
          updatedForm.assignedTo,
          updatedForm.createdBy || userId,
          formId,
          updatedForm.label,
          status
        );
      }
      
      res.json(updatedForm);
    } catch (error) {
      console.error("Error updating form status:", error);
      res.status(500).json({ message: "Failed to update form status" });
    }
  });

  // Assign form to user route (admin only)
  app.patch('/api/forms/:id/assign', requireAuth, requireAdmin, async (req: any, res) => {
    try {
      const formId = parseInt(req.params.id);
      const { assignedTo } = req.body;
      const adminUserId = req.user.id;
      
      console.log('Assigning form:', { formId, assignedTo, adminUserId });
      
      await storage.assignFormToUser(formId, assignedTo);
      
      // Create comprehensive notifications for assignment
      const form = await storage.getForm(formId);
      if (form && assignedTo) {
        await notificationService.notifyProgramAssignment(
          assignedTo,
          adminUserId,
          formId,
          form.label
        );
      }
      
      res.json({ message: "Form assigned successfully" });
    } catch (error) {
      console.error("Error assigning form:", error);
      res.status(500).json({ message: "Failed to assign form" });
    }
  });

  // Legacy route for backward compatibility
  app.post('/api/forms/assign', requireAdmin, async (req: any, res) => {
    try {
      const { programId, userId } = req.body;
      const adminUserId = req.user.id;
      
      console.log('Legacy assign form request:', { programId, userId });

      if (!programId || !userId) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      await storage.assignFormToUser(programId, userId);
      
      const form = await storage.getForm(programId);
      if (form) {
        await notificationService.notifyProgramAssignment(
          userId,
          adminUserId,
          programId,
          form.label
        );
      }

      res.json({ 
        message: 'Form assigned successfully',
        formId: programId,
        assignedTo: userId 
      });
    } catch (error) {
      console.error('Error assigning form:', error);
      res.status(500).json({ message: 'Failed to assign form' });
    }
  });

  // Form management routes
  app.get('/api/forms', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      let forms;
      if (user?.role === 'admin') {
        // Admin sees all forms
        forms = await storage.getAllForms();
      } else {
        // User sees only their forms
        forms = await storage.getForms(userId);
      }
      
      res.json(forms);
    } catch (error) {
      console.error("Error fetching forms:", error);
      res.status(500).json({ message: "Failed to fetch forms" });
    }
  });

  app.get('/api/forms/:id', requireAuth, async (req: any, res) => {
    try {
      const formId = parseInt(req.params.id);
      const form = await storage.getForm(formId);
      
      if (!form) {
        return res.status(404).json({ message: "Form not found" });
      }

      res.json(form);
    } catch (error) {
      console.error("Error fetching form:", error);
      res.status(500).json({ message: "Failed to fetch form" });
    }
  });

  app.get('/api/forms/menu/:menuId', requireAuth, async (req: any, res) => {
    try {
      const menuId = req.params.menuId;
      const form = await storage.getFormByMenuId(menuId);
      
      if (!form) {
        return res.status(404).json({ message: "Form not found" });
      }

      res.json(form);
    } catch (error) {
      console.error("Error fetching form:", error);
      res.status(500).json({ message: "Failed to fetch form" });
    }
  });

  // Create a new form
  app.post('/api/forms', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const formData = req.body;

      // Process formDefinition if present
      let processedData = { ...formData };
      if (formData.formDefinition) {
        try {
          const definition = typeof formData.formDefinition === 'string' 
            ? JSON.parse(formData.formDefinition) 
            : formData.formDefinition;
          
          processedData.fields = definition.fields || [];
          processedData.actions = definition.actions || [];
          processedData.validations = definition.validations || [];
          
          // Remove formDefinition as it's not a database column
          delete processedData.formDefinition;
        } catch (parseError) {
          console.error("Error parsing formDefinition:", parseError);
        }
      }

      // Ensure we have required fields
      if (!processedData.menuId) {
        processedData.menuId = `FORM_${Date.now()}`;
      }
      if (!processedData.label) {
        processedData.label = "New Form";
      }

      const parsedData = insertFormSchema.parse({
        ...processedData,
        createdBy: userId
      });

      const newForm = await storage.createForm(parsedData);
      res.status(201).json(newForm);
    } catch (error) {
      console.error("Error creating form:", error);
      res.status(500).json({ message: "Failed to create form" });
    }
  });

  // Create a new form from form builder
  app.post('/api/forms/create', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { menuId, label, formWidth = "700px", layout = "PROCESS" } = req.body;
      
      const newForm = await storage.createForm({
        menuId: menuId || `FORM_${Date.now()}`,
        label: label || "New Form",
        formWidth: formWidth,
        layout: layout,
        fields: [],
        actions: [],
        validations: [],
        createdBy: userId
      });

      res.status(201).json(newForm);
    } catch (error) {
      console.error("Error creating form:", error);
      res.status(500).json({ message: "Failed to create form" });
    }
  });

  app.put('/api/forms/:id', requireAuth, async (req: any, res) => {
    try {
      const formId = parseInt(req.params.id);
      const formData = req.body;

      const updatedForm = await storage.updateForm(formId, formData);
      res.json(updatedForm);
    } catch (error) {
      console.error("Error updating form:", error);
      res.status(500).json({ message: "Failed to update form" });
    }
  });

  app.patch('/api/forms/:id', requireAuth, async (req: any, res) => {
    try {
      const formId = parseInt(req.params.id);
      if (isNaN(formId)) {
        return res.status(400).json({ message: "Invalid form ID" });
      }

      const formData = req.body;
      console.log(`Updating form ${formId} with data:`, JSON.stringify(formData, null, 2));

      // Process formDefinition if present - keep it as JSON string for database storage
      let processedData = { ...formData };
      if (formData.formDefinition) {
        try {
          // Ensure formDefinition is stored as JSON string
          processedData.formDefinition = typeof formData.formDefinition === 'string' 
            ? formData.formDefinition 
            : JSON.stringify(formData.formDefinition);
          console.log("Saving formDefinition:", processedData.formDefinition);
        } catch (parseError) {
          console.error("Error processing formDefinition:", parseError);
        }
      }

      const updatedForm = await storage.updateForm(formId, processedData);
      
      if (!updatedForm) {
        return res.status(404).json({ message: "Form not found" });
      }

      res.json(updatedForm);
    } catch (error) {
      console.error("Error updating form:", error);
      
      // Ensure we always return JSON
      if (!res.headersSent) {
        res.status(500).json({ 
          message: "Failed to update form",
          error: error instanceof Error ? error.message : "Unknown error"
        });
      }
    }
  });

  app.delete('/api/forms/:id', requireAuth, async (req: any, res) => {
    try {
      const formId = parseInt(req.params.id);
      await storage.deleteForm(formId);
      res.json({ message: "Form deleted successfully" });
    } catch (error) {
      console.error("Error deleting form:", error);
      res.status(500).json({ message: "Failed to delete form" });
    }
  });

  // Component Import from URL route
  app.post('/api/import-component-url', requireAuth, async (req, res) => {
    try {
      const { url } = req.body;

      if (!url) {
        return res.status(400).json({ 
          success: false, 
          error: 'URL is required' 
        });
      }

      // Fetch components from URL
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'FormBuilder-Pro/1.0',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        return res.json({
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`
        });
      }

      const data = await response.json();
      const components = Array.isArray(data) ? data : [data];
      
      res.json({
        success: true,
        components: components,
        count: components.length
      });

    } catch (error) {
      console.error('Component import error:', error);
      res.json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to import components'
      });
    }
  });

  // API Integration route - Test external APIs
  app.post('/api/test-external-api', requireAuth, async (req, res) => {
    try {
      const { url, method = 'GET', headers = {} } = req.body;

      if (!url) {
        return res.status(400).json({ 
          success: false, 
          error: 'URL is required' 
        });
      }

      // Make the external API call
      const response = await fetch(url, {
        method,
        headers: {
          'User-Agent': 'FormBuilder-Pro/1.0',
          ...headers
        }
      });

      if (!response.ok) {
        return res.json({
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`
        });
      }

      const data = await response.json();
      
      res.json({
        success: true,
        data: data,
        status: response.status,
        headers: Object.fromEntries(response.headers.entries())
      });

    } catch (error) {
      console.error('API test error:', error);
      res.json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  });

  // Notifications routes
  app.get('/api/notifications', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      
      const notifications = await storage.getUserNotifications(userId, limit, offset);
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.patch('/api/notifications/:id/read', requireAuth, async (req: any, res) => {
    try {
      const notificationId = parseInt(req.params.id);
      const userId = req.user.id;
      
      const success = await storage.markNotificationAsRead(notificationId, userId);
      if (success) {
        res.json({ message: "Notification marked as read" });
      } else {
        res.status(404).json({ message: "Notification not found" });
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  // Template management routes
  app.get('/api/templates', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const templates = await storage.getTemplates(userId);
      res.json(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  app.post('/api/templates', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const templateData = insertTemplateSchema.parse({
        ...req.body,
        createdBy: userId
      });

      const newTemplate = await storage.createTemplate(templateData);
      res.status(201).json(newTemplate);
    } catch (error) {
      console.error("Error creating template:", error);
      res.status(500).json({ message: "Failed to create template" });
    }
  });

  app.delete('/api/templates/:id', requireAuth, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      // Check if template exists and belongs to user
      const template = await storage.getTemplate(parseInt(id));
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      if (template.createdBy !== userId) {
        return res.status(403).json({ message: "Not authorized to delete this template" });
      }
      
      await storage.deleteTemplate(parseInt(id));
      res.json({ message: "Template deleted successfully" });
    } catch (error) {
      console.error("Error deleting template:", error);
      res.status(500).json({ message: "Failed to delete template" });
    }
  });

  app.delete('/api/forms/:id', requireAuth, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      // Check if form exists and belongs to user
      const form = await storage.getForm(parseInt(id));
      if (!form) {
        return res.status(404).json({ message: "Form not found" });
      }
      if (form.createdBy !== userId) {
        return res.status(403).json({ message: "Not authorized to delete this form" });
      }
      
      await storage.deleteForm(parseInt(id));
      res.json({ message: "Form deleted successfully" });
    } catch (error) {
      console.error("Error deleting form:", error);
      res.status(500).json({ message: "Failed to delete form" });
    }
  });

  // JSON validation endpoint
  app.post('/api/forms/validate', requireAuth, async (req, res) => {
    try {
      const { formData } = req.body;
      
      // Validate JSON structure against expected schema
      const requiredFields = ['MenuID', 'FormWidth', 'Layout', 'Label', 'Fields'];
      const missingFields = requiredFields.filter(field => !formData.hasOwnProperty(field));
      
      if (missingFields.length > 0) {
        return res.status(400).json({ 
          valid: false, 
          errors: [`Missing required fields: ${missingFields.join(', ')}`]
        });
      }

      // Validate field structure
      const errors: string[] = [];
      if (Array.isArray(formData.Fields)) {
        formData.Fields.forEach((field: any, index: number) => {
          if (!field.Id) errors.push(`Field ${index + 1}: Missing Id`);
          if (!field.type) errors.push(`Field ${index + 1}: Missing type`);
          if (!field.label) errors.push(`Field ${index + 1}: Missing label`);
        });
      }

      if (errors.length > 0) {
        return res.status(400).json({ valid: false, errors });
      }

      res.json({ valid: true, message: "Form JSON validation successful" });
    } catch (error) {
      console.error("Error validating form JSON:", error);
      res.status(500).json({ valid: false, errors: ["Validation failed"] });
    }
  });

  // Form import endpoint
  app.post('/api/forms/import', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { formJson } = req.body;

      const formData = insertFormSchema.parse({
        menuId: formJson.MenuID,
        label: formJson.Label,
        formWidth: formJson.FormWidth || "700px",
        layout: formJson.Layout || "PROCESS",
        fields: formJson.Fields || [],
        actions: formJson.Actions || [],
        validations: formJson.Validations || [],
        createdBy: userId
      });

      const newForm = await storage.createForm(formData);
      res.status(201).json(newForm);
    } catch (error) {
      console.error("Error importing form:", error);
      res.status(500).json({ message: "Failed to import form" });
    }
  });

  // External API Data Source Management
  app.get('/api/data-sources', requireAuth, (req, res) => {
    try {
      const dataSources = apiService.getAllDataSources();
      res.json(dataSources.map(ds => ({
        id: ds.id,
        name: ds.name,
        url: ds.url,
        method: ds.method,
      })));
    } catch (error) {
      console.error('Error fetching data sources:', error);
      res.status(500).json({ error: 'Failed to fetch data sources' });
    }
  });

  // Fetch data from a specific data source
  app.get('/api/data-sources/:id/data', requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const filters = req.query as Record<string, any>;
      
      const result = await apiService.fetchData(id, filters);
      
      if (result.success) {
        res.json({ data: result.data });
      } else {
        res.status(400).json({ error: result.error });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  });

  // Create a new data source configuration
  app.post('/api/data-sources', requireAuth, (req, res) => {
    try {
      const dataSource: ApiDataSource = req.body;
      
      // Validate required fields
      if (!dataSource.id || !dataSource.name || !dataSource.url || !dataSource.responseMapping) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      apiService.registerDataSource(dataSource);
      res.status(201).json({ message: 'Data source created successfully' });
    } catch (error) {
      console.error('Error creating data source:', error);
      res.status(500).json({ error: 'Failed to create data source' });
    }
  });

  // Test a data source configuration
  app.post('/api/data-sources/test', requireAuth, async (req, res) => {
    try {
      const dataSource: ApiDataSource = req.body;
      const testId = `test-${Date.now()}`;
      const testDataSource = { ...dataSource, id: testId };
      
      apiService.registerDataSource(testDataSource);
      const result = await apiService.fetchData(testId);
      
      res.json({
        success: result.success,
        data: result.success ? result.data?.slice(0, 5) : undefined, // Return first 5 items for testing
        error: result.error,
      });
    } catch (error) {
      console.error('Error testing data source:', error);
      res.status(500).json({ error: 'Failed to test data source' });
    }
  });

  // Get MfactModels list
  app.get('/api/models', requireAuth, async (req: any, res) => {
    try {
      const modelsDir = path.join(process.cwd(), 'MfactModels');
      
      if (!fs.existsSync(modelsDir)) {
        return res.status(404).json({
          success: false,
          error: 'MfactModels directory not found'
        });
      }

      const files = fs.readdirSync(modelsDir)
        .filter(file => file.endsWith('.cs'))
        .map(file => ({
          name: file.replace('.cs', ''),
          displayName: file.replace('.cs', '').replace(/([A-Z])/g, ' $1').trim(),
          fileName: file
        }))
        .sort((a, b) => a.displayName.localeCompare(b.displayName));

      res.json({
        success: true,
        models: files
      });
    } catch (error) {
      console.error('Error reading models directory:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to read models directory'
      });
    }
  });

  // Get model properties
  app.get('/api/models/:modelName', requireAuth, async (req: any, res) => {
    try {
      const { modelName } = req.params;
      const modelFile = path.join(process.cwd(), 'MfactModels', `${modelName}.cs`);
      
      if (!fs.existsSync(modelFile)) {
        return res.status(404).json({
          success: false,
          error: 'Model file not found'
        });
      }

      const content = fs.readFileSync(modelFile, 'utf-8');
      
      // Parse C# properties from the file
      const propertyRegex = /public\s+(\w+\??)\s+(\w+)\s*{\s*get;\s*set;\s*}/g;
      const properties = [];
      let match;

      while ((match = propertyRegex.exec(content)) !== null) {
        const [, type, name] = match;
        properties.push({
          name,
          type: type.replace('?', ''),
          nullable: type.includes('?'),
          displayName: name.replace(/([A-Z])/g, ' $1').trim()
        });
      }

      res.json({
        success: true,
        modelName,
        displayName: modelName.replace(/([A-Z])/g, ' $1').trim(),
        properties,
        totalProperties: properties.length
      });
    } catch (error) {
      console.error('Error reading model file:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to read model file'
      });
    }
  });

  // Get table data from GraphQL database
  app.get('/api/table-data/:tableName', requireAuth, async (req: any, res) => {
    try {
      const { tableName } = req.params;
      
      // Map table names to GraphQL query endpoints based on your schema
      const queryMap: { [key: string]: string } = {
        'Secrty': 'AllTickers',
        'Fund': 'AllFunds',
        'FundCg': 'AllFunds', // FundCg maps to Fund table
        'Alias': 'AllAliases',
        'Glprm': 'AllGlprm',
        'Seccat': 'AllSecCat',
        'Secgrp': 'AllSecGrp',
        'Broker': 'AllBrokers',
        'Reason': 'AllReasons',
        'Exchng': 'AllExchanges',
        'Subunit': 'AllSubunits',
        'Source': 'AllSources',
        'Aatrr': 'AllSources' // Map to available endpoint for now
      };

      const queryName = queryMap[tableName];
      if (!queryName) {
        return res.status(400).json({ 
          success: false,
          message: `Invalid table name: ${tableName}` 
        });
      }

      // Get field selection based on table type
      const fieldSelection = getFieldsForTable(tableName);
      
      // Create GraphQL query
      const graphqlQuery = {
        query: `query { ${queryName} { ${fieldSelection} } }`
      };

      console.log(`Fetching data for table: ${tableName} using query: ${queryName}`);
      
      // Use schema-based sample data that matches your GraphQL structure
      const sampleData = getSampleDataForTable(tableName);
      
      res.json({ 
        success: true, 
        tableName,
        queryName,
        columns: getColumnsForTable(tableName),
        graphqlQuery: graphqlQuery.query,
        data: sampleData,
        recordCount: sampleData.length,
        message: `Schema-based data for ${tableName} (${sampleData.length} sample records)`,
        schemaStructure: true
      });
      
    } catch (error) {
      console.error('Error fetching table data:', error);
      res.status(500).json({ 
        success: false,
        message: 'Failed to fetch table data' 
      });
    }
  });

  function getFieldsForTable(tableName: string): string {
    const fieldMap: { [key: string]: string } = {
      'Secrty': 'tkr tkr_DESC currency country seccat price_ID face_VALUE outshs rating ytm inactive',
      'Fund': 'fund acnam1 base_CURR domicile inactive legal nav_DECS share_DECS',
      'FundCg': 'fund acnam1 base_CURR domicile inactive legal nav_DECS share_DECS',
      'Alias': 'aliasname descr criteria user_ID',
      'Glprm': 'accdivdate accdivtime accdivuser accdivweekend',
      'Seccat': 'seccat',
      'Secgrp': 'secgrp',
      'Broker': 'broker',
      'Reason': 'reason',
      'Exchng': 'exchng',
      'Subunit': 'subunit',
      'Source': 'source',
      'Aatrr': 'source'
    };
    return fieldMap[tableName] || 'id';
  }

  function getColumnsForTable(tableName: string): string[] {
    try {
      const modelFile = path.join(process.cwd(), 'MfactModels', `${tableName}.cs`);
      
      if (fs.existsSync(modelFile)) {
        const content = fs.readFileSync(modelFile, 'utf8');
        const properties: string[] = [];
        
        // Parse C# properties from the model file
        const propertyRegex = /public\s+[\w<>?]+\s+(\w+)\s*{\s*get;\s*set;\s*}/g;
        let match;
        
        while ((match = propertyRegex.exec(content)) !== null) {
          properties.push(match[1]);
        }
        
        // If we found properties, return them, otherwise fall back to hardcoded
        if (properties.length > 0) {
          return properties;
        }
      }
    } catch (error) {
      console.error(`Error reading model file for ${tableName}:`, error);
    }
    
    // Fallback to hardcoded columns
    const columnMap: { [key: string]: string[] } = {
      'Secrty': ['tkr', 'tkr_DESC', 'currency', 'country', 'seccat', 'price_ID', 'face_VALUE', 'outshs', 'rating', 'ytm', 'inactive'],
      'Fund': ['fund', 'acnam1', 'base_CURR', 'domicile', 'inactive', 'legal', 'nav_DECS', 'share_DECS'],
      'FundCg': ['fund', 'acnam1', 'base_CURR', 'domicile', 'inactive', 'legal', 'nav_DECS', 'share_DECS'],
      'Alias': ['aliasname', 'descr', 'criteria', 'user_ID'],
      'Glprm': ['accdivdate', 'accdivtime', 'accdivuser', 'accdivweekend'],
      'Seccat': ['seccat'],
      'Secgrp': ['secgrp'],
      'Broker': ['broker'], 
      'Reason': ['reason'],
      'Exchng': ['exchng'],
      'Subunit': ['subunit'],
      'Source': ['source'],
      'Aatrr': ['source']
    };
    return columnMap[tableName] || ['id'];
  }

  function getSampleDataForTable(tableName: string): any[] {
    const sampleDataSets: { [key: string]: any[] } = {
      'Secrty': [
        { tkr: 'AAPL', tkr_DESC: 'Apple Inc.', currency: 'USD', country: 'US', seccat: 'COMMON', price_ID: 150.25, face_VALUE: 1.0, outshs: 15943077000, rating: 'AAA', ytm: 0.025, inactive: false },
        { tkr: 'MSFT', tkr_DESC: 'Microsoft Corporation', currency: 'USD', country: 'US', seccat: 'COMMON', price_ID: 342.75, face_VALUE: 1.0, outshs: 7430439000, rating: 'AAA', ytm: 0.028, inactive: false },
        { tkr: 'GOOGL', tkr_DESC: 'Alphabet Inc Class A', currency: 'USD', country: 'US', seccat: 'COMMON', price_ID: 2875.50, face_VALUE: 1.0, outshs: 12800000000, rating: 'AA+', ytm: 0.030, inactive: false },
        { tkr: 'TSLA', tkr_DESC: 'Tesla Inc.', currency: 'USD', country: 'US', seccat: 'COMMON', price_ID: 248.42, face_VALUE: 1.0, outshs: 3178919000, rating: 'B+', ytm: 0.045, inactive: false }
      ],
      'Fund': [
        { fund: 'FUND001', acnam1: 'Global Equity Fund', base_CURR: 'USD', domicile: 'US', inactive: false, legal: 'MUTUAL_FUND', nav_DECS: 2, share_DECS: 3 },
        { fund: 'FUND002', acnam1: 'European Bond Fund', base_CURR: 'EUR', domicile: 'IE', inactive: false, legal: 'UCITS', nav_DECS: 4, share_DECS: 2 },
        { fund: 'FUND003', acnam1: 'Asia Pacific Growth', base_CURR: 'USD', domicile: 'LU', inactive: false, legal: 'SICAV', nav_DECS: 2, share_DECS: 3 },
        { fund: 'FUND004', acnam1: 'Emerging Markets Fund', base_CURR: 'USD', domicile: 'US', inactive: false, legal: 'MUTUAL_FUND', nav_DECS: 3, share_DECS: 2 }
      ],
      'FundCg': [
        { fund: 'FUND001', acnam1: 'Global Equity Fund', base_CURR: 'USD', domicile: 'US', inactive: false, legal: 'MUTUAL_FUND', nav_DECS: 2, share_DECS: 3 },
        { fund: 'FUND002', acnam1: 'European Bond Fund', base_CURR: 'EUR', domicile: 'IE', inactive: false, legal: 'UCITS', nav_DECS: 4, share_DECS: 2 },
        { fund: 'FUND005', acnam1: 'Technology Growth Fund', base_CURR: 'USD', domicile: 'US', inactive: false, legal: 'ETF', nav_DECS: 2, share_DECS: 3 }
      ],
      'Alias': [
        { aliasname: 'APPLE_EQUITY', descr: 'Apple Inc Common Stock', criteria: 'TKR=AAPL', user_ID: 'admin' },
        { aliasname: 'MSFT_EQUITY', descr: 'Microsoft Corporation', criteria: 'TKR=MSFT', user_ID: 'trader1' },
        { aliasname: 'TECH_STOCKS', descr: 'Technology Sector Stocks', criteria: 'SECCAT=TECH', user_ID: 'analyst' }
      ],
      'Glprm': [
        { accdivdate: '2024-01-01', accdivtime: '09:00:00', accdivuser: 'system', accdivweekend: 'Y' },
        { accdivdate: '2024-06-30', accdivtime: '17:00:00', accdivuser: 'admin', accdivweekend: 'N' }
      ],
      'Seccat': [
        { seccat: 'COMMON' },
        { seccat: 'PREFERRED' },
        { seccat: 'BOND' },
        { seccat: 'OPTION' },
        { seccat: 'FUTURE' }
      ],
      'Secgrp': [
        { secgrp: 'EQUITY' },
        { secgrp: 'FIXED_INCOME' },
        { secgrp: 'DERIVATIVES' },
        { secgrp: 'COMMODITIES' }
      ],
      'Broker': [
        { broker: 'GOLDMAN_SACHS' },
        { broker: 'MORGAN_STANLEY' },
        { broker: 'JP_MORGAN' },
        { broker: 'CREDIT_SUISSE' }
      ],
      'Reason': [
        { reason: 'TRADE_SETTLEMENT' },
        { reason: 'DIVIDEND_PAYMENT' },
        { reason: 'CORPORATE_ACTION' },
        { reason: 'FEE_ADJUSTMENT' }
      ],
      'Exchng': [
        { exchng: 'NYSE' },
        { exchng: 'NASDAQ' },
        { exchng: 'LSE' },
        { exchng: 'EURONEXT' }
      ],
      'Subunit': [
        { subunit: 'PORTFOLIO_1' },
        { subunit: 'PORTFOLIO_2' },
        { subunit: 'TRADING_DESK_A' },
        { subunit: 'FIXED_INCOME_DESK' }
      ],
      'Source': [
        { source: 'BLOOMBERG' },
        { source: 'REUTERS' },
        { source: 'FACTSET' },
        { source: 'INTERNAL_PRICING' }
      ],
      'Aatrr': [
        { source: 'BLOOMBERG' },
        { source: 'REUTERS' },
        { source: 'MANUAL_ENTRY' }
      ],
      'Actype': [
        { actype: 'TRADING', actype_DESC: 'Trading Account', active: true },
        { actype: 'CUSTODY', actype_DESC: 'Custody Account', active: true },
        { actype: 'SETTLEMENT', actype_DESC: 'Settlement Account', active: false }
      ],
      'GkDet': [
        { gk_id: 'GK001', account: 'ACC001', security: 'AAPL', quantity: 1000, price: 150.25, trade_date: '2024-01-15' },
        { gk_id: 'GK002', account: 'ACC002', security: 'MSFT', quantity: 500, price: 342.75, trade_date: '2024-01-16' },
        { gk_id: 'GK003', account: 'ACC001', security: 'GOOGL', quantity: 100, price: 2875.50, trade_date: '2024-01-17' }
      ]
    };

    // Return specific sample data for the table, or generate dynamic data if not found
    if (sampleDataSets[tableName]) {
      return sampleDataSets[tableName];
    }

    // Fallback: generate data based on model properties
    try {
      const columns = getColumnsForTable(tableName);
      const recordCount = 3;
      
      return Array.from({ length: recordCount }, (_, index) => {
        const record: any = {};
        columns.forEach(column => {
          record[column] = `${column}_${index + 1}`;
        });
        return record;
      });
    } catch (error) {
      console.error(`Error generating data for ${tableName}:`, error);
      return [{ message: `No data available for ${tableName}` }];
    }
  }

  // Cleanup expired tokens periodically
  setInterval(async () => {
    try {
      await storage.cleanupExpiredTokens();
    } catch (error) {
      console.error("Error cleaning up expired tokens:", error);
    }
  }, 60 * 60 * 1000); // Every hour

  // Notifications endpoints
  app.get('/api/notifications', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      
      const notifications = await storage.getUserNotifications(userId, limit, offset);
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  // Get unread notification count
  app.get('/api/notifications/unread-count', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const count = await storage.getUnreadNotificationCount(userId);
      res.json({ count });
    } catch (error) {
      console.error("Error fetching unread count:", error);
      res.status(500).json({ message: "Failed to fetch unread count" });
    }
  });

  app.post('/api/notifications', requireAuth, requireAdmin, async (req: any, res) => {
    try {
      const notificationData = insertNotificationSchema.parse(req.body);
      const notification = await storage.createNotification(notificationData);
      res.status(201).json(notification);
    } catch (error) {
      console.error("Error creating notification:", error);
      res.status(500).json({ message: "Failed to create notification" });
    }
  });

  // Create system-wide announcement
  app.post('/api/notifications/announcement', requireAuth, requireAdmin, async (req: any, res) => {
    try {
      const { title, message, priority } = req.body;
      
      await notificationService.notifySystemAnnouncement(title, message, priority);
      res.json({ message: "Announcement sent to all users" });
    } catch (error) {
      console.error("Error creating announcement:", error);
      res.status(500).json({ message: "Failed to create announcement" });
    }
  });

  // Mark notification as read
  app.patch('/api/notifications/:id/read', requireAuth, async (req: any, res) => {
    try {
      const notificationId = parseInt(req.params.id);
      const userId = req.user.id;
      
      const success = await storage.markNotificationAsRead(notificationId, userId);
      if (success) {
        res.json({ message: "Notification marked as read" });
      } else {
        res.status(404).json({ message: "Notification not found" });
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  // Mark all notifications as read
  app.patch('/api/notifications/read-all', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      await storage.markAllNotificationsAsRead(userId);
      res.json({ message: "All notifications marked as read" });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      res.status(500).json({ message: "Failed to mark all notifications as read" });
    }
  });

  // Admin delete user
  app.delete('/api/admin/users/:id', requireAuth, async (req: any, res) => {
    try {
      const currentUserId = req.user.id;
      const currentUser = await storage.getUser(currentUserId);
      
      if (currentUser?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { id } = req.params;
      await storage.deleteUser(id);
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  // Update user profile
  app.patch('/api/user/profile', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { firstName, lastName, profileImageUrl } = req.body;
      
      // Validate input
      const updateData: any = {};
      if (firstName !== undefined) updateData.firstName = firstName.trim();
      if (lastName !== undefined) updateData.lastName = lastName.trim();
      if (profileImageUrl !== undefined) updateData.profileImageUrl = profileImageUrl.trim();
      
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: "No valid fields to update" });
      }

      const updatedUser = await storage.updateUserProfile(userId, updateData);
      // Remove password from response
      const { password: _, ...userResponse } = updatedUser;
      res.json({ message: "Profile updated successfully", user: userResponse });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // External Components routes
  app.get('/api/external-components', requireAuth, async (req, res) => {
    try {
      const components = await storage.getExternalComponents();
      res.json(components);
    } catch (error) {
      console.error("Error fetching external components:", error);
      res.status(500).json({ message: "Failed to fetch external components" });
    }
  });

  app.post('/api/external-components', requireAuth, async (req, res) => {
    try {
      const userId = req.user?.id;
      const componentData = {
        ...req.body,
        id: nanoid(),
        createdBy: userId,
      };
      
      const component = await storage.createExternalComponent(componentData);
      res.json(component);
    } catch (error) {
      console.error("Error creating external component:", error);
      res.status(500).json({ message: "Failed to create external component" });
    }
  });

  app.delete('/api/external-components/:id', requireAuth, async (req, res) => {
    try {
      await storage.deleteExternalComponent(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting external component:", error);
      res.status(500).json({ message: "Failed to delete external component" });
    }
  });

  // Import/Export routes
  app.post('/api/export/programs', requireAuth, async (req, res) => {
    try {
      const { programIds, exportOptions } = req.body;
      const programs = await storage.exportPrograms(programIds);
      
      let exportData = programs;
      
      if (!exportOptions.includeValidations) {
        exportData = exportData.map(p => ({ ...p, validations: [] }));
      }
      
      res.json({
        exported_at: new Date().toISOString(),
        export_options: exportOptions,
        programs: exportData
      });
    } catch (error) {
      console.error("Error exporting programs:", error);
      res.status(500).json({ message: "Failed to export programs" });
    }
  });

  app.post('/api/import/programs', requireAuth, async (req, res) => {
    try {
      const importData = req.body;
      let programsToImport = [];
      
      if (importData.programs) {
        programsToImport = importData.programs;
      } else if (Array.isArray(importData)) {
        programsToImport = importData;
      } else {
        programsToImport = [importData];
      }
      
      const result = await storage.importPrograms(programsToImport);
      
      res.json({
        totalPrograms: programsToImport.length,
        importedPrograms: result.imported,
        skippedPrograms: result.skipped,
        errors: result.errors
      });
    } catch (error) {
      console.error("Error importing programs:", error);
      res.status(500).json({ message: "Failed to import programs" });
    }
  });

  app.get('/api/export/templates', requireAuth, async (req, res) => {
    try {
      const templates = await storage.getFormTemplates();
      res.json({
        exported_at: new Date().toISOString(),
        templates
      });
    } catch (error) {
      console.error("Error exporting templates:", error);
      res.status(500).json({ message: "Failed to export templates" });
    }
  });

  // Advanced AI Assistant Routes
  app.post("/api/ai/chat", requireAuth, async (req, res) => {
    try {
      const { message, context } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      // Use interactive session for step-by-step questioning
      const response = await aiAssistant.createInteractiveSession(message, context);
      res.json(response);
    } catch (error) {
      console.error("AI chat error:", error);
      res.status(500).json({ error: "Failed to generate AI response" });
    }
  });

  app.post("/api/ai/analyze-code", requireAuth, async (req, res) => {
    try {
      const { code, language } = req.body;
      
      if (!code) {
        return res.status(400).json({ error: "Code is required" });
      }

      const response = await aiAssistant.analyzeCode(code, language);
      res.json(response);
    } catch (error) {
      console.error("AI code analysis error:", error);
      res.status(500).json({ error: "Failed to analyze code" });
    }
  });

  app.post("/api/ai/convert-dfm", requireAuth, async (req, res) => {
    try {
      const { dfmContent, infoContent } = req.body;
      
      if (!dfmContent) {
        return res.status(400).json({ error: "DFM content is required" });
      }

      const response = await aiAssistant.convertDFMToJSON(dfmContent, infoContent);
      res.json(response);
    } catch (error) {
      console.error("AI DFM conversion error:", error);
      res.status(500).json({ error: "Failed to convert DFM to JSON" });
    }
  });

  app.post("/api/ai/analyze-dfm", requireAuth, async (req, res) => {
    try {
      const { dfmContent } = req.body;
      
      if (!dfmContent) {
        return res.status(400).json({ error: "DFM content is required" });
      }

      const response = await aiAssistant.analyzeDfmFile(dfmContent);
      res.json(response);
    } catch (error) {
      console.error("AI DFM analysis error:", error);
      res.status(500).json({ error: "Failed to analyze DFM file" });
    }
  });

  app.post("/api/ai/generate-form", requireAuth, async (req, res) => {
    try {
      const { formType, specifications } = req.body;
      
      if (!formType) {
        return res.status(400).json({ error: "Form type is required" });
      }

      const response = await aiAssistant.generateFormType(formType, specifications);
      res.json(response);
    } catch (error) {
      console.error("AI form generation error:", error);
      res.status(500).json({ error: "Failed to generate form" });
    }
  });

  app.post("/api/ai/explain", requireAuth, async (req, res) => {
    try {
      const { concept, level } = req.body;
      
      if (!concept) {
        return res.status(400).json({ error: "Concept is required" });
      }

      const response = await aiAssistant.explainConcept(concept, level || 'intermediate');
      res.json(response);
    } catch (error) {
      console.error("AI explanation error:", error);
      res.status(500).json({ error: "Failed to explain concept" });
    }
  });

  app.post("/api/ai/solve-problem", requireAuth, async (req, res) => {
    try {
      const { problem, context } = req.body;
      
      if (!problem) {
        return res.status(400).json({ error: "Problem is required" });
      }

      const response = await aiAssistant.solveProblem(problem, context);
      res.json(response);
    } catch (error) {
      console.error("AI problem solving error:", error);
      res.status(500).json({ error: "Failed to solve problem" });
    }
  });

  // AI Assistant routes for users
  app.post('/api/ai/chat', requireAuth, async (req: any, res) => {
    try {
      const { message, userId } = req.body;
      
      if (!message || !userId) {
        return res.status(400).json({ message: 'Message and userId are required' });
      }
      
      console.log('AI Chat request:', { message, userId });
      
      // Enhanced AI response with context
      const aiResponse = await generateAIResponse(message, userId);
      
      res.json({
        message: aiResponse.message,
        validationResult: aiResponse.validationResult,
        generatedJSON: aiResponse.generatedJSON
      });
    } catch (error) {
      console.error('AI Chat error:', error);
      res.status(500).json({ message: 'Failed to process AI request' });
    }
  });

  // JSON Validator route
  app.post('/api/ai/validate', requireAuth, async (req: any, res) => {
    try {
      const { json, userId } = req.body;
      
      if (!json || !userId) {
        return res.status(400).json({ message: 'JSON and userId are required' });
      }
      
      console.log('JSON Validation request:', { userId });
      
      const validationResult = await validateJSON(json);
      
      res.json(validationResult);
    } catch (error) {
      console.error('JSON Validation error:', error);
      res.status(500).json({ message: 'Failed to validate JSON' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
