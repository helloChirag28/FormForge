# FormForge - AI-Powered Form Builder

FormForge is an intelligent form builder that uses AI to generate beautiful, functional forms from simple text descriptions. No coding required - just describe what you need, and FormForge creates it for you.

## 🌟 Features

- **AI-Powered Generation**: Describe your form in plain English and watch AI create it instantly
- **Local AI with Ollama**: Free, private AI generation using Ollama (no API keys required)
- **Multiple Form Types**: Contact forms, job applications, surveys, feedback forms, and more
- **Smart Fallbacks**: Works even when AI is unavailable with intelligent form templates
- **Beautiful UI**: Modern, responsive design with smooth animations
- **Production Ready**: Built-in validation, clean code output, and export options
- **Real-time Preview**: See your form as it's being built
- **Multiple Export Formats**: JSON, HTML, and shareable links

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- [Ollama](https://ollama.com/) (for AI generation)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FormBuilderUsingAI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install and set up Ollama**
   ```bash
   # On macOS
   brew install ollama
   
   # Start Ollama service
   brew services start ollama
   
   # Download the Llama 3.2 model
   ollama pull llama3.2:3b
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🤖 AI Integration

FormForge uses **Ollama** for local AI generation, which means:
- ✅ **Completely Free** - No API keys or usage limits
- ✅ **Private** - Your data never leaves your machine
- ✅ **Fast** - Local processing with the efficient Llama 3.2:3b model
- ✅ **Reliable** - Smart fallbacks when AI is unavailable

### Supported Models

- **Primary**: Llama 3.2:3b (recommended for speed and quality)
- **Alternative**: Any Ollama-compatible model (modify in `app/api/generate-form/route.ts`)

## 📝 Usage Examples

Try these prompts in FormForge:

### Basic Forms
- "Create a contact form with name, email, and message"
- "Build a job application form"
- "Design a customer feedback survey"

### Advanced Forms
- "Create a registration form for a cooking class with dietary restrictions"
- "Build a medical appointment booking form with time slots"
- "Design a product order form with multiple options"

### Event Forms
- "Create an event registration form with RSVP and meal preferences"
- "Build a conference signup form with session selections"

## 🏗️ Technical Stack

- **Frontend**: Next.js 13, React, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **UI Components**: Radix UI primitives
- **AI Engine**: Ollama with Llama 3.2:3b
- **Form Handling**: React Hook Form, Zod validation

## 🔧 Configuration

### Ollama Configuration

The AI integration can be customized in `app/api/generate-form/route.ts`:

```typescript
// Modify these settings for different behavior
{
  model: 'llama3.2:3b',        // Change model
  temperature: 0.3,            // Creativity (0-1)
  top_p: 0.8,                 // Diversity (0-1)
  max_tokens: 1500,           // Response length
}
```

### Adding New Models

To use a different Ollama model:

1. Download the model:
   ```bash
   ollama pull model-name
   ```

2. Update the model name in the API route:
   ```typescript
   model: 'model-name'
   ```

## 🐛 Troubleshooting

### Ollama Issues

**"Ollama API error"**: 
```bash
# Check if Ollama is running
ollama list

# Restart Ollama service
brew services restart ollama
```

**"No response from Ollama"**:
```bash
# Test Ollama directly
ollama run llama3.2:3b "Hello"
```

### API Route Issues

**"Internal server error"**:
- Ensure Ollama is running on port 11434
- Check the server logs for detailed errors
- Verify the model is downloaded: `ollama list`

### Development Server

**Port conflicts**:
- The app runs on port 3000 by default
- Ollama uses port 11434
- Make sure both ports are available

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Ollama](https://ollama.com/) for providing local AI capabilities
- [Llama](https://llama.meta.com/) for the language model
- [Radix UI](https://www.radix-ui.com/) for accessible UI components
- [Tailwind CSS](https://tailwindcss.com/) for styling

---

**Ready to build better forms with AI?** 🚀

Visit `http://localhost:3000` and start creating! 