import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const Loader = ({ 
  size = 'default', 
  fullscreen = false,
  text,
  className,
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const loader = (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {loader}
      </div>
    );
  }

  return loader;
};

export const InlineLoader = ({ className }) => (
  <Loader2 className={cn('h-4 w-4 animate-spin', className)} />
);

export const PageLoader = ({ text = 'Memuat...' }) => (
  <div className="flex h-[50vh] items-center justify-center">
    <Loader size="lg" text={text} />
  </div>
);

export default Loader;
