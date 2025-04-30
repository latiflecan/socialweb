'use client';

import { useState } from 'react';
import { auth, db } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      await addDoc(collection(db, 'users'), {
        uid,
        firstName,
        lastName,
        phone,
        email,
      });

      toast.success('Inscription réussie 🎉');
      router.push('/login');
    } catch (error) {
      if (error instanceof Error) {
        toast.error('Erreur : ' + error.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <div className="card w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Créer un compte</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Prénom"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          <input
            type="text"
            placeholder="Nom"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          <input
            type="text"
            placeholder="Téléphone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          <input
            type="email"
            placeholder="Adresse e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          <button type="submit" className="btn-primary w-full">Créer un compte</button>
        </form>
      </div>
    </div>
  );
}
