import { doc, getDoc, collection, getDocs, setDoc, query, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError } from '../lib/firebase';

// Site Config Services
export const getSiteConfig = async () => {
  try {
    const docRef = doc(db, 'config', 'site');
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.warn("Unable to fetch site config from Firestore:", error);
    return null;
  }
};

export const updateSiteConfig = async (data: any) => {
  try {
    const docRef = doc(db, 'config', 'site');
    await setDoc(docRef, data, { merge: true });
  } catch (error) {
    handleFirestoreError(error, 'update', 'config/site');
  }
};

// Team Services
export const getTeam = async () => {
  try {
    const q = query(collection(db, 'team'), orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.warn("Unable to fetch team from Firestore:", error);
    return [];
  }
};

// Progress Services
export const getMilestones = async () => {
  try {
    const q = query(collection(db, 'milestones'), orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.warn("Unable to fetch milestones from Firestore:", error);
    return [];
  }
};

export const getGrowthData = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'growth'));
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return data;
  } catch (error) {
    console.warn("Unable to fetch growth data from Firestore:", error);
    return [];
  }
};

// Brand Services
export const getBrands = async () => {
  try {
    const q = query(collection(db, 'brands'), orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.warn("Unable to fetch brands from Firestore:", error);
    return [];
  }
};

export const updateBrand = async (brandId: string, data: any) => {
  try {
    const docRef = doc(db, 'brands', brandId);
    await setDoc(docRef, data, { merge: true });
  } catch (error) {
    handleFirestoreError(error, 'update', 'brands/' + brandId);
  }
};

// Gallery Services
export const getGallery = async () => {
  try {
    const q = query(collection(db, 'gallery'), orderBy('uploadedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.warn("Unable to fetch gallery from Firestore:", error);
    return [];
  }
};

// Timeline Services
export const getTimeline = async () => {
  try {
    const q = query(collection(db, 'timeline'), orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.warn("Unable to fetch timeline from Firestore:", error);
    return [];
  }
};

export const updateTimelineEvent = async (eventId: string, data: any) => {
  try {
    const docRef = doc(db, 'timeline', eventId);
    await setDoc(docRef, data, { merge: true });
  } catch (error) {
    handleFirestoreError(error, 'update', 'timeline/' + eventId);
  }
};
