import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    getAllOrders,
    updateOrderStatus,
    Order,
    OrderStatus,
    ORDER_STATUS_LABELS
} from '../../services/ordersService';
import {
    ArrowLeft,
    Loader2,
    Package,
    Clock,
    CheckCircle2,
    Truck,
    Box,
    ShieldCheck,
    RefreshCw,
    ChevronDown,
    BarChart3,
    Users,
    DollarSign,
    TrendingUp
} from 'lucide-react';

const AdminDashboard = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
    const [updating, setUpdating] = useState<string | null>(null);
    const { userData } = useAuth();
    const navigate = useNavigate();

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const filter = statusFilter === 'all' ? undefined : statusFilter;
            const allOrders = await getAllOrders(filter);
            setOrders(allOrders);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [statusFilter]);

    const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
        setUpdating(orderId);
        try {
            await updateOrderStatus(orderId, newStatus);
            await fetchOrders();
        } catch (err) {
            console.error('Error updating status:', err);
            setError('Failed to update order status');
        } finally {
            setUpdating(null);
        }
    };

    const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
        const statusFlow: OrderStatus[] = ['pending', 'confirmed', 'assembly', 'qa', 'shipped', 'delivered'];
        const currentIdx = statusFlow.indexOf(currentStatus);
        if (currentIdx < statusFlow.length - 1) {
            return statusFlow[currentIdx + 1];
        }
        return null;
    };

    const getStatusIcon = (status: OrderStatus) => {
        switch (status) {
            case 'pending': return <Clock className="w-4 h-4" />;
            case 'confirmed': return <CheckCircle2 className="w-4 h-4" />;
            case 'assembly': return <Box className="w-4 h-4" />;
            case 'qa': return <ShieldCheck className="w-4 h-4" />;
            case 'shipped': return <Truck className="w-4 h-4" />;
            case 'delivered': return <Package className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'confirmed': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'assembly': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'qa': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
            case 'shipped': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

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

    // Analytics
    const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        inProgress: orders.filter(o => ['confirmed', 'assembly', 'qa'].includes(o.status)).length,
        shipped: orders.filter(o => o.status === 'shipped').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        revenue: orders.reduce((sum, o) => sum + (o.pricing?.total || 0), 0)
    };

    if (loading && orders.length === 0) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100">
            {/* Header */}
            <div className="bg-slate-900 text-white">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <button
                                onClick={() => navigate('/')}
                                className="flex items-center text-slate-400 hover:text-white mb-2 text-sm transition-colors"
                            >
                                <ArrowLeft size={16} className="mr-1" /> Back to Store
                            </button>
                            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                            <p className="text-slate-400 text-sm">Welcome, {userData?.name}</p>
                        </div>
                        <button
                            onClick={fetchOrders}
                            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition-colors"
                        >
                            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                            Refresh
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Package className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Total Orders</p>
                                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <Clock className="w-5 h-5 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Pending</p>
                                <p className="text-2xl font-bold text-slate-900">{stats.pending}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">In Progress</p>
                                <p className="text-2xl font-bold text-slate-900">{stats.inProgress}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <DollarSign className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Total Revenue</p>
                                <p className="text-2xl font-bold text-slate-900">₹{stats.revenue.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6 overflow-hidden">
                    <div className="flex overflow-x-auto">
                        {(['all', 'pending', 'confirmed', 'assembly', 'qa', 'shipped', 'delivered'] as const).map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${statusFilter === status
                                        ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600'
                                        : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                {status === 'all' ? 'All Orders' : ORDER_STATUS_LABELS[status as OrderStatus]}
                            </button>
                        ))}
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {/* Orders List */}
                {orders.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
                        <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">No Orders Found</h3>
                        <p className="text-slate-500">
                            {statusFilter === 'all'
                                ? 'No orders have been placed yet.'
                                : `No orders with status "${ORDER_STATUS_LABELS[statusFilter as OrderStatus]}".`}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => {
                            const nextStatus = getNextStatus(order.status);

                            return (
                                <div
                                    key={order.id}
                                    className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
                                >
                                    <div
                                        className="p-6 cursor-pointer hover:bg-slate-50 transition-colors"
                                        onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id!)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div>
                                                    <div className="flex items-center gap-3">
                                                        <h3 className="font-bold text-slate-900">{order.orderRef}</h3>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 border ${getStatusColor(order.status)}`}>
                                                            {getStatusIcon(order.status)}
                                                            {ORDER_STATUS_LABELS[order.status]}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-slate-500 mt-1">
                                                        {order.userName} • {order.userEmail}
                                                    </p>
                                                    <p className="text-xs text-slate-400 mt-1">
                                                        {formatDate(order.createdAt)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className="text-lg font-bold text-slate-900">₹{order.pricing.total.toLocaleString()}</p>
                                                    <p className="text-xs text-slate-400">{order.tierName}</p>
                                                </div>
                                                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Content */}
                                    {expandedOrder === order.id && (
                                        <div className="border-t border-slate-100 p-6 bg-slate-50">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Components */}
                                                <div>
                                                    <h4 className="font-semibold text-slate-900 mb-3">Components</h4>
                                                    <div className="space-y-2">
                                                        {order.components.map((comp, idx) => (
                                                            <div key={idx} className="flex justify-between text-sm bg-white p-2 rounded border border-slate-200">
                                                                <span className="text-slate-600">{comp.type}</span>
                                                                <span className="text-slate-900 font-medium">{comp.name}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Shipping & Actions */}
                                                <div>
                                                    <h4 className="font-semibold text-slate-900 mb-3">Shipping Address</h4>
                                                    <div className="bg-white p-4 rounded border border-slate-200 mb-4">
                                                        <p className="text-sm text-slate-600">
                                                            {order.shippingAddress.street}<br />
                                                            {order.shippingAddress.city}, {order.shippingAddress.state}<br />
                                                            {order.shippingAddress.pincode}
                                                        </p>
                                                        {order.phone && (
                                                            <p className="text-sm text-slate-500 mt-2">📞 {order.phone}</p>
                                                        )}
                                                    </div>

                                                    {/* Status Update */}
                                                    {nextStatus && (
                                                        <div>
                                                            <h4 className="font-semibold text-slate-900 mb-3">Update Status</h4>
                                                            <button
                                                                onClick={() => handleStatusUpdate(order.id!, nextStatus)}
                                                                disabled={updating === order.id}
                                                                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                                                            >
                                                                {updating === order.id ? (
                                                                    <Loader2 className="animate-spin" size={18} />
                                                                ) : (
                                                                    getStatusIcon(nextStatus)
                                                                )}
                                                                Mark as {ORDER_STATUS_LABELS[nextStatus]}
                                                            </button>
                                                        </div>
                                                    )}

                                                    {order.status === 'delivered' && (
                                                        <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
                                                            <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                                                            <p className="text-green-700 font-medium">Order Completed</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
