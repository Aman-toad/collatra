import { useState } from 'react';
import api from '../utils/api.js';

const AIChatSidebar = ({ isOpen, onClose, docContent }) => {
  const [prompt, setPrompt] = useState('');
  const [suggestion, setSuggestion] = useState('Type a request below to start brainstorming!');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading || !prompt || !docContent) return;

    setLoading(true);
    setSuggestion('Thinking...');

    try {
      // Call the new backend route
      const response = await api.post('/ai/suggest', {
        text: docContent, // Send the current content of the editor
        prompt: prompt,
      });

      setSuggestion(response.data.suggestion);
    } catch (err) {
      console.error('AI Request failed:', err);
      setSuggestion('Error: Could not connect to AI service. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  const sidebarClass = isOpen
    ? "translate-x-0"
    : "translate-x-full";

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-slate-800 shadow-xl transition-transform duration-300 ${sidebarClass} z-50 p-4 flex flex-col`}
    >
      <div className="flex justify-between items-center border-b pb-3 mb-4">
        <h2 className="text-xl font-bold text-purple-700">🧠 AI Assistant</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
          &times;
        </button>
      </div>

      {/* AI Response Area */}
      <div className="flex-grow overflow-y-auto mb-4 bg-slate-900 p-3 rounded-lg text-sm whitespace-pre-wrap">
        <p className={loading ? "text-gray-300 italic" : "text-gray-300"} dangerouslySetInnerHTML={{ __html: suggestion }}>
          {/* this dangerouslySetInnerHTML to format the response */}
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="mt-auto">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="E.g., 'Suggest improvements for the intro' or 'Summarize the text'"
          rows="6"
          className="w-full p-2 border-2 rounded-lg focus:ring-purple-500 focus:border-purple-500 mb-2 resize-none"
          disabled={loading}
        />
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
          disabled={loading || !docContent}
        >
          {loading ? 'Generating...' : 'Ask AI'}
        </button>
      </form>
    </div>
  );
};

export default AIChatSidebar;