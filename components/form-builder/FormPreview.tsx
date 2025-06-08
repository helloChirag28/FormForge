'use client';

import { motion } from 'framer-motion';
import { GeneratedForm, FormField } from '@/types/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

interface FormPreviewProps {
  form: GeneratedForm;
}

export function FormPreview({ form }: FormPreviewProps) {
  const renderField = (field: FormField, sectionIndex: number, fieldIndex: number) => {
    const fieldId = `${sectionIndex}-${fieldIndex}`;

    const baseProps = {
      id: fieldId,
      required: field.required,
      placeholder: field.placeholder,
    };

    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'number':
      case 'password':
      case 'date':
        return (
          <Input
            type={field.type}
            {...baseProps}
            className="w-full"
          />
        );

      case 'textarea':
        return (
          <Textarea
            {...baseProps}
            className="w-full min-h-[100px]"
          />
        );

      case 'select':
        return (
          <Select>
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || `Select ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option, index) => (
                <SelectItem key={index} value={option.toLowerCase().replace(/\s+/g, '-')}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'radio':
        return (
          <RadioGroup>
            {field.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem 
                  value={option.toLowerCase().replace(/\s+/g, '-')} 
                  id={`${fieldId}-${index}`} 
                />
                <Label htmlFor={`${fieldId}-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'checkbox':
        if (field.options && field.options.length > 1) {
          return (
            <div className="space-y-2">
              {field.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox id={`${fieldId}-${index}`} />
                  <Label htmlFor={`${fieldId}-${index}`}>{option}</Label>
                </div>
              ))}
            </div>
          );
        } else {
          return (
            <div className="flex items-center space-x-2">
              <Checkbox id={fieldId} />
              <Label htmlFor={fieldId}>{field.options?.[0] || 'I agree'}</Label>
            </div>
          );
        }

      case 'file':
        return (
          <Input
            type="file"
            {...baseProps}
            className="w-full"
          />
        );

      default:
        return (
          <Input
            type="text"
            {...baseProps}
            className="w-full"
          />
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto"
    >
      <div className="space-y-8">
        {/* Form Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">{form.title}</h1>
          {form.description && (
            <p className="text-gray-600">{form.description}</p>
          )}
        </div>

        {/* Form Sections */}
        <form className="space-y-8">
          {form.sections.map((section, sectionIndex) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
              className="space-y-6"
            >
              {/* Section Header */}
              {form.sections.length > 1 && (
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
                  {section.description && (
                    <p className="text-gray-600">{section.description}</p>
                  )}
                  {sectionIndex > 0 && <Separator />}
                </div>
              )}

              {/* Section Fields */}
              <div className="grid gap-6">
                {section.fields.map((field, fieldIndex) => (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (sectionIndex * 0.1) + (fieldIndex * 0.05) }}
                    className="space-y-2"
                  >
                    <Label htmlFor={`${sectionIndex}-${fieldIndex}`} className="text-sm font-medium">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    
                    {renderField(field, sectionIndex, fieldIndex)}
                    
                    {field.description && (
                      <p className="text-xs text-gray-500">{field.description}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: form.sections.length * 0.1 }}
            className="flex justify-center pt-6"
          >
            <Button type="submit" size="lg" className="min-w-[200px]">
              Submit Form
            </Button>
          </motion.div>
        </form>
      </div>
    </motion.div>
  );
}