import { motion } from 'framer-motion';

export const Textarea = ({ label, className, ...props }) => {

  // Define the base styles as a constant string, similar to Input.jsx
  // Note: Using rounded-lg instead of rounded-full for better multiline appearance.
  // Also using a default row count (rows) for initial size.
  const baseStyles = 'w-full px-4 py-3 rounded-lg bg-input border-2 border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-y';

  // 💡 Manually combine classes using a template literal
  const finalClassNames = `${baseStyles} ${className || ''}`;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-2 text-foreground">
          {label}
        </label>
      )}
      <motion.textarea
        // Using framer-motion for subtle effects like in Button.jsx
        whileFocus={{ scale: 1.01 }}
        // We'll use the default rows attribute if not provided, for a minimum height
        rows={props.rows || 4}
        className={finalClassNames}
        {...props}
      />
    </div>
  );
};