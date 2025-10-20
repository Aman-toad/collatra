import { useState } from 'react';
import api from '../utils/api.js';

const ShareModal = ({ docId, isOpen, onClose, onMemberAdded }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsError(false);

    try {
      const response = await api.put(`/docs/${docId}/share`, { email });

      setMessage(response.data.message);
      onMemberAdded(response.data.members); 
      setEmail('');

      // Auto-close after success
      setTimeout(onClose, 1500);

    } catch (err) {
      console.error('Share failed:', err);
      const errMsg = err.response?.data?.message || 'An unknown error occurred.';
      setMessage(errMsg);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-slate-800 p-6 rounded-lg shadow-2xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-xl font-bold">Share Document</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
        </div>

        <p className="mb-4 text-sm text-gray-300">
          Enter the email address of the user you wish to share with.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            className="w-full p-2 border border-gray-300 rounded-lg mb-4 focus:ring-purple-500 focus:border-purple-500"
            required
            disabled={loading}
          />

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Adding User...' : 'Share'}
          </button>
        </form>

        {message && (
          <p className={`mt-3 p-2 rounded text-sm ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ShareModal;