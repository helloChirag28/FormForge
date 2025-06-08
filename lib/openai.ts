import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateForm(prompt: string) {
  const systemPrompt = `You are a form builder AI. Given a user prompt, generate a comprehensive form structure in JSON format.

The response should be a JSON object with this exact structure:
{
  "title": "Form Title",
  "description": "Optional form description",
  "sections": [
    {
      "id": "unique-section-id",
      "title": "Section Title",
      "description": "Optional section description",
      "fields": [
        {
          "id": "unique-field-id",
          "type": "text|email|tel|number|password|textarea|select|checkbox|radio|date|file",
          "label": "Field Label",
          "placeholder": "Optional placeholder text",
          "required": true|false,
          "options": ["option1", "option2"] // Only for select, radio, checkbox
          "validation": {
            "minLength": 2,
            "maxLength": 100,
            "pattern": "regex pattern",
            "min": 0,
            "max": 100
          },
          "description": "Optional field description"
        }
      ]
    }
  ]
}

Rules:
1. Always include at least one section
2. Use appropriate field types for the context
3. Set reasonable validation rules
4. Make required fields logical for the form type
5. Use clear, descriptive labels
6. Include helpful placeholder text
7. For multi-step forms, create multiple sections
8. Return ONLY valid JSON, no markdown or explanation`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response
    const formData = JSON.parse(response);
    return { success: true, form: formData };
  } catch (error) {
    console.error('OpenAI API error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to generate form'
    };
  }
}