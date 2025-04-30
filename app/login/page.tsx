'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-toastify';

export default function HomePage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        toast.error('Veuillez vous connecter');
        router.push('/login');
      } else {
        setUserEmail(user.email);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    toast.info('Déconnexion réussie 👋');
    router.push('/login');
  };

  if (!userEmail) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Bienvenue {userEmail} 🎉
      </h1>
      <button
        onClick={handleLogout}
        className="btn-danger"
      >
        Se déconnecter
      </button>
    </div>
  );
}
