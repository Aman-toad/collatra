import { useState, useEffect } from 'react';
import api from '../utils/api.js';
import { useNavigate } from 'react-router-dom';
import DocCard from '../components/DocCard';
import { Sidebar } from '../components/Sidebar'; // 🟢 Import Sidebar

export default function Docs() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchDocs = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get('/docs');
      setDocs(response.data);
    } catch (err) {
      console.error('Error fetching docs:', err);
      setError('Failed to load documents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleCreateNewDoc = async () => {
    try {
      const response = await api.post('/docs');
      const newDoc = response.data;

      navigate(`/docs/${newDoc._id}`);
      setDocs([newDoc, ...docs]);
    } catch (err) {
      console.error('Error creating doc:', err);
      setError('Failed to create a new document.');
    }
  };

  const handleDeleteDoc = async (docId, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }

    try {
      await api.delete(`/docs/${docId}`);
      setDocs((prevDocs) => prevDocs.filter((doc) => doc._id !== docId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete document. Check console for details.');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen text-lg">Loading documents...</div>;
  if (error) return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main
        className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-[280px]' : 'ml-[80px]'
          } p-6`}
      >
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-foreground">My Documents</h1>
          <button
            onClick={handleCreateNewDoc}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            + New Doc
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {docs.length > 0 ? (
            docs.map((doc) => (
              <DocCard
                key={doc._id}
                doc={doc}
                onClick={() => navigate(`/docs/${doc._id}`)}
                onDelete={handleDeleteDoc}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-muted-foreground">
              You haven't created or been added to any documents yet.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
