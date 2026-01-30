import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserOrders, Order, ORDER_STATUS_LABELS, OrderStatus } from '../services/ordersService';
import { ArrowLeft, Loader2, Package, Clock, CheckCircle2, Truck, Box, ShieldCheck } from 'lucide-react';

const MyOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) return;
            try {
                const userOrders = await getUserOrders(user.uid);
                setOrders(userOrders);
            } catch (err) {
                console.error('Error fetching orders:', err);
                setError('Failed to load your orders');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [user]);

    const formatDate = (timestamp: any) => {
        if (!timestamp) return 'N/A';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusIcon = (status: OrderStatus) => {
        switch (status) {
            case 'pending': return <Clock className="w-5 h-5" />;
            case 'confirmed': return <CheckCircle2 className="w-5 h-5" />;
            case 'assembly': return <Box className="w-5 h-5" />;
            case 'qa': return <ShieldCheck className="w-5 h-5" />;
            case 'shipped': return <Truck className="w-5 h-5" />;
            case 'delivered': return <Package className="w-5 h-5" />;
            default: return <Clock className="w-5 h-5" />;
        }
    };

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'confirmed': return 'bg-blue-100 text-blue-700';
            case 'assembly': return 'bg-purple-100 text-purple-700';
            case 'qa': return 'bg-indigo-100 text-indigo-700';
            case 'shipped': return 'bg-orange-100 text-orange-700';
            case 'delivered': return 'bg-green-100 text-green-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const STATUS_ORDER: OrderStatus[] = ['pending', 'confirmed', 'assembly', 'qa', 'shipped', 'delivered'];

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center text-slate-500 hover:text-blue-600 mb-6 transition-colors"
                >
                    <ArrowLeft size={18} className="mr-1" /> Back to Home
                </button>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">My Orders</h1>
                    <p className="text-slate-500 mt-1">Track your PC orders and delivery status</p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {orders.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
                        <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">No Orders Yet</h3>
                        <p className="text-slate-500 mb-6">You haven't placed any orders yet.</p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                            Build Your PC
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
                            >
                                <div
                                    className="p-6 cursor-pointer"
                                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id!)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-bold text-slate-900">{order.orderRef}</h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(order.status)}`}>
                                                    {getStatusIcon(order.status)}
                                                    {ORDER_STATUS_LABELS[order.status]}
                                                </span>
                                            </div>
                                            <p className="text-slate-500 text-sm">{order.tierName}</p>
                                            <p className="text-slate-400 text-xs mt-1">{formatDate(order.createdAt)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-blue-600">₹{order.pricing.total.toLocaleString()}</p>
                                            <p className="text-xs text-slate-400 mt-1">Click to {expandedOrder === order.id ? 'collapse' : 'expand'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Content */}
                                {expandedOrder === order.id && (
                                    <div className="border-t border-slate-100 p-6 bg-slate-50">
                                        {/* Status Timeline */}
                                        <div className="mb-6">
                                            <h4 className="font-semibold text-slate-900 mb-4">Order Progress</h4>
                                            <div className="flex items-center justify-between">
                                                {STATUS_ORDER.map((status, idx) => {
                                                    const currentIdx = STATUS_ORDER.indexOf(order.status);
                                                    const isComplete = idx <= currentIdx;
                                                    const isCurrent = idx === currentIdx;

                                                    return (
                                                        <div key={status} className="flex-1 flex items-center">
                                                            <div className={`flex flex-col items-center ${isCurrent ? 'scale-110' : ''}`}>
                                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isComplete ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-400'
                                                                    }`}>
                                                                    {getStatusIcon(status)}
                                                                </div>
                                                                <span className={`text-xs mt-1 ${isComplete ? 'text-green-600 font-medium' : 'text-slate-400'}`}>
                                                                    {ORDER_STATUS_LABELS[status]}
                                                                </span>
                                                            </div>
                                                            {idx < STATUS_ORDER.length - 1 && (
                                                                <div className={`flex-1 h-1 mx-2 ${idx < currentIdx ? 'bg-green-500' : 'bg-slate-200'}`} />
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Components */}
                                        <div className="mb-6">
                                            <h4 className="font-semibold text-slate-900 mb-3">Components</h4>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                                {order.components.map((comp, idx) => (
                                                    <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200">
                                                        <p className="text-xs text-slate-400">{comp.type}</p>
                                                        <p className="text-sm font-medium text-slate-700 truncate">{comp.name}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Shipping Address */}
                                        <div>
                                            <h4 className="font-semibold text-slate-900 mb-2">Shipping Address</h4>
                                            <p className="text-sm text-slate-600">
                                                {order.shippingAddress.street}, {order.shippingAddress.city}<br />
                                                {order.shippingAddress.state} - {order.shippingAddress.pincode}
                                            </p>
                                            {order.phone && (
                                                <p className="text-sm text-slate-500 mt-1">Phone: {order.phone}</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
