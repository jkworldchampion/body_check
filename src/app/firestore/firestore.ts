//firestore 등록
import firebase from './firebase';
import {getFirestore} from 'firebase/firestore';

const fireStore = getFirestore(firebase);
export default fireStore


//addDoc  await addDoc(collection(firestore,"users"),{
//getDoc  await getDoc(collection(firestore, "users"),{ ~정보});
