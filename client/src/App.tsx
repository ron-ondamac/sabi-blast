import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import Layout from './components/Layout';
import Login from './components/Login';
import ResultsDashboard from './components/ResultsDashboard';
import RoundForm from './components/RoundForm';
import { designRound, getCurrentUser, getRockTypes, login, logout } from './lib/api';
import { RockType, RoundDesignResult, RoundFormValues } from './types';

export default function App() {
  const [authState, setAuthState] = useState<'checking' | 'authenticated' | 'unauthenticated'>('checking');
  const [result, setResult] = useState<RoundDesignResult | null>(null);
  const [dims, setDims] = useState({ widthM: 4, heightOrDiameterM: 4 });

  useEffect(() => {
    getCurrentUser()
      .then(() => setAuthState('authenticated'))
      .catch(() => setAuthState('unauthenticated'));
  }, []);

  const rockTypesQuery = useQuery<RockType[]>({
    queryKey: ['rockTypes'],
    queryFn: getRockTypes,
    enabled: authState === 'authenticated'
  });

  const mutation = useMutation({
    mutationFn: (values: RoundFormValues) => designRound(values),
    onSuccess: (data: RoundDesignResult) => setResult(data)
  });

  const handleSubmit = (values: RoundFormValues) => {
    setDims({ widthM: values.widthM, heightOrDiameterM: values.heightOrDiameterM });
    mutation.mutate(values);
  };

  const handleLogin = async (email: string, password: string) => {
    await login(email, password);
    setAuthState('authenticated');
  };

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      setAuthState('unauthenticated');
      setResult(null);
    }
  };

  if (authState === 'checking') {
    return <div className="flex min-h-screen items-center justify-center bg-paper text-sm text-gray-500">Checking session...</div>;
  }

  if (authState === 'unauthenticated') {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout onLogout={handleLogout}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          {rockTypesQuery.isLoading && <p className="text-sm text-gray-400">Loading rock library...</p>}
          {rockTypesQuery.data && <RoundForm rockTypes={rockTypesQuery.data} onSubmit={handleSubmit} isLoading={mutation.isPending} />}
          {mutation.isError && <p className="text-sm text-red-500 mt-3">{(mutation.error as Error).message}</p>}
        </div>
        <div>
          {result ? (
            <ResultsDashboard result={result} widthM={dims.widthM} heightOrDiameterM={dims.heightOrDiameterM} />
          ) : (
            <div className="h-full flex items-center justify-center text-sm text-gray-400 border border-dashed border-gray-200 p-12">
              Fill in the round design inputs to see a recommendation.
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
