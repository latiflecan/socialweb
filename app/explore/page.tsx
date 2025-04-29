'use client';

import { useRouter } from 'next/navigation';
import { auth } from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

export default function ExplorePage() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        toast.error('Vous devez être connecté pour accéder à cette page');
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-center px-4">
      <div>
        <h1 className="text-4xl font-bold text-blue-600 mb-4">🌐 Explorer le réseau</h1>
        <p className="text-gray-700 text-lg mb-6">
          Découvrez les fonctionnalités sociales, les profils et interagissez avec d'autres utilisateurs.
        </p>
        <button
          onClick={() => router.push('/home')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow"
        >
          Revenir à l'accueil
        </button>
      </div>
    </div>
  );
}
