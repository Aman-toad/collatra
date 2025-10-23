"use client"

import { useState, useEffect } from "react"
import { Send, Sparkles } from "lucide-react"
import api from "../utils/api"
import { motion } from "framer-motion"
import { toast } from "react-toastify"

export default function CardComments({ cardId }) {
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState("")

  const currentUser = JSON.parse(localStorage.getItem("user"))

  useEffect(() => {
    fetchComments()
  }, [cardId])

  const fetchComments = async () => {
    try {
      const { data } = await api.get(`/cards/${cardId}/comments`)
      setComments(data)
    } catch (err) {
      console.error("Failed to fetch comments:", err)
      toast.error("Failed to load comments.")
    }
  }

  const postComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    try {
      const { data } = await api.post(`/cards/${cardId}/comments`, { content: newComment })

      setComments((prev) => [...prev, data])
      setNewComment("")
      toast.success("Comment posted!")
    } catch (err) {
      console.error("Failed to post comment:", err)
      toast.error(err.response?.data?.message || "Failed to post comment.")
    }
  }

  const getInitials = (name) =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "U"

  return (
    <div className="mt-6 border-t border-border/50 pt-4">
      <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" />
        Comments ({comments.length})
      </h3>

      <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
        {comments.length === 0 ? (
          <p className="text-muted-foreground text-sm italic">No comments yet. Be the first to share!</p>
        ) : (
          comments.map((comment, index) => (
            <motion.div
              key={comment._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex gap-3"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                  comment.user._id === currentUser._id
                    ? "bg-gradient-to-br from-primary to-secondary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {getInitials(comment.user.name)}
              </div>
              <div className="flex-1 bg-muted/50 p-3 rounded-xl">
                <p className="font-semibold text-sm text-foreground">
                  {comment.user.name}
                  <span className="text-xs font-normal text-muted-foreground ml-2">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </p>
                <p className="text-sm mt-1 whitespace-pre-wrap text-foreground">{comment.content}</p>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <form onSubmit={postComment} className="mt-6 flex gap-2">
        <input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="flex-grow px-4 py-2 rounded-xl border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-all"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={!newComment.trim()}
          className="p-2 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-xl disabled:opacity-50 transition-all shadow-md hover:shadow-lg"
        >
          <Send className="w-4 h-4" />
        </motion.button>
      </form>
    </div>
  )
}
