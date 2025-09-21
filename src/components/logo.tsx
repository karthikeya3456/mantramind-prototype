import { BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <BrainCircuit className="h-8 w-8 text-primary" />
      <h1 className="text-2xl font-bold font-headline text-foreground">
        MantraMind
      </h1>
    </div>
  );
};

export default Logo;
