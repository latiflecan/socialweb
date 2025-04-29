'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/firebase';
import { collection, getDocs, query, where, setDoc, doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

interface UserData {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
}

export default function ExplorePage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const currentUser = auth.currentUser;
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
      return;
    }

    const fetchUsers = async () => {
      const q = query(collection(db, 'users'), where('uid', '!=', currentUser.uid));
      const snapshot = await getDocs(q);
      const result: UserData[] = [];
      snapshot.forEach((doc) => {
        result.push(doc.data() as UserData);
      });
      setUsers(result);
    };

    fetchUsers();
  }, [currentUser, router]);

  const sendRequest = async (toUser: UserData) => {
    if (!currentUser) return;

    const requestRef = doc(db, 'friendRequests', `${currentUser.uid}_${toUser.uid}`);
    const alreadySent = await getDoc(requestRef);

    if (alreadySent.exists()) {
      toast.info('Demande déjà envoyée.');
      return;
    }

    await setDoc(requestRef, {
      from: currentUser.uid,
      to: toUser.uid,
      timestamp: new Date()
    });

    toast.success(`Demande envoyée à ${toUser.firstName} ${toUser.lastName}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold text-center mb-6">Explorer les utilisateurs</h1>
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 space-y-4">
        {users.map((user) => (
          <div
            key={user.uid}
            className="flex justify-between items-center border-b pb-2"
          >
            <div>
              <p className="font-medium text-gray-800">{user.firstName} {user.lastName}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <button
              onClick={() => sendRequest(user)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-md"
            >
              Ajouter
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
