import { Button } from '@/components/ui/button';
import { LucideProps } from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';
import { Link } from 'react-router-dom';

export interface SidebarItemProps {
  icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
  label: string;
  href?: string;
  isActive?: boolean;
  onClick?: () => void;
}

export function SidebarItem({ icon: Icon, label, href, isActive, onClick }: SidebarItemProps) {
  const className = `w-full justify-start gap-2 ${
    isActive ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
  }`;

  if (href) {
    return (
      <li>
        <Link to={href} className="block">
          <Button className={className} size="lg" onClick={onClick}>
            <Icon size={20} />
            {label}
          </Button>
        </Link>
      </li>
    );
  }

  return (
    <li>
      <Button className={className} size="lg" onClick={onClick}>
        <Icon size={20} />
        {label}
      </Button>
    </li>
  );
}
