import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp,
    DocumentData,
    QueryConstraint
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Types for query conditions
interface QueryCondition {
    field: string;
    operator: '==' | '!=' | '<' | '<=' | '>' | '>=' | 'in' | 'array-contains';
    value: any;
}

interface SortOption {
    field: string;
    direction?: 'asc' | 'desc';
}

// Create a new document with auto-generated ID
export const createDocument = async <T extends DocumentData>(
    collectionName: string,
    data: T
): Promise<{ id: string } & T> => {
    try {
        const docRef = await addDoc(collection(db, collectionName), {
            ...data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        return { id: docRef.id, ...data };
    } catch (error) {
        console.error(`Error creating ${collectionName}:`, error);
        throw error;
    }
};

// Create or update a document with specific ID
export const setDocument = async <T extends DocumentData>(
    collectionName: string,
    docId: string,
    data: T,
    merge: boolean = false
): Promise<{ id: string } & T> => {
    try {
        await setDoc(doc(db, collectionName, docId), {
            ...data,
            updatedAt: serverTimestamp(),
        }, { merge });
        return { id: docId, ...data };
    } catch (error) {
        console.error(`Error setting ${collectionName}/${docId}:`, error);
        throw error;
    }
};

// Get a single document by ID
export const getDocument = async <T>(
    collectionName: string,
    docId: string
): Promise<({ id: string } & T) | null> => {
    try {
        const docSnap = await getDoc(doc(db, collectionName, docId));
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as { id: string } & T;
        }
        return null;
    } catch (error) {
        console.error(`Error getting ${collectionName}/${docId}:`, error);
        throw error;
    }
};

// Get multiple documents with optional filters
export const getDocuments = async <T>(
    collectionName: string,
    conditions: QueryCondition[] = [],
    sortBy?: SortOption,
    limitCount?: number
): Promise<({ id: string } & T)[]> => {
    try {
        const queryConstraints: QueryConstraint[] = [];

        conditions.forEach(({ field, operator, value }) => {
            queryConstraints.push(where(field, operator, value));
        });

        if (sortBy) {
            queryConstraints.push(orderBy(sortBy.field, sortBy.direction || 'asc'));
        }

        if (limitCount) {
            queryConstraints.push(limit(limitCount));
        }

        const q = query(collection(db, collectionName), ...queryConstraints);
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as { id: string } & T);
    } catch (error) {
        console.error(`Error getting ${collectionName}:`, error);
        throw error;
    }
};

// Update a document
export const updateDocument = async <T extends DocumentData>(
    collectionName: string,
    docId: string,
    data: Partial<T>
): Promise<{ id: string } & Partial<T>> => {
    try {
        await updateDoc(doc(db, collectionName, docId), {
            ...data,
            updatedAt: serverTimestamp(),
        });
        return { id: docId, ...data };
    } catch (error) {
        console.error(`Error updating ${collectionName}/${docId}:`, error);
        throw error;
    }
};

// Delete a document
export const deleteDocument = async (
    collectionName: string,
    docId: string
): Promise<boolean> => {
    try {
        await deleteDoc(doc(db, collectionName, docId));
        return true;
    } catch (error) {
        console.error(`Error deleting ${collectionName}/${docId}:`, error);
        throw error;
    }
};
