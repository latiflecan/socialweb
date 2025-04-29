'use client';

import { useEffect } from 'react';
import { auth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-toastify';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        toast.error('Veuillez vous connecter');
        router.push('/login');
      } else {
        toast.success(`Bienvenue ${user.email} 👋`);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    toast.info('Déconnexion réussie 👋');
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Bienvenue sur votre espace personnel 🎉</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
      >
        Se déconnecter
      </button>
    </div>
  );
}
