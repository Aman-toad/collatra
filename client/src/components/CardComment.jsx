import { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import api from '../utils/api';
import { Button } from './Button'; 
import { Input } from './Input';
import { toast } from 'react-toastify';

export default function CardComments({ cardId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  
  const currentUser = JSON.parse(localStorage.getItem('user')); 

  useEffect(() => {
    fetchComments();
  }, [cardId]);

  const fetchComments = async () => {
    try {
      const { data } = await api.get(`/cards/${cardId}/comments`);
      setComments(data);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
      toast.error("Failed to load comments.");
    }
  };

  const postComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const { data } = await api.post(`/cards/${cardId}/comments`, { content: newComment });
      
      // Add the new comment to the state immediately
      setComments(prev => [...prev, data]);
      setNewComment('');
      toast.success("Comment posted!");
    } catch (err) {
      console.error("Failed to post comment:", err);
      toast.error(err.response?.data?.message || "Failed to post comment.");
    }
  };

  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';

  return (
    <div className="mt-6 border-t pt-4">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Comments ({comments.length})</h3>

      {/* Comment List */}
      <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
        {comments.length === 0 ? (
          <p className="text-muted-foreground text-sm">No comments yet. Be the first!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="flex gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm 
                  ${comment.user._id === currentUser._id ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
                {getInitials(comment.user.name)}
              </div>
              <div className="flex-1 bg-muted/50 p-3 rounded-xl">
                <p className="font-semibold text-sm text-foreground">{comment.user.name} 
                    <span className='text-xs font-normal text-muted-foreground ml-2'>
                        {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                </p>
                <p className="text-sm mt-1 whitespace-pre-wrap">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Comment Form */}
      <form onSubmit={postComment} className="mt-6 flex gap-2">
        <Input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="flex-grow"
        />
        <Button type="submit" size="icon" disabled={!newComment.trim()}>
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}