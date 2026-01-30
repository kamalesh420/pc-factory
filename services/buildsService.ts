import { PCComponent } from '../types';
import {
    createDocument,
    getDocument,
    getDocuments,
    updateDocument,
    deleteDocument
} from './firestoreService';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../config/firebase';

// Build interface
export interface Build {
    id?: string;
    userId: string;
    name: string;
    tierId: string;
    tierName: string;
    components: PCComponent[];
    pricing: {
        partsTotal: number;
        assemblyFee: number;
        gst: number;
        total: number;
    };
    createdAt?: any;
    updatedAt?: any;
}

// Save a new build
export const saveBuild = async (
    userId: string,
    buildData: Omit<Build, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<Build> => {
    try {
        const build = await createDocument<Omit<Build, 'id'>>('builds', {
            userId,
            ...buildData
        });

        // Also add build ID to user's savedBuilds array
        await updateDoc(doc(db, 'users', userId), {
            savedBuilds: arrayUnion(build.id)
        });

        return build as Build;
    } catch (error) {
        console.error('Error saving build:', error);
        throw error;
    }
};

// Get all builds for a user
export const getUserBuilds = async (userId: string): Promise<Build[]> => {
    try {
        return await getDocuments<Build>('builds', [
            { field: 'userId', operator: '==', value: userId }
        ], { field: 'createdAt', direction: 'desc' });
    } catch (error) {
        console.error('Error getting user builds:', error);
        throw error;
    }
};

// Get a single build by ID
export const getBuild = async (buildId: string): Promise<Build | null> => {
    try {
        return await getDocument<Build>('builds', buildId);
    } catch (error) {
        console.error('Error getting build:', error);
        throw error;
    }
};

// Update a build
export const updateBuild = async (
    buildId: string,
    data: Partial<Build>
): Promise<{ id: string } & Partial<Build>> => {
    try {
        return await updateDocument('builds', buildId, data);
    } catch (error) {
        console.error('Error updating build:', error);
        throw error;
    }
};

// Delete a build
export const deleteBuild = async (userId: string, buildId: string): Promise<boolean> => {
    try {
        await deleteDocument('builds', buildId);

        // Remove from user's savedBuilds array
        await updateDoc(doc(db, 'users', userId), {
            savedBuilds: arrayRemove(buildId)
        });

        return true;
    } catch (error) {
        console.error('Error deleting build:', error);
        throw error;
    }
};
