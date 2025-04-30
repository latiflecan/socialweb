'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

export default function HomePage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        toast.error('Veuillez vous connecter');
        router.push('/login');
      } else {
        try {
          const userRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userRef);
          const data = userSnap.data();
          if (data?.firstName) {
            setFirstName(data.firstName);
          } else {
            setFirstName(user.email); // fallback si prénom non défini
          }
        } catch {
          toast.error('Erreur lors du chargement du prénom');
          setFirstName(user.email);
        }
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    toast.info('Déconnexion réussie 👋');
    router.push('/login');
  };

  if (!firstName) return null;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-100 to-purple-200 px-6">
      <div className="bg-white rounded-xl shadow-xl p-10 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Bienvenue, {firstName} 👋
        </h1>
        <p className="text-gray-600 mb-8">Choisis une action ci-dessous</p>

        <div className="space-y-4">
          <button
            onClick={() => router.push('/explore')}
            className="btn-primary w-full"
          >
            🔍 Explorer les utilisateurs
          </button>
          <button
            onClick={() => router.push('/requests')}
            className="btn-neutral w-full"
          >
            📬 Voir les demandes
          </button>
          <button
            onClick={() => router.push('/profile')}
            className="btn-primary w-full"
          >
            👤 Mon profil
          </button>
          <button
            onClick={handleLogout}
            className="btn-danger w-full"
          >
            🚪 Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}
