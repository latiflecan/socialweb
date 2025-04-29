'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/firebase';
import { useRouter } from 'next/navigation';
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { toast } from 'react-toastify';

interface Request {
  id: string;
  fromUid: string;
  fromName: string;
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const router = useRouter();
  const currentUid = auth.currentUser?.uid;

  useEffect(() => {
    if (!currentUid) {
      toast.error("Vous devez être connecté");
      router.push('/login');
      return;
    }

    const fetchRequests = async () => {
      try {
        const q = query(
          collection(db, 'friendRequests'),
          where('toUid', '==', currentUid),
          where('status', '==', 'pending')
        );
        const snapshot = await getDocs(q);

        const result: Request[] = [];

        for (const docSnap of snapshot.docs) {
          const data = docSnap.data();
          const fromUid = data.fromUid;

          // Aller chercher le nom dans users
          const userSnap = await getDocs(
            query(collection(db, 'users'), where('uid', '==', fromUid))
          );
          const fromUser = userSnap.docs[0]?.data();

          result.push({
            id: docSnap.id,
            fromUid,
            fromName: fromUser
              ? `${fromUser.firstName} ${fromUser.lastName}`
              : fromUid,
          });
        }

        setRequests(result);
      } catch (err: any) {
        toast.error('Erreur récupération demandes : ' + err.message);
      }
    };

    fetchRequests();
  }, [currentUid, router]);

  const handleAccept = async (req: Request) => {
    try {
      // Ajouter dans la collection friends pour les 2
      await addDoc(collection(db, 'friends'), {
        userUid: currentUid,
        friendUid: req.fromUid,
        createdAt: serverTimestamp(),
      });
      await addDoc(collection(db, 'friends'), {
        userUid: req.fromUid,
        friendUid: currentUid,
        createdAt: serverTimestamp(),
      });

      // Supprimer la demande
      await deleteDoc(doc(db, 'friendRequests', req.id));

      toast.success(`Vous êtes maintenant ami avec ${req.fromName}`);
      setRequests((prev) => prev.filter((r) => r.id !== req.id));
    } catch (err: any) {
      toast.error('Erreur acceptation : ' + err.message);
    }
  };

  const handleRefuse = async (req: Request) => {
    try {
      await deleteDoc(doc(db, 'friendRequests', req.id));
      toast.info(`Demande refusée`);
      setRequests((prev) => prev.filter((r) => r.id !== req.id));
    } catch (err: any) {
      toast.error('Erreur suppression : ' + err.message);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Demandes reçues</h1>

      <div className="w-full max-w-xl space-y-4">
        {requests.length === 0 ? (
          <p className="text-center text-gray-600">Aucune demande en attente.</p>
        ) : (
          requests.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-lg shadow p-4 flex justify-between items-center"
            >
              <div>
                <p className="text-gray-800 font-medium">{req.fromName}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleAccept(req)}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md"
                >
                  Accepter
                </button>
                <button
                  onClick={() => handleRefuse(req)}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded-md"
                >
                  Refuser
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
