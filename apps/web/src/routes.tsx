import { Routes, Route, Navigate } from 'react-router-dom';
import { SignIn, SignUp, useAuth } from '@clerk/clerk-react';
import Layout from './components/Layout';
import UploadPage from './pages/UploadPage';
import ResultsPage from './pages/ResultsPage';
import TestResultsPage from './pages/TestResultsPage';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, isLoaded } = useAuth();
  
  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  
  if (!isSignedIn) {
    return <Navigate to="/sign-in" />;
  }
  
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<UploadPage />} />
        <Route path="results" element={<ResultsPage />} />
        <Route path="results/:testType" element={<TestResultsPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
