import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserBuilds, deleteBuild, Build } from '../services/buildsService';
import { ArrowLeft, Trash2, Loader2, FolderOpen, ArrowRight, Calendar, DollarSign } from 'lucide-react';

const MyBuilds = () => {
    const [builds, setBuilds] = useState<Build[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleting, setDeleting] = useState<string | null>(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBuilds = async () => {
            if (!user) return;
            try {
                const userBuilds = await getUserBuilds(user.uid);
                setBuilds(userBuilds);
            } catch (err) {
                console.error('Error fetching builds:', err);
                setError('Failed to load your saved builds');
            } finally {
                setLoading(false);
            }
        };
        fetchBuilds();
    }, [user]);

    const handleDelete = async (buildId: string) => {
        if (!user || !confirm('Are you sure you want to delete this build?')) return;

        setDeleting(buildId);
        try {
            await deleteBuild(user.uid, buildId);
            setBuilds(builds.filter(b => b.id !== buildId));
        } catch (err) {
            console.error('Error deleting build:', err);
            setError('Failed to delete build');
        } finally {
            setDeleting(null);
        }
    };

    const handleLoadBuild = (build: Build) => {
        // Navigate to home with build data in state
        navigate('/', { state: { loadBuild: build } });
    };

    const formatDate = (timestamp: any) => {
        if (!timestamp) return 'N/A';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

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

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">My Saved Builds</h1>
                        <p className="text-slate-500 mt-1">View and manage your saved PC configurations</p>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                        Create New Build
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {builds.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
                        <FolderOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">No Saved Builds</h3>
                        <p className="text-slate-500 mb-6">You haven't saved any PC configurations yet.</p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                            Start Building
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {builds.map((build) => (
                            <div
                                key={build.id}
                                className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
                            >
                                <div className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-bold text-slate-900">{build.name}</h3>
                                                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                                                    {build.tierName}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={14} />
                                                    {formatDate(build.createdAt)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <DollarSign size={14} />
                                                    ₹{build.pricing?.total?.toLocaleString() || 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleDelete(build.id!)}
                                                disabled={deleting === build.id}
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                            >
                                                {deleting === build.id ? (
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Components preview */}
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {build.components.slice(0, 4).map((comp, idx) => (
                                            <span
                                                key={idx}
                                                className="px-3 py-1 bg-slate-50 text-slate-600 rounded text-xs"
                                            >
                                                {comp.type}: {comp.name.split(' ').slice(0, 3).join(' ')}
                                            </span>
                                        ))}
                                        {build.components.length > 4 && (
                                            <span className="px-3 py-1 bg-slate-50 text-slate-400 rounded text-xs">
                                                +{build.components.length - 4} more
                                            </span>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => handleLoadBuild(build)}
                                        className="mt-4 w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-lg font-medium transition-colors"
                                    >
                                        Load & Configure <ArrowRight size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBuilds;
