import { cn } from '@/lib/utils';

const badgeVariants = {
  default: 'bg-primary/10 text-primary border-primary/20',
  secondary: 'bg-secondary text-secondary-foreground border-secondary',
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  destructive: 'bg-destructive/10 text-destructive border-destructive/20',
  info: 'bg-info/10 text-info border-info/20',
  outline: 'bg-transparent border-border text-foreground',
};

const sizeVariants = {
  sm: 'text-xs px-2 py-0.5',
  default: 'text-xs px-2.5 py-0.5',
  lg: 'text-sm px-3 py-1',
};

const Badge = ({ 
  className, 
  variant = 'default', 
  size = 'default',
  dot = false,
  children,
  ...props 
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium transition-colors',
        badgeVariants[variant],
        sizeVariants[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span 
          className={cn(
            'h-1.5 w-1.5 rounded-full',
            variant === 'success' && 'bg-success',
            variant === 'warning' && 'bg-warning',
            variant === 'destructive' && 'bg-destructive',
            variant === 'info' && 'bg-info',
            variant === 'default' && 'bg-primary',
            variant === 'secondary' && 'bg-muted-foreground',
          )}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;
