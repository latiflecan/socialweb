'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/firebase';
import { useRouter } from 'next/navigation';
import { collection, getDocs } from 'firebase/firestore';
import { toast } from 'react-toastify';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
}

export default function ExplorePage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        toast.error('Veuillez vous connecter');
        router.push('/login');
        return;
      }
    };

    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const usersList: UserData[] = [];
        querySnapshot.forEach((doc) => {
          usersList.push(doc.data() as UserData);
        });
        setUsers(usersList);
      } catch (err: any) {
        toast.error('Erreur lors du chargement : ' + err.message);
      }
    };

    checkAuth();
    fetchUsers();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">🔍 Explorer les utilisateurs</h1>
      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {users.map((user, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg p-4">
            <p className="font-semibold text-gray-800">{user.firstName} {user.lastName}</p>
            <p className="text-gray-600 text-sm">{user.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
