'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GeneratedForm } from '@/types/form';
import { PromptInput } from './PromptInput';
import { FormPreview } from './FormPreview';
import { FormEditor } from './FormEditor';
import { ExportPanel } from './ExportPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface FormBuilderProps {
  initialPrompt?: string;
}

export function FormBuilder({ initialPrompt = '' }: FormBuilderProps) {
  const [form, setForm] = useState<GeneratedForm | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('preview');

  const handleFormGenerated = (generatedForm: GeneratedForm) => {
    setForm(generatedForm);
    setActiveTab('preview');
  };

  const handleFormUpdate = (updatedForm: GeneratedForm) => {
    setForm(updatedForm);
  };

  return (
    <div className="space-y-8">
      {/* Prompt Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <PromptInput
          initialPrompt={initialPrompt}
          onGenerate={handleFormGenerated}
          isGenerating={isGenerating}
          setIsGenerating={setIsGenerating}
        />
      </motion.div>

      {/* Form Preview/Editor */}
      <AnimatePresence>
        {form && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-xl shadow-lg border"
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="border-b px-6 py-4">
                <TabsList className="grid w-full max-w-md grid-cols-3">
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="edit">Edit</TabsTrigger>
                  <TabsTrigger value="export">Export</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="preview" className="p-6">
                <FormPreview form={form} />
              </TabsContent>

              <TabsContent value="edit" className="p-6">
                <FormEditor form={form} onUpdate={handleFormUpdate} />
              </TabsContent>

              <TabsContent value="export" className="p-6">
                <ExportPanel form={form} />
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl shadow-lg border p-8 text-center"
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
                <div className="w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent animate-spin absolute top-0"></div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Generating your form...</h3>
                <p className="text-gray-600">AI is crafting the perfect form for your needs</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}