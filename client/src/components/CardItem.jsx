import { motion } from 'framer-motion';
import { Trash2, ArrowLeft, ArrowRight, User } from 'lucide-react';
import { useState } from 'react';

export default function CardItem({ card, onMove, onDelete, onAssign, members }) {
  const [showActions, setShowActions] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo':
        return 'border-blue-400 bg-blue-50 dark:bg-blue-950/20';
      case 'doing':
        return 'border-yellow-400 bg-yellow-50 dark:bg-yellow-950/20';
      case 'done':
        return 'border-green-400 bg-green-50 dark:bg-green-950/20';
      default:
        return 'border-border bg-card';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      whileHover={{ scale: 1.02, y: -2 }}
      onHoverStart={() => setShowActions(true)}
      onHoverEnd={() => setShowActions(false)}
      className={`rounded-2xl p-4 mb-3 shadow-md border-2 transition-all ${getStatusColor(card.status)}`}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-bold text-foreground text-base">{card.title}</h3>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onDelete(card._id)}
          className="text-red-500 hover:text-red-700 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </motion.button>
      </div>

      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{card.description}</p>

      {/* Assigned User */}
      {card.assignedTo && card.assignedTo.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 mb-3 text-xs"
        >
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            {card.assignedTo[0].name[0].toUpperCase()}
          </div>
          <span className="text-foreground font-medium">{card.assignedTo[0].name}</span>
        </motion.div>
      )}

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: showActions ? 1 : 0,
          height: showActions ? 'auto' : 0,
        }}
        className="flex items-center justify-between gap-2 overflow-hidden"
      >
        <div className="flex gap-2">
          {card.status !== 'todo' && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onMove(card._id, 'todo')}
              className="p-1.5 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              title="Move to Todo"
            >
              <ArrowLeft className="w-4 h-4" />
            </motion.button>
          )}
          {card.status !== 'done' && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onMove(card._id, card.status === 'todo' ? 'doing' : 'done')}
              className="p-1.5 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
              title={card.status === 'todo' ? 'Move to Doing' : 'Move to Done'}
            >
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          )}
        </div>

        {/* Assign Dropdown */}
        <select
          onChange={(e) => onAssign(card._id, e.target.value)}
          className="text-xs px-2 py-1 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
          defaultValue={card.assignedTo?.[0]?._id || ''}
        >
          <option value="">Assign</option>
          {members?.map((m) => (
            <option key={m._id} value={m._id}>
              {m.name}
            </option>
          ))}
        </select>
      </motion.div>
    </motion.div>
  );
}
