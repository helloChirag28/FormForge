'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { FormBuilder } from '@/components/form-builder/FormBuilder';
import { Header } from '@/components/form-builder/Header';

function BuilderContent() {
  const searchParams = useSearchParams();
  const [initialPrompt, setInitialPrompt] = useState('');

  useEffect(() => {
    const prompt = searchParams.get('prompt');
    if (prompt) {
      setInitialPrompt(prompt);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Form Builder</h1>
            <p className="text-gray-600">Describe your form and watch AI create it instantly</p>
          </div>
          
          <FormBuilder initialPrompt={initialPrompt} />
        </motion.div>
      </main>
    </div>
  );
}

export default function BuilderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading builder...</p>
        </div>
      </div>
    }>
      <BuilderContent />
    </Suspense>
  );
}