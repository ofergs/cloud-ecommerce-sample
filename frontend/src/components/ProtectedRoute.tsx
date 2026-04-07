import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUsername } from '../services/auth';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

  useEffect(() => {
    getCurrentUsername().then((u) =>
      setStatus(u ? 'authenticated' : 'unauthenticated')
    );
  }, []);

  if (status === 'loading') {
    return <div className="text-center py-16 text-gray-400">Loading…</div>;
  }
  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
