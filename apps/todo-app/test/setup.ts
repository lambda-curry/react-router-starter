import { afterEach, beforeEach, jest, mock } from 'bun:test';
import '@testing-library/jest-dom';
import { within } from '@testing-library/dom';
import { cleanup, configure, screen } from '@testing-library/react';
import { JSDOM } from 'jsdom';

if (typeof globalThis.window === 'undefined' || typeof globalThis.document === 'undefined') {
  const dom = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'http://localhost'
  });

  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    writable: true,
    value: dom.window
  });

  Object.defineProperty(globalThis, 'document', {
    configurable: true,
    writable: true,
    value: dom.window.document
  });

  Object.defineProperty(globalThis, 'navigator', {
    configurable: true,
    writable: true,
    value: dom.window.navigator
  });

  Object.defineProperty(globalThis, 'HTMLElement', {
    configurable: true,
    writable: true,
    value: dom.window.HTMLElement
  });

  Object.defineProperty(globalThis, 'Node', {
    configurable: true,
    writable: true,
    value: dom.window.Node
  });

  Object.defineProperty(globalThis, 'Element', {
    configurable: true,
    writable: true,
    value: dom.window.Element
  });

  Object.defineProperty(globalThis, 'MutationObserver', {
    configurable: true,
    writable: true,
    value: dom.window.MutationObserver
  });

  Object.defineProperty(globalThis, 'CustomEvent', {
    configurable: true,
    writable: true,
    value: dom.window.CustomEvent
  });

  Object.defineProperty(globalThis, 'Event', {
    configurable: true,
    writable: true,
    value: dom.window.Event
  });

  Object.defineProperty(globalThis, 'KeyboardEvent', {
    configurable: true,
    writable: true,
    value: dom.window.KeyboardEvent
  });

  Object.defineProperty(globalThis, 'MouseEvent', {
    configurable: true,
    writable: true,
    value: dom.window.MouseEvent
  });

  Object.defineProperty(globalThis, 'HTMLInputElement', {
    configurable: true,
    writable: true,
    value: dom.window.HTMLInputElement
  });

  Object.defineProperty(globalThis, 'HTMLFormElement', {
    configurable: true,
    writable: true,
    value: dom.window.HTMLFormElement
  });

  Object.defineProperty(globalThis, 'HTMLButtonElement', {
    configurable: true,
    writable: true,
    value: dom.window.HTMLButtonElement
  });

  Object.defineProperty(globalThis, 'HTMLTextAreaElement', {
    configurable: true,
    writable: true,
    value: dom.window.HTMLTextAreaElement
  });

  Object.defineProperty(globalThis, 'DocumentFragment', {
    configurable: true,
    writable: true,
    value: dom.window.DocumentFragment
  });

  Object.defineProperty(globalThis, 'getComputedStyle', {
    configurable: true,
    writable: true,
    value: dom.window.getComputedStyle.bind(dom.window)
  });
}

if (typeof window !== 'undefined') {
  const htmlElementProto = window.HTMLElement.prototype as HTMLElement & {
    attachEvent?: (event: string, handler: (...args: unknown[]) => void) => void;
    detachEvent?: (event: string, handler: (...args: unknown[]) => void) => void;
  };

  if (typeof htmlElementProto.attachEvent !== 'function') {
    htmlElementProto.attachEvent = () => {};
  }

  if (typeof htmlElementProto.detachEvent !== 'function') {
    htmlElementProto.detachEvent = () => {};
  }

  if (typeof window.matchMedia !== 'function') {
    window.matchMedia = (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false
    });
  }

  if (typeof window.requestAnimationFrame !== 'function') {
    window.requestAnimationFrame = (callback: FrameRequestCallback) =>
      setTimeout(() => callback(Date.now()), 16) as unknown as number;
  }

  if (typeof window.cancelAnimationFrame !== 'function') {
    window.cancelAnimationFrame = (id: number) => clearTimeout(id);
  }

  if (typeof globalThis.requestAnimationFrame !== 'function') {
    globalThis.requestAnimationFrame = window.requestAnimationFrame.bind(window);
  }

  if (typeof globalThis.cancelAnimationFrame !== 'function') {
    globalThis.cancelAnimationFrame = window.cancelAnimationFrame.bind(window);
  }

  if (!window.HTMLElement.prototype.scrollTo) {
    window.HTMLElement.prototype.scrollTo = function (options?: ScrollToOptions | number, y?: number) {
      if (typeof options === 'object' && options !== null) {
        this.scrollTop = options.top || 0;
        this.scrollLeft = options.left || 0;
      } else if (typeof options === 'number') {
        this.scrollLeft = options;
        this.scrollTop = y || 0;
      }
    };
  }
}

if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as typeof ResizeObserver;
}

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
configure({ asyncUtilTimeout: 1000 });

// React Router's useRemixForm calls useHref; wrap renders in a Router for components that need it.
// For tests that require Router context, prefer rendering the component within a MemoryRouter in the test itself.

beforeEach(() => {
  if (!globalThis.document.body) {
    globalThis.document.body = globalThis.document.createElement('body');
  }

  Object.assign(screen, within(globalThis.document.body));

  const originalConsoleError = console.error;
  jest.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
    const message = typeof args[0] === 'string' ? args[0] : '';
    if (message.includes('Cannot update a component') && message.includes('while rendering a different component')) {
      return;
    }
    originalConsoleError(...args);
  });
});

afterEach(() => {
  cleanup();
  jest.restoreAllMocks();
  mock.restore();
});
