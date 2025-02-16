import axios from 'axios';

import { TestType } from './types';

export interface TestResult {
  id: string;
  sampleId: string;
  userId: string;
  testType: TestType;
  confidenceScore: number;
  processingStatus: 'INCOMPLETE' | 'COMPLETE_SUCCESS' | 'COMPLETE_ERROR' | 'COMPLETE_FAILURE';
  createdAt: string;
  updatedAt: string;
}

export interface UploadSampleRequest {
  userId: string;
  testTypes: TestType[];
  file: File;
}

export interface UploadSampleResponse {
  sampleId: string;
  results: TestResult[];
}

// Create axios instance with base configuration
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  try {
    if (!window.Clerk?.session) {
      window.location.href = '/sign-in';
      return Promise.reject(new Error('No active session'));
    }

    const token = await window.Clerk.session.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  } catch (error) {
    console.error('Authentication error:', error);
    window.location.href = '/sign-in';
    return Promise.reject(error);
  }
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/sign-in';
      return Promise.reject(new Error('Authentication required'));
    }
    
    // Handle specific API errors
    const errorMessage = error.response?.data?.message || 'An error occurred';
    return Promise.reject(new Error(errorMessage));
  }
);

// API client methods
export const apiClient = {
  /**
   * Upload a new FCV sample for analysis
   * @throws {Error} If file validation fails or upload fails
   */
  uploadSample: async (data: UploadSampleRequest): Promise<UploadSampleResponse> => {
    // Validate file type
    if (!data.file.type.startsWith('audio/')) {
      throw new Error('Invalid file type. Please upload an audio file (WAV or MP3)');
    }

    // Validate file size (10MB limit)
    if (data.file.size > 10 * 1024 * 1024) {
      throw new Error('File size must be less than 10MB');
    }

    const formData = new FormData();
    formData.append('userId', data.userId);
    formData.append('testTypes', JSON.stringify(data.testTypes));
    formData.append('file', data.file);

    const response = await api.post<UploadSampleResponse>('/samples/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  /**
   * Get all test results for a user
   */
  getResults: async (userId: string): Promise<TestResult[]> => {
    const response = await api.get<TestResult[]>(`/test-results?userId=${userId}`);
    return response.data;
  },

  /**
   * Get test results filtered by type for a user
   */
  getResultsByType: async (userId: string, testType: string): Promise<TestResult[]> => {
    const response = await api.get<TestResult[]>(
      `/test-results?userId=${userId}&testType=${testType}`
    );
    return response.data;
  },
};
