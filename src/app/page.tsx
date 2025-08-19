'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Check for a token in local storage
    const token = localStorage.getItem('token');

    if (token) {
      // If a token exists, the user is authenticated, redirect to the dashboard
      router.push('/dashboard');
    } else {
      // If no token exists, redirect to the authentication page
      router.push('/auth');
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <Card className="w-[300px] p-6 text-center">
        <CardContent>
          <p>Loading...</p>
          <p className="mt-2 text-sm text-gray-500">Checking your authentication status.</p>
        </CardContent>
      </Card>
    </div>
  );
}