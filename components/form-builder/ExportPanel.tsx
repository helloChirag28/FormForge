'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Download, Code, FileJson, ExternalLink } from 'lucide-react';
import { GeneratedForm } from '@/types/form';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface ExportPanelProps {
  form: GeneratedForm;
}

export function ExportPanel({ form }: ExportPanelProps) {
  const [activeFormat, setActiveFormat] = useState('json');

  const generateJSON = () => {
    return JSON.stringify(form, null, 2);
  };

  const generateHTML = () => {
    const renderField = (field: any) => {
      const required = field.required ? ' required' : '';
      const placeholder = field.placeholder ? ` placeholder="${field.placeholder}"` : '';

      switch (field.type) {
        case 'textarea':
          return `    <textarea id="${field.id}" name="${field.id}"${placeholder}${required}></textarea>`;
        case 'select':
          const options = field.options?.map((option: string) => 
            `      <option value="${option.toLowerCase().replace(/\s+/g, '-')}">${option}</option>`
          ).join('\n') || '';
          return `    <select id="${field.id}" name="${field.id}"${required}>
      <option value="">${field.placeholder || `Select ${field.label.toLowerCase()}`}</option>
${options}
    </select>`;
        case 'checkbox':
          if (field.options && field.options.length > 1) {
            return field.options.map((option: string, index: number) =>
              `    <label><input type="checkbox" name="${field.id}[]" value="${option.toLowerCase().replace(/\s+/g, '-')}"> ${option}</label>`
            ).join('\n');
          }
          return `    <label><input type="checkbox" id="${field.id}" name="${field.id}"> ${field.options?.[0] || 'I agree'}</label>`;
        case 'radio':
          return field.options?.map((option: string, index: number) =>
            `    <label><input type="radio" name="${field.id}" value="${option.toLowerCase().replace(/\s+/g, '-')}"> ${option}</label>`
          ).join('\n') || '';
        default:
          return `    <input type="${field.type}" id="${field.id}" name="${field.id}"${placeholder}${required}>`;
      }
    };

    const sectionsHTML = form.sections.map(section => {
      const fieldsHTML = section.fields.map(field => `
  <div class="field-group">
    <label for="${field.id}">${field.label}${field.required ? ' *' : ''}</label>
${renderField(field)}
    ${field.description ? `<small>${field.description}</small>` : ''}
  </div>`).join('\n');

      return `  <fieldset>
    <legend>${section.title}</legend>
    ${section.description ? `<p>${section.description}</p>` : ''}
${fieldsHTML}
  </fieldset>`;
    }).join('\n\n');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${form.title}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
    .field-group { margin-bottom: 20px; }
    label { display: block; margin-bottom: 5px; font-weight: bold; }
    input, textarea, select { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
    textarea { min-height: 100px; }
    fieldset { border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
    legend { font-weight: bold; padding: 0 10px; }
    button { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
    small { color: #666; font-size: 0.9em; }
  </style>
</head>
<body>
  <form>
    <h1>${form.title}</h1>
    ${form.description ? `<p>${form.description}</p>` : ''}
    
${sectionsHTML}

    <button type="submit">Submit</button>
  </form>
</body>
</html>`;
  };

  const copyToClipboard = (content: string, format: string) => {
    navigator.clipboard.writeText(content);
    toast.success(`${format.toUpperCase()} copied to clipboard!`);
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`${filename} downloaded!`);
  };

  const jsonContent = generateJSON();
  const htmlContent = generateHTML();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Export Your Form</h2>
        <p className="text-gray-600">Choose your preferred format and export options</p>
      </div>

      <Tabs value={activeFormat} onValueChange={setActiveFormat} className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="json" className="flex items-center gap-2">
            <FileJson className="w-4 h-4" />
            JSON
          </TabsTrigger>
          <TabsTrigger value="html" className="flex items-center gap-2">
            <Code className="w-4 h-4" />
            HTML
          </TabsTrigger>
        </TabsList>

        <TabsContent value="json">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileJson className="w-5 h-5" />
                  JSON Format
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(jsonContent, 'JSON')}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadFile(jsonContent, `${form.title.toLowerCase().replace(/\s+/g, '-')}.json`)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-50 p-4 rounded-lg overflow-auto max-h-96 text-sm">
                <code>{jsonContent}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="html">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  HTML Format
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(htmlContent, 'HTML')}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadFile(htmlContent, `${form.title.toLowerCase().replace(/\s+/g, '-')}.html`)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-50 p-4 rounded-lg overflow-auto max-h-96 text-sm">
                <code>{htmlContent}</code>
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <ExternalLink className="w-8 h-8 mx-auto mb-3 text-blue-600" />
              <h3 className="font-semibold mb-2">Share Form</h3>
              <p className="text-sm text-gray-600 mb-4">
                Generate a shareable link for your form
              </p>
              <Button variant="outline" className="w-full">
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <Download className="w-8 h-8 mx-auto mb-3 text-green-600" />
              <h3 className="font-semibold mb-2">Download All</h3>
              <p className="text-sm text-gray-600 mb-4">
                Get both JSON and HTML files
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  downloadFile(jsonContent, `${form.title.toLowerCase().replace(/\s+/g, '-')}.json`);
                  downloadFile(htmlContent, `${form.title.toLowerCase().replace(/\s+/g, '-')}.html`);
                }}
              >
                Download Bundle
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}