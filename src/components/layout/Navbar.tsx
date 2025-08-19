'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/auth');
  };

  return (
    <div className="flex justify-between items-center p-4 bg-white border-b border-gray-200 shadow-sm">
      <h1 className="text-xl font-bold">
        <Link href="/dashboard" className="text-gray-800 hover:text-gray-600">
          Knowledge Hub
        </Link>
      </h1>
      <div className="space-x-4">
        <Link href="/dashboard">
          <Button variant="ghost">Dashboard</Button>
        </Link>
        <Link href="/chat">
          <Button>Chat</Button>
        </Link>
        <Button onClick={handleLogout} variant="ghost">Logout</Button>
      </div>
    </div>
  );
}