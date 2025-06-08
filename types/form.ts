export interface FormField {
  id: string;
  type: 'text' | 'email' | 'tel' | 'number' | 'password' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'file';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // For select, radio, checkbox
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
  description?: string;
}

export interface FormSection {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
}

export interface GeneratedForm {
  title: string;
  description?: string;
  sections: FormSection[];
}

export interface FormGenerationRequest {
  prompt: string;
}

export interface FormGenerationResponse {
  form: GeneratedForm;
  success: boolean;
  error?: string;
}