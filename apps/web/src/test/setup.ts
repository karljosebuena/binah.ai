import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import { ToastProvider } from '../components/ui/toaster';

// Setup virtual DOM for tests
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost',
});
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;

// Mock toaster since it uses document in a way jsdom doesn't support
vi.mock('../components/ui/toaster', () => ({
  ToastProvider: ({ children }: { children: React.ReactNode }) => children,
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

expect.extend(matchers);

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  document.body.innerHTML = '';
});
