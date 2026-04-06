import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { BuildingStorefrontIcon } from '@heroicons/react/24/outline';

export default function Register() {
    const [form, setForm] = useState({ ownerName: '', email: '', password: '', storeName: '', gstNumber: '' });
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await register(form);
            toast.success('Store registered successfully!');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
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

            <div className="relative w-full max-w-lg">
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center mb-4">
                            <BuildingStorefrontIcon className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Create Your Store</h1>
                        <p className="text-gray-500 mt-1">Get started with SmartRetail in seconds</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="label-text">Owner Name</label>
                                <input className="input-field" placeholder="John Doe"
                                    value={form.ownerName} onChange={e => update('ownerName', e.target.value)} required />
                            </div>
                            <div>
                                <label className="label-text">Store Name</label>
                                <input className="input-field" placeholder="My Retail Store"
                                    value={form.storeName} onChange={e => update('storeName', e.target.value)} required />
                            </div>
                        </div>
                        <div>
                            <label className="label-text">Email</label>
                            <input type="email" className="input-field" placeholder="owner@example.com"
                                value={form.email} onChange={e => update('email', e.target.value)} required />
                        </div>
                        <div>
                            <label className="label-text">Password</label>
                            <input type="password" className="input-field" placeholder="Min 6 characters"
                                value={form.password} onChange={e => update('password', e.target.value)} required minLength={6} />
                        </div>
                        <div>
                            <label className="label-text">GST Number <span className="text-gray-400">(optional)</span></label>
                            <input className="input-field" placeholder="29ABCDE1234F1Z5"
                                value={form.gstNumber} onChange={e => update('gstNumber', e.target.value)} />
                        </div>
                        <button type="submit" disabled={loading}
                            className="btn-primary w-full justify-center text-base py-3 mt-2 disabled:opacity-60">
                            {loading ? <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" /> : 'Create Store'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Already have a store?{' '}
                        <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
