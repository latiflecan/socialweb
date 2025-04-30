'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/firebase';
import { useRouter } from 'next/navigation';
import {
  collection,
  query,
  where,
  getDocs,
  DocumentData,
} from 'firebase/firestore';
import { toast } from 'react-toastify';

interface Friend {
  uid: string;
  firstName: string;
  lastName: string;
}

interface SentRequest {
  id: string;
  toName: string;
}

export default function ExplorePage() {
  const router = useRouter();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [sentRequests, setSentRequests] = useState<SentRequest[]>([]);
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) {
      toast.error('Veuillez vous connecter');
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const uid = currentUser.uid;

        // 🔹 Liste d'amis
        const friendsRef = query(
          collection(db, 'friends'),
          where('userUid', '==', uid)
        );
        const friendsSnap = await getDocs(friendsRef);
        const friendsList: Friend[] = [];

        for (const docSnap of friendsSnap.docs) {
          const friendUid = docSnap.data().friendUid;

          const userSnap = await getDocs(
            query(collection(db, 'users'), where('uid', '==', friendUid))
          );
          const user = userSnap.docs[0]?.data() as DocumentData;

          if (user) {
            friendsList.push({
              uid: user.uid,
              firstName: user.firstName,
              lastName: user.lastName,
            });
          }
        }
        setFriends(friendsList);

        // 🔹 Demandes envoyées
        const requestsRef = query(
          collection(db, 'friendRequests'),
          where('fromUid', '==', uid)
        );
        const requestsSnap = await getDocs(requestsRef);
        const requestsList: SentRequest[] = [];

        for (const docSnap of requestsSnap.docs) {
          const toUid = docSnap.data().toUid;

          const userSnap = await getDocs(
            query(collection(db, 'users'), where('uid', '==', toUid))
          );
          const toUser = userSnap.docs[0]?.data();

          requestsList.push({
            id: docSnap.id,
            toName: toUser
              ? `${toUser.firstName} ${toUser.lastName}`
              : toUid,
          });
        }
        setSentRequests(requestsList);

      } catch (err: any) {
        toast.error('Erreur lors du chargement : ' + err.message);
      }
    };

    fetchData();
  }, [currentUser, router]);

  return (
    <div className="min-h-screen p-6 bg-gray-100 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">🌍 Explorer</h1>

      {/* Amis */}
      <div className="w-full max-w-3xl mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-blue-600">👥 Mes amis</h2>
        {friends.length === 0 ? (
          <p className="text-gray-600">Vous n’avez pas encore d’amis.</p>
        ) : (
          <ul className="space-y-3">
            {friends.map((friend) => (
              <li key={friend.uid} className="card">
                {friend.firstName} {friend.lastName}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Demandes envoyées */}
      <div className="w-full max-w-3xl">
        <h2 className="text-2xl font-semibold mb-4 text-purple-600">📤 Demandes envoyées</h2>
        {sentRequests.length === 0 ? (
          <p className="text-gray-600">Aucune demande envoyée.</p>
        ) : (
          <ul className="space-y-3">
            {sentRequests.map((req) => (
              <li key={req.id} className="card">
                {req.toName}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
