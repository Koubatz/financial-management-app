import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';
import { buttonVariants, type ButtonVariantProps } from './button-variants';
import './button.css';

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  ButtonVariantProps & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn('button-ui', buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button };
