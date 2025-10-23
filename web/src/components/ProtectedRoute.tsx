'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const publicPaths = ['/auth/login', '/auth/register'];

    if (!token && !publicPaths.includes(pathname)) {
      router.replace('/auth/login');
    } else {
      setAuthorized(true);
    }
  }, [pathname, router]);

  if (!authorized)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500 dark:text-gray-400">
        Redirecting...
      </div>
    );

  return <>{children}</>;
}
