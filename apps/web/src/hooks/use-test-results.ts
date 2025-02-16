import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
import { useUser } from '@clerk/clerk-react';

export function useTestResults() {
  const { user } = useUser();

  return useQuery({
    queryKey: ['test-results', user?.id],
    queryFn: () => apiClient.getResults(user?.id || ''),
    enabled: !!user?.id,
  });
}

export function useTestResultsByType(testType: string) {
  const { user } = useUser();

  return useQuery({
    queryKey: ['test-results', user?.id, testType],
    queryFn: () => apiClient.getResultsByType(user?.id || '', testType),
    enabled: !!user?.id && !!testType,
  });
}
