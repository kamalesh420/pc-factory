import { PCComponent } from '../types';
import {
    createDocument,
    getDocument,
    getDocuments,
    updateDocument
} from './firestoreService';
import { serverTimestamp } from 'firebase/firestore';

// Order status type
export type OrderStatus = 'pending' | 'confirmed' | 'assembly' | 'qa' | 'shipped' | 'delivered';

// Order status labels for display
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
    pending: 'Order Placed',
    confirmed: 'Confirmed',
    assembly: 'In Assembly',
    qa: 'Quality Testing',
    shipped: 'Shipped',
    delivered: 'Delivered'
};

// Status history entry
interface StatusHistoryEntry {
    status: OrderStatus;
    timestamp: any;
    note?: string;
}

// Address interface
export interface Address {
    street: string;
    city: string;
    state: string;
    pincode: string;
}

// Order interface
export interface Order {
    id?: string;
    userId: string;
    userEmail: string;
    userName: string;
    buildId?: string;
    tierId: string;
    tierName: string;
    components: PCComponent[];
    pricing: {
        partsTotal: number;
        assemblyFee: number;
        gst: number;
        total: number;
    };
    shippingAddress: Address;
    phone: string;
    status: OrderStatus;
    orderRef: string;
    statusHistory: StatusHistoryEntry[];
    createdAt?: any;
    updatedAt?: any;
}

// Generate order reference number
const generateOrderRef = (): string => {
    const year = new Date().getFullYear();
    const random = Math.floor(100000 + Math.random() * 900000);
    return `ORD-${year}-${random}`;
};

// Create a new order
export const createOrder = async (
    orderData: Omit<Order, 'id' | 'orderRef' | 'status' | 'statusHistory' | 'createdAt' | 'updatedAt'>
): Promise<Order> => {
    try {
        const orderRef = generateOrderRef();
        const order = await createDocument<Omit<Order, 'id'>>('orders', {
            ...orderData,
            orderRef,
            status: 'pending',
            statusHistory: [{
                status: 'pending',
                timestamp: serverTimestamp(),
                note: 'Order placed successfully'
            }]
        });
        return order as Order;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};

// Get all orders for a user
export const getUserOrders = async (userId: string): Promise<Order[]> => {
    try {
        return await getDocuments<Order>('orders', [
            { field: 'userId', operator: '==', value: userId }
        ], { field: 'createdAt', direction: 'desc' });
    } catch (error) {
        console.error('Error getting user orders:', error);
        throw error;
    }
};

// Get a single order by ID
export const getOrder = async (orderId: string): Promise<Order | null> => {
    try {
        return await getDocument<Order>('orders', orderId);
    } catch (error) {
        console.error('Error getting order:', error);
        throw error;
    }
};

// Get all orders (admin only)
export const getAllOrders = async (statusFilter?: OrderStatus): Promise<Order[]> => {
    try {
        const conditions = statusFilter
            ? [{ field: 'status', operator: '==' as const, value: statusFilter }]
            : [];
        return await getDocuments<Order>('orders', conditions, { field: 'createdAt', direction: 'desc' });
    } catch (error) {
        console.error('Error getting all orders:', error);
        throw error;
    }
};

// Update order status (admin only)
export const updateOrderStatus = async (
    orderId: string,
    newStatus: OrderStatus,
    note?: string
): Promise<Order | null> => {
    try {
        const order = await getOrder(orderId);
        if (!order) {
            throw new Error('Order not found');
        }

        const newHistoryEntry: StatusHistoryEntry = {
            status: newStatus,
            timestamp: serverTimestamp(),
            note: note || `Status updated to ${ORDER_STATUS_LABELS[newStatus]}`
        };

        await updateDocument('orders', orderId, {
            status: newStatus,
            statusHistory: [...order.statusHistory, newHistoryEntry]
        });

        return { ...order, status: newStatus };
    } catch (error) {
        console.error('Error updating order status:', error);
        throw error;
    }
};
