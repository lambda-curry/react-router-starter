import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'bun:test';
import { Button, buttonVariants } from './button';

describe('Button component', () => {
  it('should render with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
  });

  it('should render with custom variant', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole('button', { name: 'Delete' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-destructive');
  });

  it('should render with custom size', () => {
    render(<Button size="sm">Small button</Button>);
    const button = screen.getByRole('button', { name: 'Small button' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('h-9');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled button</Button>);
    const button = screen.getByRole('button', { name: 'Disabled button' });
    expect(button).toBeDisabled();
  });

  it('should render as child component when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/test">Link button</a>
      </Button>
    );
    const link = screen.getByRole('link', { name: 'Link button' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');
  });
});

describe('buttonVariants', () => {
  it('should generate correct classes for default variant', () => {
    const classes = buttonVariants();
    expect(classes).toContain('bg-primary');
    expect(classes).toContain('text-primary-foreground');
  });

  it('should generate correct classes for destructive variant', () => {
    const classes = buttonVariants({ variant: 'destructive' });
    expect(classes).toContain('bg-destructive');
    expect(classes).toContain('text-destructive-foreground');
  });

  it('should generate correct classes for small size', () => {
    const classes = buttonVariants({ size: 'sm' });
    expect(classes).toContain('h-9');
    expect(classes).toContain('px-3');
  });
});
