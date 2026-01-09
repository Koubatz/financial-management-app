import * as React from 'react';

export interface OptionProps extends React.OptionHTMLAttributes<HTMLOptionElement> {
  children: React.ReactNode;
}

const Option = React.forwardRef<HTMLOptionElement, OptionProps>(({ children, ...props }, ref) => {
  return (
    <option ref={ref} {...props}>
      {children}
    </option>
  );
});

Option.displayName = 'Option';

export { Option };
