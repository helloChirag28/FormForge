'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, GripVertical, Edit2 } from 'lucide-react';
import { GeneratedForm, FormField, FormSection } from '@/types/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface FormEditorProps {
  form: GeneratedForm;
  onUpdate: (form: GeneratedForm) => void;
}

const fieldTypes = [
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
  { value: 'tel', label: 'Phone' },
  { value: 'number', label: 'Number' },
  { value: 'password', label: 'Password' },
  { value: 'textarea', label: 'Textarea' },
  { value: 'select', label: 'Select' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'radio', label: 'Radio' },
  { value: 'date', label: 'Date' },
  { value: 'file', label: 'File Upload' },
];

export function FormEditor({ form, onUpdate }: FormEditorProps) {
  const [editingField, setEditingField] = useState<string | null>(null);

  const updateForm = (updates: Partial<GeneratedForm>) => {
    onUpdate({ ...form, ...updates });
  };

  const updateSection = (sectionIndex: number, updates: Partial<FormSection>) => {
    const newSections = [...form.sections];
    newSections[sectionIndex] = { ...newSections[sectionIndex], ...updates };
    updateForm({ sections: newSections });
  };

  const updateField = (sectionIndex: number, fieldIndex: number, updates: Partial<FormField>) => {
    const newSections = [...form.sections];
    newSections[sectionIndex].fields[fieldIndex] = {
      ...newSections[sectionIndex].fields[fieldIndex],
      ...updates
    };
    updateForm({ sections: newSections });
  };

  const addField = (sectionIndex: number) => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type: 'text',
      label: 'New Field',
      required: false,
    };

    const newSections = [...form.sections];
    newSections[sectionIndex].fields.push(newField);
    updateForm({ sections: newSections });
    toast.success('Field added successfully');
  };

  const removeField = (sectionIndex: number, fieldIndex: number) => {
    const newSections = [...form.sections];
    newSections[sectionIndex].fields.splice(fieldIndex, 1);
    updateForm({ sections: newSections });
    toast.success('Field removed successfully');
  };

  const addSection = () => {
    const newSection: FormSection = {
      id: `section-${Date.now()}`,
      title: 'New Section',
      fields: []
    };

    updateForm({ sections: [...form.sections, newSection] });
    toast.success('Section added successfully');
  };

  const removeSection = (sectionIndex: number) => {
    if (form.sections.length === 1) {
      toast.error('Cannot remove the last section');
      return;
    }

    const newSections = form.sections.filter((_, index) => index !== sectionIndex);
    updateForm({ sections: newSections });
    toast.success('Section removed successfully');
  };

  return (
    <div className="space-y-6">
      {/* Form Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit2 className="w-5 h-5" />
            Form Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="form-title">Form Title</Label>
            <Input
              id="form-title"
              value={form.title}
              onChange={(e) => updateForm({ title: e.target.value })}
              placeholder="Enter form title"
            />
          </div>
          <div>
            <Label htmlFor="form-description">Form Description</Label>
            <Textarea
              id="form-description"
              value={form.description || ''}
              onChange={(e) => updateForm({ description: e.target.value })}
              placeholder="Enter form description (optional)"
            />
          </div>
        </CardContent>
      </Card>

      {/* Sections */}
      <div className="space-y-6">
        {form.sections.map((section, sectionIndex) => (
          <Card key={section.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <GripVertical className="w-5 h-5 text-gray-400" />
                  Section {sectionIndex + 1}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addField(sectionIndex)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Field
                  </Button>
                  {form.sections.length > 1 && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeSection(sectionIndex)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Section Settings */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor={`section-title-${sectionIndex}`}>Section Title</Label>
                  <Input
                    id={`section-title-${sectionIndex}`}
                    value={section.title}
                    onChange={(e) => updateSection(sectionIndex, { title: e.target.value })}
                    placeholder="Enter section title"
                  />
                </div>
                <div>
                  <Label htmlFor={`section-description-${sectionIndex}`}>Section Description</Label>
                  <Textarea
                    id={`section-description-${sectionIndex}`}
                    value={section.description || ''}
                    onChange={(e) => updateSection(sectionIndex, { description: e.target.value })}
                    placeholder="Enter section description (optional)"
                  />
                </div>
              </div>

              <Separator />

              {/* Fields */}
              <div className="space-y-4">
                <h4 className="font-medium">Fields</h4>
                {section.fields.map((field, fieldIndex) => (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border rounded-lg p-4 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{field.label}</span>
                        <span className="text-sm text-gray-500">({field.type})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingField(editingField === field.id ? null : field.id)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeField(sectionIndex, fieldIndex)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {editingField === field.id && (
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                        <div>
                          <Label>Field Label</Label>
                          <Input
                            value={field.label}
                            onChange={(e) => updateField(sectionIndex, fieldIndex, { label: e.target.value })}
                            placeholder="Enter field label"
                          />
                        </div>
                        <div>
                          <Label>Field Type</Label>
                          <Select
                            value={field.type}
                            onValueChange={(value: any) => updateField(sectionIndex, fieldIndex, { type: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {fieldTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Placeholder</Label>
                          <Input
                            value={field.placeholder || ''}
                            onChange={(e) => updateField(sectionIndex, fieldIndex, { placeholder: e.target.value })}
                            placeholder="Enter placeholder text"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={field.required}
                            onCheckedChange={(checked) => updateField(sectionIndex, fieldIndex, { required: checked })}
                          />
                          <Label>Required field</Label>
                        </div>
                        {(field.type === 'select' || field.type === 'radio' || field.type === 'checkbox') && (
                          <div className="col-span-2">
                            <Label>Options (one per line)</Label>
                            <Textarea
                              value={field.options?.join('\n') || ''}
                              onChange={(e) => updateField(sectionIndex, fieldIndex, { 
                                options: e.target.value.split('\n').filter(option => option.trim())
                              })}
                              placeholder="Option 1&#10;Option 2&#10;Option 3"
                            />
                          </div>
                        )}
                        <div className="col-span-2">
                          <Label>Description</Label>
                          <Textarea
                            value={field.description || ''}
                            onChange={(e) => updateField(sectionIndex, fieldIndex, { description: e.target.value })}
                            placeholder="Enter field description (optional)"
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}

                {section.fields.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No fields in this section</p>
                    <Button
                      variant="outline"
                      onClick={() => addField(sectionIndex)}
                      className="mt-2"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Field
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add Section Button */}
        <div className="text-center">
          <Button variant="outline" onClick={addSection}>
            <Plus className="w-4 h-4 mr-2" />
            Add Section
          </Button>
        </div>
      </div>
    </div>
  );
}