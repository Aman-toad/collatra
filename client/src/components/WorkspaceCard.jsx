import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Calendar, FolderKanban } from 'lucide-react';

export default function WorkspaceCard({ workspace, index }) {
  return (
    <Link to={`/workspaces/${workspace._id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -8, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="block bg-card border-2 border-border rounded-3xl p-6 shadow-lg hover:shadow-xl hover:border-primary transition-all cursor-pointer relative overflow-hidden group"
      >
        {/* Decorative gradient */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <motion.div
              whileHover={{ rotate: 10 }}
              className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center"
            >
              <FolderKanban className="w-6 h-6 text-primary" />
            </motion.div>
          </div>

          <h2 className="text-xl font-bold text-foreground mb-2 line-clamp-1">
            {workspace.title}
          </h2>
          
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2 min-h-[40px]">
            {workspace.description || 'No description provided.'}
          </p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span>{workspace.members?.length || 0} members</span>
            </div>
            {workspace.createdAt && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{new Date(workspace.createdAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
