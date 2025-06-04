import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, requireAuth, requireAdmin } from "./auth";
import { setupEnhancedAuth, requireAuth as requireAuthEnhanced, requireAdmin as requireAdminEnhanced, requireUser } from "./auth-enhanced";
import { insertFormSchema, insertTemplateSchema } from "@shared/schema";
import { apiService, type ApiDataSource } from "./services/apiService";
import crypto from "crypto";

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

  // Form management routes
  app.get('/api/forms', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const forms = await storage.getForms(userId);
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

  app.post('/api/forms', requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const formData = insertFormSchema.parse({
        ...req.body,
        createdBy: userId
      });

      const newForm = await storage.createForm(formData);
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
      
      await storage.deleteTemplate(id, userId);
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
      
      await storage.deleteForm(id, userId);
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

  // Cleanup expired tokens periodically
  setInterval(async () => {
    try {
      await storage.cleanupExpiredTokens();
    } catch (error) {
      console.error("Error cleaning up expired tokens:", error);
    }
  }, 60 * 60 * 1000); // Every hour

  const httpServer = createServer(app);
  return httpServer;
}
