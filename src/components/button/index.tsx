import type { ButtonProps } from './button.types';

export function Button({
  variant = 'primary',
  fullWidth = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseClasses =
    'py-3 px-4 border border-transparent rounded-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'text-white bg-primary hover:bg-primary-hover focus:ring-primary',
    secondary:
      'text-text-primary bg-white border-border hover:bg-gray-50 focus:ring-focus',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  const classes =
    `${baseClasses} ${variantClasses[variant]} ${widthClass} ${className}`.trim();

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
