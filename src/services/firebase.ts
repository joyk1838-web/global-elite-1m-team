import { doc, getDoc, collection, getDocs, setDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
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

export const updateSiteConfig = async (data: Record<string, unknown>) => {
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
    return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.warn("Unable to fetch team from Firestore:", error);
    return [];
  }
};

export const saveTeamMember = async (memberId: string, data: Record<string, unknown>) => {
  try {
    const docRef = doc(db, 'team', memberId);
    await setDoc(docRef, data, { merge: true });
  } catch (error) {
    handleFirestoreError(error, 'write', 'team/' + memberId);
  }
};

export const deleteTeamMember = async (memberId: string) => {
  try {
    await deleteDoc(doc(db, 'team', memberId));
  } catch (error) {
    handleFirestoreError(error, 'delete', 'team/' + memberId);
  }
};

// Milestone Services
export const getMilestones = async () => {
  try {
    const q = query(collection(db, 'milestones'), orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.warn("Unable to fetch milestones from Firestore:", error);
    return [];
  }
};

export const saveMilestone = async (milestoneId: string, data: Record<string, unknown>) => {
  try {
    const docRef = doc(db, 'milestones', milestoneId);
    await setDoc(docRef, data, { merge: true });
  } catch (error) {
    handleFirestoreError(error, 'write', 'milestones/' + milestoneId);
  }
};

export const deleteMilestone = async (milestoneId: string) => {
  try {
    await deleteDoc(doc(db, 'milestones', milestoneId));
  } catch (error) {
    handleFirestoreError(error, 'delete', 'milestones/' + milestoneId);
  }
};

// Growth Services
export const getGrowthData = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'growth'));
    const items: Array<Record<string, any>> = querySnapshot.docs.map(d => ({
      id: d.id,
      ...(d.data() as Record<string, any>),
    }));
    return items.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  } catch (error) {
    console.warn("Unable to fetch growth data from Firestore:", error);
    return [];
  }
};

export const saveGrowthPoint = async (growthId: string, data: Record<string, unknown>) => {
  try {
    const docRef = doc(db, 'growth', growthId);
    await setDoc(docRef, data, { merge: true });
  } catch (error) {
    handleFirestoreError(error, 'write', 'growth/' + growthId);
  }
};

export const deleteGrowthPoint = async (growthId: string) => {
  try {
    await deleteDoc(doc(db, 'growth', growthId));
  } catch (error) {
    handleFirestoreError(error, 'delete', 'growth/' + growthId);
  }
};

// Brand Services
export const getBrands = async () => {
  try {
    const q = query(collection(db, 'brands'), orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.warn("Unable to fetch brands from Firestore:", error);
    return [];
  }
};

export const updateBrand = async (brandId: string, data: Record<string, unknown>) => {
  try {
    const docRef = doc(db, 'brands', brandId);
    await setDoc(docRef, data, { merge: true });
  } catch (error) {
    handleFirestoreError(error, 'update', 'brands/' + brandId);
  }
};

export const deleteBrand = async (brandId: string) => {
  try {
    await deleteDoc(doc(db, 'brands', brandId));
  } catch (error) {
    handleFirestoreError(error, 'delete', 'brands/' + brandId);
  }
};

// Gallery Services
export const getGallery = async () => {
  try {
    const q = query(collection(db, 'gallery'), orderBy('uploadedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.warn("Unable to fetch gallery from Firestore:", error);
    return [];
  }
};

export const saveGalleryItem = async (itemId: string, data: Record<string, unknown>) => {
  try {
    const docRef = doc(db, 'gallery', itemId);
    await setDoc(docRef, data, { merge: true });
  } catch (error) {
    handleFirestoreError(error, 'write', 'gallery/' + itemId);
  }
};

export const deleteGalleryItem = async (itemId: string) => {
  try {
    await deleteDoc(doc(db, 'gallery', itemId));
  } catch (error) {
    handleFirestoreError(error, 'delete', 'gallery/' + itemId);
  }
};

// Timeline Services
export const getTimeline = async () => {
  try {
    const q = query(collection(db, 'timeline'), orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.warn("Unable to fetch timeline from Firestore:", error);
    return [];
  }
};

export const updateTimelineEvent = async (eventId: string, data: Record<string, unknown>) => {
  try {
    const docRef = doc(db, 'timeline', eventId);
    await setDoc(docRef, data, { merge: true });
  } catch (error) {
    handleFirestoreError(error, 'update', 'timeline/' + eventId);
  }
};

export const deleteTimelineEvent = async (eventId: string) => {
  try {
    await deleteDoc(doc(db, 'timeline', eventId));
  } catch (error) {
    handleFirestoreError(error, 'delete', 'timeline/' + eventId);
  }
};
