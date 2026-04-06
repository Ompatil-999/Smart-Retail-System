import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import { ShieldCheckIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return toast.error('Passwords do not match');
        }
        if (password.length < 6) {
            return toast.error('Password must be at least 6 characters');
        }

        setLoading(true);
        try {
            await api.post('/auth/reset-password', { token, newPassword: password });
            toast.success('Password successfully reset');
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid or expired token');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Missing Token</h2>
                    <p className="text-gray-600 mt-2">A valid reset token is required to access this page.</p>
                    <Link to="/login" className="mt-4 inline-block text-primary-600 font-semibold">Back to Login</Link>
                </div>
            </div>
        );
    }

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
                            <ShieldCheckIcon className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Set New Password</h1>
                        <p className="text-gray-500 mt-1 text-center">Please enter your new strong password below.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="label-text">New Password</label>
                            <input type="password" id="new_password_input" className="input-field" placeholder="••••••••"
                                value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
                        </div>
                        <div>
                            <label className="label-text">Confirm Password</label>
                            <input type="password" id="confirm_password_input" className="input-field" placeholder="••••••••"
                                value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required minLength={6} />
                        </div>
                        <button type="submit" disabled={loading}
                            className="btn-primary w-full justify-center text-base py-3 disabled:opacity-60">
                            {loading ? <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" /> : 'Update Password'}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <Link to="/login" className="flex items-center justify-center gap-2 text-sm font-medium text-gray-500 hover:text-primary-600 transition-colors">
                            <ArrowLeftIcon className="w-4 h-4" />
                            Back to sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
