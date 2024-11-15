// src/utils/databaseUtils.ts
import { firestore } from '../firestore/firebase';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';

export const checkEmailExists = async (email: string) => {
    const docRef = doc(collection(firestore, 'users'), email);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
};

export const checkIdExists = async (id: string) => {
    const usersRef = collection(firestore, 'users');
    const querySnapshot = await getDoc(doc(usersRef, id));
    return querySnapshot.exists();
};

export const addUserData = async (userData: any) => {
    const userRef = doc(firestore, 'users', userData.id);
    await setDoc(userRef, userData);
};
