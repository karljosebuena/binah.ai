import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from '../../components/ui/toaster';
import UploadPage from '../UploadPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

// Mock Clerk's useUser hook
vi.mock('@clerk/clerk-react', () => ({
  useUser: () => ({
    user: {
      id: 'test-user-id',
    },
  }),
}));

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <BrowserRouter>{component}</BrowserRouter>
      </ToastProvider>
    </QueryClientProvider>
  );
};

describe('UploadPage', () => {
  it('renders upload form', () => {
    renderWithProviders(<UploadPage />);
    expect(screen.getByText('Upload FCV Sample')).toBeInTheDocument();
    expect(screen.getByText('Select Test Types')).toBeInTheDocument();
  });

  it('validates file type', () => {
    renderWithProviders(<UploadPage />);
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByLabelText(/Upload a file/i);
    
    fireEvent.change(input, { target: { files: [file] } });
    
    expect(screen.getByText('Please upload an audio file (WAV or MP3)')).toBeInTheDocument();
  });

  it('validates file size', () => {
    renderWithProviders(<UploadPage />);
    const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.wav', { type: 'audio/wav' });
    const input = screen.getByLabelText(/Upload a file/i);
    
    fireEvent.change(input, { target: { files: [largeFile] } });
    
    expect(screen.getByText('File size must be less than 10MB')).toBeInTheDocument();
  });
});
