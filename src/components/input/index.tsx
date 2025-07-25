import type { InputProps } from './input.types';

export function Input({ 
  label, 
  hideLabel = false, 
  className = '', 
  id,
  ...props 
}: InputProps) {
  const baseClasses = 'w-full px-4 py-3 border border-border rounded-sm focus:outline-none focus:ring-2 focus:ring-focus focus:border-transparent placeholder-text-secondary';
  const classes = `${baseClasses} ${className}`.trim();

  return (
    <div>
      {label && (
        <label htmlFor={id} className={hideLabel ? 'sr-only' : 'block text-sm font-medium text-text-primary mb-2'}>
          {label}
        </label>
      )}
      <input
        id={id}
        className={classes}
        {...props}
      />
    </div>
  );
}