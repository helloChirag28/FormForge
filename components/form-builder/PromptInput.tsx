'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { GeneratedForm } from '@/types/form';
import { toast } from 'sonner';

interface PromptInputProps {
  initialPrompt?: string;
  onGenerate: (form: GeneratedForm) => void;
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
}

const examplePrompts = [
  'Create a job application form with personal details, experience, and file upload',
  'Build a customer feedback survey for a restaurant',
  'Design a contact form with company information fields',
  'Create a event registration form with dietary preferences',
  'Build a medical appointment booking form'
];

export function PromptInput({ 
  initialPrompt = '', 
  onGenerate, 
  isGenerating, 
  setIsGenerating 
}: PromptInputProps) {
  const [prompt, setPrompt] = useState(initialPrompt);

  useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt);
      handleGenerate(initialPrompt);
    }
  }, [initialPrompt]);

  const handleGenerate = async (promptText: string = prompt) => {
    if (!promptText.trim()) {
      toast.error('Please enter a prompt to generate a form');
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/generate-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText }),
      });

      const data = await response.json();

      if (data.success) {
        onGenerate(data.form);
        toast.success('Form generated successfully!');
      } else {
        toast.error(data.error || 'Failed to generate form');
      }
    } catch (error) {
      console.error('Error generating form:', error);
      toast.error('Failed to generate form. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border p-6">
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            What kind of form do you need?
          </h2>
          <p className="text-gray-600">
            Describe your form in plain English and let AI build it for you
          </p>
        </div>

        <div className="space-y-4">
          <Textarea
            placeholder="Example: Create a job application form with personal details, work experience, and skills sections..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[100px] text-lg"
            disabled={isGenerating}
          />

          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {prompt.length}/500 characters
            </div>
            <Button
              onClick={() => handleGenerate()}
              disabled={isGenerating || !prompt.trim()}
              size="lg"
              className="min-w-[140px]"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Form
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Example Prompts */}
        <div className="border-t pt-4">
          <p className="text-sm font-medium text-gray-700 mb-3">Try these examples:</p>
          <div className="grid sm:grid-cols-2 gap-2">
            {examplePrompts.map((example, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPrompt(example)}
                className="text-left p-3 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={isGenerating}
              >
                {example}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}