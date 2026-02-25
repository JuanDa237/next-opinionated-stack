import { cn } from '@/lib/utils';
import './gradient.css';

export function GradientBackground({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('hero-bg', className)}>
      <div className="gradient-layer pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
