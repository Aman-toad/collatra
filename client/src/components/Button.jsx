import { motion } from 'framer-motion';
export const Button = ({
  children,
  className,
  variant = 'primary',
  size = 'md', 
  ...props
}) => {
  const baseClasses = 'relative inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 overflow-hidden group';

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const primaryClasses = 'bg-primary text-primary-foreground shadow-lg hover:shadow-primary/50';
  const outlineClasses = 'bg-transparent text-primary border border-primary/50 hover:border-primary';
  const disabledClasses = 'opacity-50 cursor-not-allowed';

  // Define the main content based on variant
  const Content = (
    <div className={`relative z-10 flex items-center justify-center ${variant === 'primary' ? 'p-0' : 'p-0'}`}>
      {children}
    </div>
  );

  // Primary Button with Inner Glow and Scale Effect
  if (variant === 'primary') {
    return (
      <motion.button
        className={`${baseClasses} ${primaryClasses} ${sizeClasses[size]} ${className}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        {...props}
      >
        {/* Glowing Background Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />
        {Content}
      </motion.button>
    );
  }

  // Outline Button with Border Shine Effect
  if (variant === 'outline') {
    return (
      <motion.button
        className={`${baseClasses} ${outlineClasses} ${sizeClasses[size]} ${className}`}
        whileHover={{ borderColor: 'var(--primary)', boxShadow: '0 0 10px rgba(var(--primary-rgb), 0.5)' }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        {...props}
      >
        {/* Subtle Shine Overlay */}
        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {Content}
      </motion.button>
    );
  }

  // Fallback (simple primary style)
  return (
    <motion.button
      className={`${baseClasses} ${primaryClasses} ${sizeClasses[size]} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};
