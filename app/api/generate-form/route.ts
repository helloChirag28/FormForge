import { NextRequest, NextResponse } from 'next/server';

// Function to sanitize form data and ensure options are always strings
function sanitizeFormData(formData: any): any {
  if (!formData || typeof formData !== 'object') {
    return formData;
  }

  const sanitized = { ...formData };
  
  if (sanitized.sections && Array.isArray(sanitized.sections)) {
    sanitized.sections = sanitized.sections.map((section: any) => {
      if (section.fields && Array.isArray(section.fields)) {
        section.fields = section.fields.map((field: any) => {
          if (field.options && Array.isArray(field.options)) {
            field.options = field.options.map((option: any) => String(option || ''));
          }
          return field;
        });
      }
      return section;
    });
  }
  
  return sanitized;
}

// Function to generate form using Ollama
async function generateWithOllama(prompt: string) {
  try {
    const systemPrompt = `You are a form builder AI. Generate a comprehensive form structure in JSON format.

The response MUST be a valid JSON object with this EXACT structure:
{
  "title": "Form Title",
  "description": "Optional form description",
  "sections": [
    {
      "id": "section-1",
      "title": "Section Title",
      "description": "Optional section description",
      "fields": [
        {
          "id": "field-1",
          "type": "text",
          "label": "Field Label",
          "placeholder": "Optional placeholder text",
          "required": true,
          "options": [],
          "validation": {
            "minLength": 2,
            "maxLength": 100
          },
          "description": "Optional field description"
        }
      ]
    }
  ]
}

Field types available: text, email, tel, number, password, textarea, select, checkbox, radio, date, file

IMPORTANT: Return ONLY the JSON object. Do not include any markdown, explanations, or extra text.`;

    const userPrompt = `Create a form for: ${prompt}

Return only valid JSON following the exact structure above.`;

    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3.2:3b',
        prompt: systemPrompt + "\n\n" + userPrompt,
        stream: false,
        options: {
          temperature: 0.3,
          top_p: 0.8,
          max_tokens: 1500,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json();
    let content = data.response;

    if (!content) {
      throw new Error('No response from Ollama');
    }

    // Clean the response
    content = content.trim();
    content = content.replace(/^```json\s*/i, '');
    content = content.replace(/```\s*$/i, '');
    content = content.replace(/^[^{]*/, '');
    content = content.trim();

    // Find JSON object
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }

    const formData = JSON.parse(jsonMatch[0]);
    
    // Validate the structure
    if (!formData.title || !formData.sections || !Array.isArray(formData.sections)) {
      throw new Error('Invalid form structure');
    }

    // Sanitize the form data to ensure options are always strings
    const sanitizedForm = sanitizeFormData(formData);

    return sanitizedForm;
  } catch (error) {
    console.error('Ollama generation failed:', error);
    throw error;
  }
}

// Simple fallback form generation
function generateSimpleForm(prompt: string) {
  if (prompt.toLowerCase().includes('job') || prompt.toLowerCase().includes('application')) {
    return {
      title: "Job Application Form",
      description: "Apply for a position with our company",
      sections: [
        {
          id: "personal-info",
          title: "Personal Information",
          description: "Please provide your basic information",
          fields: [
            {
              id: "name",
              type: "text",
              label: "Full Name",
              placeholder: "Enter your full name",
              required: true,
              options: [],
              validation: { minLength: 2, maxLength: 100 },
              description: "Your legal full name"
            },
            {
              id: "email",
              type: "email",
              label: "Email Address",
              placeholder: "your.email@example.com",
              required: true,
              options: [],
              validation: { pattern: "^[^@]+@[^@]+\\.[^@]+$" },
              description: "A valid email address"
            },
            {
              id: "phone",
              type: "tel",
              label: "Phone Number",
              placeholder: "+1 (555) 123-4567",
              required: true,
              options: [],
              validation: { pattern: "^[+]?[1-9]?[0-9]{7,15}$" },
              description: "Your contact phone number"
            }
          ]
        },
        {
          id: "experience",
          title: "Work Experience",
          description: "Tell us about your professional background",
          fields: [
            {
              id: "resume",
              type: "file",
              label: "Upload Resume",
              placeholder: "",
              required: true,
              options: [],
              validation: {},
              description: "Upload your resume (PDF, DOC, or DOCX)"
            },
            {
              id: "experience",
              type: "textarea",
              label: "Work Experience",
              placeholder: "Describe your relevant work experience...",
              required: true,
              options: [],
              validation: { minLength: 50, maxLength: 1000 },
              description: "Briefly describe your work experience"
            }
          ]
        }
      ]
    };
  } else if (prompt.toLowerCase().includes('contact')) {
    return {
      title: "Contact Form",
      description: "Get in touch with us",
      sections: [
        {
          id: "contact-section",
          title: "Contact Information",
          description: "How can we help you?",
          fields: [
            {
              id: "name",
              type: "text",
              label: "Full Name",
              placeholder: "Enter your full name",
              required: true,
              options: [],
              validation: { minLength: 2, maxLength: 50 },
              description: "Your first and last name"
            },
            {
              id: "email",
              type: "email",
              label: "Email Address",
              placeholder: "Enter your email",
              required: true,
              options: [],
              validation: { pattern: "^[^@]+@[^@]+\\.[^@]+$" },
              description: "A valid email address"
            },
            {
              id: "subject",
              type: "select",
              label: "Subject",
              placeholder: "Select a subject",
              required: true,
              options: ["General Inquiry", "Support", "Sales", "Feedback"],
              validation: {},
              description: "What is this about?"
            },
            {
              id: "message",
              type: "textarea",
              label: "Message",
              placeholder: "Enter your message",
              required: true,
              options: [],
              validation: { minLength: 10, maxLength: 500 },
              description: "Your message or inquiry"
            }
          ]
        }
      ]
    };
  } else if (prompt.toLowerCase().includes('survey') || prompt.toLowerCase().includes('feedback')) {
    return {
      title: "Customer Feedback Survey",
      description: "Help us improve our service",
      sections: [
        {
          id: "feedback-section",
          title: "Your Feedback",
          description: "We value your opinion",
          fields: [
            {
              id: "name",
              type: "text",
              label: "Name (Optional)",
              placeholder: "Your name",
              required: false,
              options: [],
              validation: { maxLength: 50 },
              description: "Optional: Tell us your name"
            },
            {
              id: "rating",
              type: "radio",
              label: "Overall Rating",
              placeholder: "",
              required: true,
              options: ["Excellent", "Good", "Fair", "Poor"],
              validation: {},
              description: "How would you rate our service?"
            },
            {
              id: "feedback",
              type: "textarea",
              label: "Additional Comments",
              placeholder: "Tell us more about your experience...",
              required: false,
              options: [],
              validation: { maxLength: 1000 },
              description: "Any additional feedback you'd like to share"
            }
          ]
        }
      ]
    };
  } else {
    // Default form
    return {
      title: "Contact Form",
      description: "Please fill out this form",
      sections: [
        {
          id: "default-section",
          title: "Information",
          description: "Please provide your details",
          fields: [
            {
              id: "name",
              type: "text",
              label: "Name",
              placeholder: "Enter your name",
              required: true,
              options: [],
              validation: { minLength: 2, maxLength: 50 },
              description: "Your name"
            },
            {
              id: "email",
              type: "email",
              label: "Email",
              placeholder: "Enter your email",
              required: true,
              options: [],
              validation: { pattern: "^[^@]+@[^@]+\\.[^@]+$" },
              description: "Your email address"
            }
          ]
        }
      ]
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Try Ollama first, fallback to simple generation
    let form;
    try {
      console.log('Attempting Ollama generation...');
      form = await generateWithOllama(prompt);
      console.log('Ollama generation successful!');
    } catch (error) {
      console.log('Ollama failed, using simple generation...');
      form = generateSimpleForm(prompt);
    }

    return NextResponse.json({ success: true, form });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 