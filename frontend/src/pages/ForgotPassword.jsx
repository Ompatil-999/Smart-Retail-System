import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import { KeyIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            setSubmitted(true);
            toast.success('Reset link sent if account exists');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Something went wrong');
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
                            <KeyIcon className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Forgot Password?</h1>
                        <p className="text-gray-500 mt-1 text-center">No worries, we'll send you reset instructions.</p>
                    </div>

                    {!submitted ? (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="label-text">Email</label>
                                <input type="email" id="forgot_email_input" className="input-field" placeholder="owner@example.com"
                                    value={email} onChange={e => setEmail(e.target.value)} required />
                            </div>
                            <button type="submit" disabled={loading}
                                className="btn-primary w-full justify-center text-base py-3 disabled:opacity-60">
                                {loading ? <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" /> : 'Reset Password'}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center space-y-4">
                            <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm leading-relaxed">
                                if an account exists for <span className="font-semibold">{email}</span>, you will receive a password reset link shortly.
                            </div>
                            <p className="text-sm text-gray-500">
                                Didn't receive the email? Check your spam folder or try again.
                            </p>
                        </div>
                    )}

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
