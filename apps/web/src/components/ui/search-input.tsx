import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchInputProps {
  placeholder?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function SearchInput({
  placeholder = 'Search anything',
  onChange,
  className,
}: SearchInputProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 w-full max-w-md px-4 py-2 rounded-md border border-slate-300 bg-white',
        className,
      )}
    >
      {/* Ícone de busca */}
      <Search size={18} className="text-slate-400" />

      {/* Input */}
      <input
        type="text"
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        className="flex-1 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
      />
    </div>
  );
}
