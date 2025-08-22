import Anthropic from '@anthropic-ai/sdk';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface ValidationResult {
  isValid: boolean;
  score: number;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

interface AIResponse {
  message: string;
  validationResult?: ValidationResult;
  generatedJSON?: any;
}

export async function generateAIResponse(message: string, userId: string): Promise<AIResponse> {
  try {
    console.log('Generating AI response for user:', userId);
    
    // Enhanced system prompt for user assistance
    const systemPrompt = `You are Alex, an intelligent AI assistant specializing in form building and program development. You help users with:

1. Form validation and error checking
2. JSON structure validation and optimization
3. Code suggestions and improvements
4. Program structure analysis
5. Best practices recommendations
6. Technical explanations in simple terms

Guidelines:
- Be friendly, helpful, and encouraging
- Provide clear, actionable advice
- Use simple language that non-technical users can understand
- Offer specific examples when possible
- Focus on practical solutions
- If asked to validate JSON, provide detailed feedback
- If asked to create forms, generate proper JSON structures

Current conversation context: User is asking for help with form building and validation.`;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: message
        }
      ]
    });

    const aiMessage = response.content[0].type === 'text' ? response.content[0].text : '';
    
    // Check if the user is asking for JSON validation or generation
    let validationResult: ValidationResult | undefined;
    let generatedJSON: any;
    
    if (message.toLowerCase().includes('validate') || message.toLowerCase().includes('json')) {
      // If there's JSON in the message, try to validate it
      const jsonMatch = message.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        validationResult = await validateJSON(jsonMatch[1]);
      }
    }
    
    // Check if the user is asking for form generation
    if (message.toLowerCase().includes('create') || message.toLowerCase().includes('generate')) {
      if (message.toLowerCase().includes('form')) {
        generatedJSON = await generateSampleForm(message);
      }
    }
    
    return {
      message: aiMessage,
      validationResult,
      generatedJSON
    };
    
  } catch (error) {
    console.error('AI response generation error:', error);
    return {
      message: "I'm sorry, I'm having trouble processing your request right now. Please try again or rephrase your question."
    };
  }
}

export async function validateJSON(jsonString: string): Promise<ValidationResult> {
  const result: ValidationResult = {
    isValid: false,
    score: 0,
    errors: [],
    warnings: [],
    suggestions: []
  };
  
  try {
    // First, try to parse the JSON
    let parsedJSON: any;
    try {
      parsedJSON = JSON.parse(jsonString);
      result.isValid = true;
      result.score += 30; // Base score for valid JSON
    } catch (parseError) {
      result.errors.push('Invalid JSON syntax: ' + (parseError as Error).message);
      return result;
    }
    
    // Validate form structure
    if (typeof parsedJSON === 'object' && parsedJSON !== null) {
      result.score += 20; // Valid object structure
      
      // Check for required form fields
      const requiredFields = ['menuId', 'label', 'fields'];
      const missingFields = requiredFields.filter(field => !parsedJSON.hasOwnProperty(field));
      
      if (missingFields.length === 0) {
        result.score += 20; // All required fields present
      } else {
        result.errors.push(`Missing required fields: ${missingFields.join(', ')}`);
      }
      
      // Validate fields array
      if (Array.isArray(parsedJSON.fields)) {
        result.score += 15; // Valid fields array
        
        // Check individual field structure
        parsedJSON.fields.forEach((field: any, index: number) => {
          if (!field.id) {
            result.errors.push(`Field ${index + 1} missing 'id' property`);
          }
          if (!field.type) {
            result.errors.push(`Field ${index + 1} missing 'type' property`);
          }
          if (!field.label) {
            result.warnings.push(`Field ${index + 1} missing 'label' property`);
          }
          
          // Validate field types
          const validTypes = ['TEXT', 'SELECT', 'CHECKBOX', 'RADIO', 'TEXTAREA', 'NUMBER', 'EMAIL', 'DATE', 'GRIDLKP', 'LSTLKP'];
          if (field.type && !validTypes.includes(field.type)) {
            result.warnings.push(`Field ${index + 1} has unknown type '${field.type}'`);
          }
        });
        
        if (parsedJSON.fields.length > 0) {
          result.score += 10; // Has fields
        }
      } else if (parsedJSON.fields) {
        result.errors.push('Fields property must be an array');
      }
      
      // Check for validations
      if (Array.isArray(parsedJSON.validations)) {
        result.score += 5; // Has validations
      }
      
      // Performance suggestions
      if (parsedJSON.fields && parsedJSON.fields.length > 20) {
        result.suggestions.push('Consider breaking large forms into multiple steps for better user experience');
      }
      
      // Accessibility suggestions
      if (parsedJSON.fields && parsedJSON.fields.some((field: any) => !field.label)) {
        result.suggestions.push('Add labels to all fields for better accessibility');
      }
      
      // Security suggestions
      if (parsedJSON.fields && parsedJSON.fields.some((field: any) => field.type === 'TEXT' && !field.validation)) {
        result.suggestions.push('Add validation to text fields to prevent malicious input');
      }
    } else {
      result.errors.push('JSON must be an object');
    }
    
    // Cap the score at 100
    result.score = Math.min(100, result.score);
    
    // Add general suggestions based on score
    if (result.score < 50) {
      result.suggestions.push('Consider reviewing the form structure and adding missing required fields');
    } else if (result.score < 80) {
      result.suggestions.push('Good structure! Consider adding more validation and improving field configuration');
    } else {
      result.suggestions.push('Excellent form structure! Consider adding advanced features like conditional fields');
    }
    
  } catch (error) {
    result.errors.push('Unexpected error during validation: ' + (error as Error).message);
  }
  
  return result;
}

export async function generateSampleForm(prompt: string): Promise<any> {
  try {
    console.log('Generating sample form based on prompt:', prompt);
    
    const systemPrompt = `You are a form generation expert. Generate a complete, valid JSON form structure based on the user's request. 

The form should include:
- menuId (unique identifier)
- label (descriptive form name)
- formWidth (default: "700px")
- layout (default: "PROCESS")
- fields array with proper field objects
- validations array
- actions array

Each field should have:
- id (unique)
- type (TEXT, SELECT, CHECKBOX, RADIO, TEXTAREA, NUMBER, EMAIL, DATE, GRIDLKP, LSTLKP)
- label
- required (boolean)
- validation (object with rules)
- options (for SELECT/RADIO fields)

Return ONLY the JSON structure, no explanations.`;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const aiMessage = response.content[0].type === 'text' ? response.content[0].text : '';
    
    // Extract JSON from the response
    const jsonMatch = aiMessage.match(/```json\n([\s\S]*?)\n```/) || aiMessage.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1] || jsonMatch[0]);
      } catch (error) {
        console.error('Failed to parse generated JSON:', error);
      }
    }
    
    // Fallback sample form
    return {
      menuId: "GENERATED_FORM_" + Date.now(),
      label: "AI Generated Form",
      formWidth: "700px",
      layout: "PROCESS",
      fields: [
        {
          id: "field1",
          type: "TEXT",
          label: "Name",
          required: true,
          validation: {
            minLength: 2,
            maxLength: 50
          }
        },
        {
          id: "field2",
          type: "EMAIL",
          label: "Email Address",
          required: true,
          validation: {
            format: "email"
          }
        }
      ],
      validations: [],
      actions: [
        {
          type: "submit",
          label: "Submit"
        }
      ]
    };
    
  } catch (error) {
    console.error('Form generation error:', error);
    return null;
  }
}