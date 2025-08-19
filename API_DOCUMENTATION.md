# FormBuilder Pro - API Documentation

Complete API reference for both React/Express.js and .NET Blazor implementations.

## Base URLs

- **React/Express.js**: `http://localhost:5000/api`
- **.NET Blazor**: `https://localhost:7000/api`

## Authentication

All API endpoints require authentication via session cookies or Bearer tokens.

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "role": "user"
  }
}
```

### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

## Forms API

### List Forms
```http
GET /api/forms
```

Response:
```json
[
  {
    "id": 1,
    "menuId": "FORM_123",
    "label": "Contact Form",
    "description": "Customer contact form",
    "createdAt": "2025-08-19T10:00:00Z",
    "updatedAt": "2025-08-19T10:30:00Z"
  }
]
```

### Get Form
```http
GET /api/forms/{id}
```

Response:
```json
{
  "id": 1,
  "menuId": "FORM_123",
  "label": "Contact Form",
  "description": "Customer contact form",
  "formConfig": {
    "components": [
      {
        "id": "name_field",
        "type": "TEXT",
        "label": "Full Name",
        "required": true,
        "properties": {
          "placeholder": "Enter your full name",
          "maxLength": 100
        }
      }
    ]
  },
  "createdAt": "2025-08-19T10:00:00Z",
  "updatedAt": "2025-08-19T10:30:00Z"
}
```

### Create Form
```http
POST /api/forms
Content-Type: application/json

{
  "menuId": "FORM_456",
  "label": "New Form",
  "description": "Form description",
  "formConfig": {
    "components": []
  }
}
```

### Update Form
```http
PUT /api/forms/{id}
Content-Type: application/json

{
  "label": "Updated Form",
  "description": "Updated description",
  "formConfig": {
    "components": [...]
  }
}
```

### Delete Form
```http
DELETE /api/forms/{id}
```

## Components API

### List Component Types
```http
GET /api/components/types
```

Response:
```json
{
  "basicComponents": {
    "TEXT": {
      "label": "Text Input",
      "icon": "Type",
      "color": "blue",
      "properties": {
        "placeholder": "string",
        "maxLength": "number",
        "minLength": "number",
        "pattern": "string",
        "required": "boolean"
      }
    },
    "TEXTAREA": {
      "label": "Text Area",
      "icon": "AlignLeft",
      "color": "green",
      "properties": {
        "placeholder": "string",
        "rows": "number",
        "maxLength": "number",
        "required": "boolean"
      }
    }
  }
}
```

### Create Custom Component
```http
POST /api/components
Content-Type: application/json

{
  "name": "Custom Button",
  "type": "CUSTOM_BUTTON",
  "category": "custom",
  "properties": {
    "text": {
      "type": "string",
      "default": "Click me",
      "required": true
    },
    "variant": {
      "type": "select",
      "options": ["primary", "secondary", "danger"],
      "default": "primary"
    }
  }
}
```

## External Components API

### List External Components
```http
GET /api/external-components
```

### Create External Component
```http
POST /api/external-components
Content-Type: application/json

{
  "name": "Advanced Lookup",
  "type": "GRIDLKP",
  "description": "Grid lookup component",
  "properties": [
    {
      "name": "dataSource",
      "type": "string",
      "required": true,
      "description": "API endpoint for data"
    },
    {
      "name": "displayField",
      "type": "string",
      "required": true,
      "description": "Field to display"
    }
  ]
}
```

## Validation API

### Validate Form Data
```http
POST /api/forms/{id}/validate
Content-Type: application/json

{
  "formData": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "123-456-7890"
  }
}
```

Response:
```json
{
  "isValid": true,
  "errors": [],
  "warnings": [
    {
      "field": "phone",
      "message": "Phone format could be improved"
    }
  ]
}
```

## AI Assistant API

### Generate Form from Description
```http
POST /api/ai/generate-form
Content-Type: application/json

{
  "description": "Create a user registration form with email, password, and profile information",
  "style": "modern",
  "includeValidation": true
}
```

Response:
```json
{
  "success": true,
  "form": {
    "label": "User Registration",
    "components": [
      {
        "type": "TEXT",
        "label": "Email Address",
        "required": true,
        "properties": {
          "placeholder": "Enter your email",
          "pattern": "^[^@]+@[^@]+\\.[^@]+$",
          "errorMessage": "Please enter a valid email address"
        }
      }
    ]
  }
}
```

### Ask AI Assistant
```http
POST /api/ai/chat
Content-Type: application/json

{
  "message": "How do I add validation to a phone number field?",
  "context": {
    "currentForm": {...},
    "selectedComponent": "phone_field"
  }
}
```

## File Upload API

### Upload Form Export
```http
POST /api/forms/import
Content-Type: multipart/form-data

file: [JSON file]
```

### Export Form
```http
GET /api/forms/{id}/export?format=json
```

## Notifications API

### Get User Notifications
```http
GET /api/notifications
```

### Mark Notification as Read
```http
PUT /api/notifications/{id}/read
```

### Get Unread Count
```http
GET /api/notifications/unread-count
```

## Error Responses

All endpoints return standardized error responses:

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Invalid form data",
  "details": {
    "field": "email",
    "issue": "Invalid email format"
  }
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Form not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

## Rate Limiting

API endpoints are rate limited:
- **Authentication endpoints**: 5 requests per minute
- **Form operations**: 100 requests per minute
- **AI Assistant**: 10 requests per minute

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1629123456
```

## WebSocket Events (Blazor Only)

### Connect to WebSocket
```javascript
const connection = new signalR.HubConnectionBuilder()
    .withUrl("/formhub")
    .build();
```

### Form Collaboration Events
```javascript
// Join form editing session
connection.invoke("JoinForm", formId);

// Listen for component updates
connection.on("ComponentUpdated", (componentId, properties) => {
    // Handle real-time component updates
});

// Listen for user presence
connection.on("UserJoined", (userId, userName) => {
    // Show user joined notification
});
```

## SDK Examples

### JavaScript/TypeScript
```typescript
import { FormBuilderAPI } from './formbuilder-sdk';

const api = new FormBuilderAPI('http://localhost:5000/api');

// Login
await api.auth.login('user@example.com', 'password');

// Create form
const form = await api.forms.create({
    label: 'Contact Form',
    description: 'Customer contact information'
});

// Add component
await api.forms.addComponent(form.id, {
    type: 'TEXT',
    label: 'Name',
    required: true
});
```

### C# (.NET)
```csharp
using FormBuilder.SDK;

var client = new FormBuilderClient("https://localhost:7000/api");

// Login
await client.Auth.LoginAsync("user@example.com", "password");

// Create form
var form = await client.Forms.CreateAsync(new CreateFormRequest
{
    Label = "Contact Form",
    Description = "Customer contact information"
});

// Add component
await client.Forms.AddComponentAsync(form.Id, new FormComponent
{
    Type = "TEXT",
    Label = "Name",
    Required = true
});
```

## Testing

### Example cURL Commands

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get forms
curl -X GET http://localhost:5000/api/forms \
  -H "Authorization: Bearer your_token_here"

# Create form
curl -X POST http://localhost:5000/api/forms \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_token_here" \
  -d '{"label":"Test Form","description":"Test description"}'
```

---

**API Version**: 2.0.0  
**Last Updated**: August 2025