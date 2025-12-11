import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginForm from './components/auth/LoginForm';
import SignupForm from './components/auth/SignupForm';
import DashboardLayout from './components/dashboard/DashboardLayout';
import JobApplicationPage from './components/public/JobApplicationPage';

function AppContent() {
  const { user, loading } = useAuth();
  const [showSignup, setShowSignup] = useState(false);
  const [jobToken, setJobToken] = useState<string | null>(null);

  useEffect(() => {
    const path = window.location.pathname;
    const match = path.match(/^\/jobs\/([a-f0-9-]+)$/);
    if (match) {
      setJobToken(match[1]);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  if (jobToken) {
    return <JobApplicationPage token={jobToken} />;
  }

  if (!user) {
    return showSignup ? (
      <SignupForm onToggleForm={() => setShowSignup(false)} />
    ) : (
      <LoginForm onToggleForm={() => setShowSignup(true)} />
    );
  }

  return <DashboardLayout />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
