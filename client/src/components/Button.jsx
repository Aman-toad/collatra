import { motion } from 'framer-motion';

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className,
  ...props 
}) => {
  const baseStyles = 'font-semibold rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-secondary text-secondary-foreground hover:opacity-90',
    secondary: 'bg-primary text-primary-foreground hover:bg-primary-dark',
    outline: 'border-2 border-foreground text-foreground hover:bg-foreground hover:text-background',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  // 💡 Manually combine classes using a template literal
  const finalClassNames = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className || ''}`;

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={finalClassNames}
      {...props}
    >
      {children}
    </motion.button>
  );
};