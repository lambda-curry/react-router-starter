# UI Component Rules

## Component Structure
- Use forwardRef for components that need ref forwarding
- Implement proper TypeScript interfaces
- Use class-variance-authority for variant-based styling

## shadcn/ui Patterns
```tsx
// Component example
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@todo-starter/utils';
import { Slot } from '@radix-ui/react-slot';

const buttonVariants = cva(
  'base-classes',
  {
    variants: {
      variant: {
        default: 'default-classes',
        destructive: 'destructive-classes'
      },
      size: {
        default: 'default-size',
        sm: 'small-size'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
```

## Styling Guidelines
- Use Tailwind CSS classes for styling
- Leverage CSS variables for theming
- Use cn() utility for conditional classes
- Follow shadcn/ui color and spacing conventions

## Accessibility
- Include proper ARIA attributes
- Ensure keyboard navigation works
- Use semantic HTML elements
- Test with screen readers

## Component Organization
- Keep components in `packages/ui/src/components/ui/`
- Export all components from main index file
- Group related components together
- Use consistent naming conventions

## Best Practices
- Prefer composition over complex props
- Keep components focused and reusable
- Document component APIs with TypeScript
- Test components in isolation
