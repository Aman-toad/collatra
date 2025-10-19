import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../utils/api.js';
import { useParams } from 'react-router-dom';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

export default function DocEditor() {
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [title, setTitle] = useState('');
  const [saveStatus, setSaveStatus] = useState('Saved ✓');
  const saveTimeoutRef = useRef(null);

  // TipTap editor instance
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start typing here...',
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      const currentContent = editor.getHTML();
      handleAutoSave(title, currentContent);
    },
  });

  // Fetch document from API
  useEffect(() => {
    const fetchDoc = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/docs/${id}`);
        const fetchedDoc = response.data;
        setDoc(fetchedDoc);
        setTitle(fetchedDoc.title);
        editor?.commands.setContent(fetchedDoc.content || '');
        setSaveStatus('Saved ✓');
      } catch (err) {
        console.error('Error fetching doc details:', err);
        if (err.response?.status === 403) {
          setError('Access Denied. You are not a member of this document.');
        } else {
          setError('Failed to load document.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id && editor) fetchDoc();
  }, [id, editor]);

  // Auto-save handler
  const handleAutoSave = useCallback(
    (currentTitle, currentContent) => {
      if (loading || !doc) return;

      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      setSaveStatus('Unsaved Changes');

      saveTimeoutRef.current = setTimeout(async () => {
        try {
          setSaveStatus('Saving...');
          await api.put(`/docs/${id}`, {
            title: currentTitle,
            content: currentContent,
          });
          setSaveStatus('Saved ✓');
        } catch (err) {
          console.error('Auto-save failed:', err);
          setSaveStatus('Save Failed ❌');
          setTimeout(() => setSaveStatus('Unsaved Changes'), 3000);
        }
      }, 2000);
    },
    [id, doc, loading]
  );

  // Trigger auto-save when title changes
  useEffect(() => {
    if (!editor || loading || !doc) return;
    const currentContent = editor.getHTML();
    handleAutoSave(title, currentContent);
  }, [title]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  // Render logic
  if (loading) return <div>Loading document...</div>;
  if (error) return <div className="p-10 text-red-600 font-bold">{error}</div>;
  if (!doc) return null;

  return (
    <div className="doc-editor-page p-6 max-w-4xl mx-auto">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-4xl font-extrabold w-full mb-6 focus:outline-none border-b border-transparent focus:border-gray-200"
        placeholder="Document Title"
      />

      <div className="editor-container shadow-lg p-4 rounded-lg border border-gray-200 min-h-[400px]">
        <EditorContent editor={editor} />
      </div>

      <footer className="mt-4 flex justify-between items-center text-sm text-gray-500">
        <span
          className={`font-semibold ${saveStatus.includes('Saved') ? 'text-green-600' : 'text-yellow-600'
            }`}
        >
          Status: {saveStatus}
        </span>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
          Ask AI 🧠
        </button>
      </footer>
    </div>
  );
}
