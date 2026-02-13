import 'bun:test';

declare module 'bun:test' {
  interface Matchers<T = unknown> {
    toBeDisabled(): T;
    toBeInTheDocument(): T;
    toHaveAttribute(name: string, value?: string): T;
    toHaveClass(...classNames: string[]): T;
    toHaveTextContent(text: string | RegExp): T;
  }
}
