'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db, storage } from '@/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';

interface UserData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  photoURL?: string;
}

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [uid, setUid] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        router.push('/login');
        return;
      }

      setUid(currentUser.uid);
      const docRef = doc(db, 'users', currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as UserData;
        setUserData(data);
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setPhone(data.phone);
        setPhotoPreview(data.photoURL || null);
      } else {
        toast.error('Données utilisateur non trouvées');
      }
    };

    fetchData();
  }, [router]);

  const handleUpdate = async () => {
    if (!uid) return;

    try {
      let newPhotoURL: string | null = userData?.photoURL || null;

      if (file) {
        const storageRef = ref(storage, `avatars/${uid}`);
        await uploadBytes(storageRef, file);
        newPhotoURL = await getDownloadURL(storageRef);
      }

      await updateDoc(doc(db, 'users', uid), {
        firstName,
        lastName,
        phone,
        photoURL: newPhotoURL,
      });

      toast.success('Profil mis à jour avec succès');
      setEditMode(false);
      setUserData({
        ...userData!,
        firstName,
        lastName,
        phone,
        photoURL: newPhotoURL || undefined,
      });
      setPhotoPreview(newPhotoURL);
    } catch (err: any) {
      toast.error('Erreur : ' + err.message);
    }
  };

  if (!userData || !uid) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center px-4">
      <div className="card max-w-xl w-full">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">👤 Mon Profil</h2>

        <div className="flex justify-center mb-6">
          <img
            src={photoPreview || '/default-avatar.png'}
            alt="Photo de profil"
            className="w-32 h-32 rounded-full border-4 border-blue-500 object-cover"
          />
        </div>

        {!editMode ? (
          <>
            <div className="text-left space-y-4 mb-6">
              <p><span className="font-semibold text-blue-600">Prénom :</span> {userData.firstName}</p>
              <p><span className="font-semibold text-blue-600">Nom :</span> {userData.lastName}</p>
              <p><span className="font-semibold text-blue-600">Téléphone :</span> {userData.phone}</p>
              <p><span className="font-semibold text-blue-600">Courriel :</span> {userData.email}</p>
            </div>
            <button onClick={() => setEditMode(true)} className="btn-primary w-full">
              ✏️ Modifier mes informations
            </button>
          </>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Prénom</label>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Nom</label>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Téléphone</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Changer la photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setFile(e.target.files[0]);
                    setPhotoPreview(URL.createObjectURL(e.target.files[0]));
                  }
                }}
                className="w-full"
              />
            </div>
            <div className="flex justify-between mt-6">
              <button type="submit" className="btn-primary">✅ Enregistrer</button>
              <button type="button" onClick={() => setEditMode(false)} className="btn-neutral">❌ Annuler</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
