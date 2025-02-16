import { useState, useMemo } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { useTestResults } from '../hooks/use-test-results';
import { Spinner } from '../components/ui/spinner';
import { TestResult } from '../lib/api-client';

export default function ResultsPage() {
  const { user } = useUser();
  const [sortConfig, setSortConfig] = useState<{
    key: keyof TestResult;
    direction: 'asc' | 'desc';
  }>({ key: 'createdAt', direction: 'desc' });
  
  const [filters, setFilters] = useState({
    testType: '',
    status: '',
    riskLevel: '',
  });
  
  const { data: results, isLoading, error } = useTestResults();
  
  const filteredResults = useMemo(() => {
    if (!results) return [];
    
    return [...results].filter(result => {
      if (filters.testType && result.testType !== filters.testType) return false;
      if (filters.status && result.processingStatus !== filters.status) return false;
      if (filters.riskLevel) {
        const score = result.confidenceScore;
        if (filters.riskLevel === 'high' && score <= 0.5) return false;
        if (filters.riskLevel === 'low' && score >= 0.5) return false;
        if (filters.riskLevel === 'inconclusive' && score !== 0.5) return false;
      }
      return true;
    });
  }, [results, filters]);

  const filteredAndSortedResults = useMemo(() => {
    return [...filteredResults].sort((a, b) => {
      if (sortConfig.key === 'createdAt') {
        return sortConfig.direction === 'asc' 
          ? new Date(a[sortConfig.key]).getTime() - new Date(b[sortConfig.key]).getTime()
          : new Date(b[sortConfig.key]).getTime() - new Date(a[sortConfig.key]).getTime();
      }
      return sortConfig.direction === 'asc'
        ? a[sortConfig.key] > b[sortConfig.key] ? 1 : -1
        : b[sortConfig.key] > a[sortConfig.key] ? 1 : -1;
    });
  }, [filteredResults, sortConfig]);

  const requestSort = (key: keyof TestResult) => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner className="w-8 h-8 text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return <div>Error loading results</div>;
  }

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Your Test Results
        </h1>
        <div className="mt-4 sm:mt-0 flex space-x-4">
          <select
            value={filters.testType}
            onChange={(e) => setFilters(prev => ({ ...prev, testType: e.target.value }))}
            className="block w-40 rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">All Test Types</option>
            <option value="TB">Tuberculosis (TB)</option>
            <option value="COVID19">COVID-19</option>
            <option value="SMOKING">Smoking</option>
          </select>
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="block w-48 rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">All Statuses</option>
            <option value="COMPLETE_SUCCESS">Complete - Success</option>
            <option value="COMPLETE_ERROR">Complete - Error</option>
            <option value="COMPLETE_FAILURE">Complete - Failure</option>
            <option value="INCOMPLETE">Incomplete</option>
          </select>
          <select
            value={filters.riskLevel}
            onChange={(e) => setFilters(prev => ({ ...prev, riskLevel: e.target.value }))}
            className="block w-40 rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">All Risk Levels</option>
            <option value="high">High Risk (&gt;0.5)</option>
            <option value="low">Low Risk (&lt;0.5)</option>
            <option value="inconclusive">Inconclusive (0.5)</option>
          </select>
        </div>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 cursor-pointer"
                      onClick={() => requestSort('testType')}
                    >
                      Test Type
                      {sortConfig.key === 'testType' && (
                        <span className="ml-2">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                      onClick={() => requestSort('confidenceScore')}
                    >
                      Confidence Score
                      {sortConfig.key === 'confidenceScore' && (
                        <span className="ml-2">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                      onClick={() => requestSort('processingStatus')}
                    >
                      Status
                      {sortConfig.key === 'processingStatus' && (
                        <span className="ml-2">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                      onClick={() => requestSort('createdAt')}
                    >
                      Date
                      {sortConfig.key === 'createdAt' && (
                        <span className="ml-2">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredAndSortedResults.map((result) => (
                    <tr key={result.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        <Link
                          to={`/results/${result.testType}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          {result.testType}
                        </Link>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {result.confidenceScore.toFixed(2)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            result.processingStatus === 'COMPLETE_SUCCESS'
                              ? 'bg-green-100 text-green-800'
                              : result.processingStatus === 'COMPLETE_ERROR' ||
                                result.processingStatus === 'COMPLETE_FAILURE'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {result.processingStatus}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(result.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
