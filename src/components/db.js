// db.js
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, query, where, doc, updateDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAIbo27_jN2neDKPbjWZcO_gyCcNenJfGI",
  authDomain: "get-pass2.firebaseapp.com",
  projectId: "get-pass2",
  storageBucket: "get-pass2.appspot.com",
  messagingSenderId: "1021534589021",
  appId: "1:1021534589021:web:480779238b0ab02c8dfdb4"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

const apartmentsCollection = collection(db, 'apartments');

export const getApartments = async () => {
  const apartmentsSnapshot = await getDocs(apartmentsCollection);
  return apartmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addApartment = async (apartment) => {
  await addDoc(apartmentsCollection, apartment);
};

export const getApartmentByMobile = async (mobileNumber) => {
  const q = query(apartmentsCollection, where('mobileNumber', '==', mobileNumber));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))[0];
};

export const updateApartment = async (id, updatedData) => {
  const apartmentDoc = doc(db, 'apartments', id);
  await updateDoc(apartmentDoc, updatedData);
};
