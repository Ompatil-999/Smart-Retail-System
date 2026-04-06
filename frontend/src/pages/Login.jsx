import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { BuildingStorefrontIcon } from '@heroicons/react/24/outline';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            toast.success('Welcome back!');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 p-4">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-400/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center mb-4">
                            <BuildingStorefrontIcon className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
                        <p className="text-gray-500 mt-1">Sign in to your store dashboard</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="label-text">Email</label>
                            <input type="email" className="input-field" placeholder="owner@example.com"
                                value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center text-sm">
                                <label className="label-text">Password</label>
                                <Link to="/forgot-password" title="Forgot Password?" className="font-medium text-primary-600 hover:text-primary-500 whitespace-nowrap">
                                    Forgot password?
                                </Link>
                            </div>
                            <input type="password" title="Enter Password" id="password_input" className="input-field" placeholder="••••••••"
                                value={password} onChange={e => setPassword(e.target.value)} required />
                        </div>
                        <button type="submit" disabled={loading}
                            className="btn-primary w-full justify-center text-base py-3 disabled:opacity-60">
                            {loading ? <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" /> : 'Sign In'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Don't have a store?{' '}
                        <Link to="/register" className="text-primary-600 font-semibold hover:text-primary-700">
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
