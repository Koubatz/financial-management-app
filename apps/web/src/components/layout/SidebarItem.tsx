import { Button } from '@/components/ui/button';
import { LucideProps } from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';

export interface SidebarItemProps {
  icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
  label: string;
  href?: string;
  isActive?: boolean;
  onClick?: () => void;
}

export function SidebarItem({ icon: Icon, label, isActive, onClick }: SidebarItemProps) {
  return (
    <li>
      <Button
        className={`w-full justify-start gap-2 ${isActive ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
        size="lg"
        onClick={onClick}
      >
        <Icon size={20} />
        {label}
      </Button>
    </li>
  );
}
