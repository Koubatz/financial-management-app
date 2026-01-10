import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, Check } from 'lucide-react';

interface SelectProps {
  label?: string;
  error?: string;
  description?: string;
  disabled?: boolean;
  value?: string | number;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    { className, label, error, description, disabled, value, onChange, children, required },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [selectedLabel, setSelectedLabel] = React.useState<string>('');

    React.useEffect(() => {
      const options = React.Children.toArray(children).filter(React.isValidElement);
      const selected = options.find(
        (opt) => (opt as React.ReactElement<{ value?: string | number }>).props.value === value,
      );
      const label = (selected as React.ReactElement<{ children?: React.ReactNode }>)?.props
        .children;
      setSelectedLabel(typeof label === 'string' ? label : '');
    }, [value, children]);

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setOpen(false);
        }
      };

      if (open) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open]);

    const handleSelect = (optionValue: string) => {
      const event = {
        target: { value: optionValue },
      } as React.ChangeEvent<HTMLSelectElement>;
      onChange?.(event);
      setOpen(false);
    };

    return (
      <div className="grid gap-2">
        {label && (
          <label className="text-sm font-medium text-foreground">
            {label}
            {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <div className="relative" ref={containerRef}>
          <button
            type="button"
            onClick={() => !disabled && setOpen(!open)}
            disabled={disabled}
            className={cn(
              'h-10 w-full min-w-[200px] rounded-md border border-slate-200 bg-white px-3 py-2 pr-10 text-sm text-left text-foreground outline-none transition',
              'cursor-pointer hover:border-slate-300',
              open && 'border-blue-500 ring-2 ring-blue-500/20',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-red-500',
              className,
            )}
          >
            {selectedLabel}
          </button>
          <ChevronDown
            className={cn(
              'pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition',
              disabled ? 'opacity-50' : '',
              open && 'rotate-180',
            )}
          />

          {open && (
            <div className="absolute top-full z-50 mt-1 w-full rounded-md border border-slate-200 bg-white shadow-lg">
              <div className="max-h-60 overflow-y-auto py-1">
                {React.Children.toArray(children)
                  .filter(React.isValidElement)
                  .map((child) => {
                    const optionElement = child as React.ReactElement<{
                      value?: string | number;
                      children?: React.ReactNode;
                    }>;
                    const optionValue = String(optionElement.props.value ?? '');
                    const optionLabel = optionElement.props.children;
                    const isSelected = optionValue === String(value ?? '');

                    return (
                      <button
                        key={optionValue}
                        type="button"
                        onClick={() => handleSelect(optionValue)}
                        className={cn(
                          'flex w-full items-center gap-2 px-3 py-2 text-sm text-left transition',
                          isSelected
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'text-foreground hover:bg-slate-50',
                        )}
                      >
                        {isSelected && <Check className="h-4 w-4" />}
                        <span className={isSelected ? 'ml-0' : 'ml-6'}>{optionLabel}</span>
                      </button>
                    );
                  })}
              </div>
            </div>
          )}
        </div>

        {/* Hidden select for form submission */}
        <select ref={ref} value={value} onChange={onChange} className="hidden" required={required}>
          {children}
        </select>

        {description && <p className="text-xs text-muted-foreground">{description}</p>}
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  },
);

Select.displayName = 'Select';

export { Select };
export type { SelectProps };
