export const Input = ({ label, className, ...props }) => {
  
  // Define the base styles as a constant string
  const baseStyles = 'w-full px-4 py-3 rounded-full bg-input border-2 border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:scale-[1.01] transition-all';
  const finalClassNames = `${baseStyles} ${className || ''}`;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-2 text-foreground">
          {label}
        </label>
      )}
      <input
        className={finalClassNames}
        {...props}
      />
    </div>
  );
};