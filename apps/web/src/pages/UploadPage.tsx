import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../lib/api-client';
import { toast } from '../components/ui/toaster';

import { TestType } from '../lib/types';

const TEST_TYPES: Array<{ id: TestType; label: string }> = [
  { id: 'TB', label: 'Tuberculosis' },
  { id: 'COVID19', label: 'COVID-19' },
  { id: 'SMOKING', label: 'Smoking' },
];

export default function UploadPage() {
  const { user } = useUser();
  const [file, setFile] = useState<File | null>(null);
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const uploadMutation = useMutation({
    mutationFn: apiClient.uploadSample,
    onSuccess: () => {
      toast.success('Sample uploaded successfully');
      queryClient.invalidateQueries({ queryKey: ['test-results'] });
      navigate('/results');
    },
    onError: (error: Error) => {
      setUploadError(error.message);
      toast.error('Failed to upload sample');
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    
    if (!selectedFile.type.startsWith('audio/')) {
      setUploadError('Please upload an audio file (WAV or MP3)');
      return;
    }
    
    if (selectedFile.size > 10 * 1024 * 1024) { // 10MB
      setUploadError('File size must be less than 10MB');
      return;
    }
    
    setFile(selectedFile);
    setUploadError(null);
  };

  const handleTestTypeChange = (testType: string) => {
    setSelectedTests((prev) =>
      prev.includes(testType)
        ? prev.filter((t) => t !== testType)
        : [...prev, testType]
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file || selectedTests.length === 0 || !user) {
      setUploadError('Please select a file and at least one test type');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('userId', user.id);
      formData.append('testTypes', JSON.stringify(selectedTests));
      formData.append('file', file);

      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded * 100) / event.total);
          setUploadProgress(progress);
        }
      });

      await uploadMutation.mutateAsync({
        userId: user.id,
        testTypes: selectedTests,
        file,
      });
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Upload FCV Sample
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Test Types
          </label>
          <div className="space-y-2">
            {TEST_TYPES.map((test) => (
              <label key={test.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedTests.includes(test.id)}
                  onChange={() => handleTestTypeChange(test.id)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-gray-900">{test.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Cough Sample
          </label>
          <div 
            className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const droppedFile = e.dataTransfer.files[0];
              if (!droppedFile.type.startsWith('audio/')) {
                setUploadError('Please upload an audio file (WAV or MP3)');
                return;
              }
              if (droppedFile.size > 10 * 1024 * 1024) { // 10MB
                setUploadError('File size must be less than 10MB');
                return;
              }
              setFile(droppedFile);
              setUploadError(null);
            }}
          >
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    accept="audio/*"
                    className="sr-only"
                    onChange={handleFileChange}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">WAV or MP3 up to 10MB</p>
            </div>
          </div>
          {file && (
            <p className="mt-2 text-sm text-gray-500">
              Selected file: {file.name}
            </p>
          )}
        </div>

        {uploadError && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Upload failed
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{uploadError}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {uploadMutation.isPending && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-indigo-600 h-2.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
          <button
            type="submit"
            disabled={!file || selectedTests.length === 0 || uploadMutation.isPending}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {uploadMutation.isPending ? `Uploading... ${uploadProgress}%` : 'Upload Sample'}
          </button>
        </div>
      </form>
    </div>
  );
}
