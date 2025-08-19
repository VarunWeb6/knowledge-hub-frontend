'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import apiClient from '@/lib/api';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const endpoint = isLogin ? '/auth/login' : '/auth/signup';
    const body = isLogin ? { email, password } : { email, password, name, role: 'Employee' };

    try {
      const response = await apiClient.post(endpoint, body);
      const { token } = response.data;
      
      // Save the token to local storage for future requests
      localStorage.setItem('token', token);
      
      // Redirect to the main dashboard page
      router.push('/dashboard');
      
    } catch (err: any) {
      const message = err.response?.data?.error || "An unexpected error occurred.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>{isLogin ? 'Login' : 'Sign Up'} to Knowledge Hub</CardTitle>
          <CardDescription>
            {isLogin ? 
              "Enter your credentials to access your account." : 
              "Join the team! Create your account."
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              {!isLogin && (
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
              )}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>
            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
            <div className="flex mt-6 gap-2">
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (isLogin ? 'Logging In...' : 'Signing Up...') : (isLogin ? 'Login' : 'Sign Up')}
              </Button>
            </div>
            <p className="text-sm text-center text-gray-500 mt-4">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button 
                type="button" 
                onClick={() => setIsLogin(!isLogin)} 
                className="text-blue-600 hover:underline"
              >
                {isLogin ? "Sign Up" : "Login"}
              </button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}