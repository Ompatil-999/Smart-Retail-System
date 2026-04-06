import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

export default function StoreSettings() {
    const { updateUser } = useAuth();
    const [form, setForm] = useState({ storeName: '', gstNumber: '', defaultTaxRate: '', address: '', phone: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        api.get('/store').then(r => {
            const s = r.data.data;
            setForm({ storeName: s.storeName || '', gstNumber: s.gstNumber || '', defaultTaxRate: s.defaultTaxRate || '', address: s.address || '', phone: s.phone || '' });
        }).catch(() => toast.error('Failed to load')).finally(() => setLoading(false));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.put('/store', { ...form, defaultTaxRate: parseFloat(form.defaultTaxRate) || 18 });
            updateUser({ storeName: form.storeName });
            toast.success('Store settings saved');
        } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
        finally { setSaving(false); }
    };

    if (loading) return (
        <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
            <div className="card p-6 space-y-4">
                {[...Array(5)].map((_, i) => <div key={i} className="h-10 bg-gray-200 rounded animate-pulse" />)}
            </div>
        </div>
    );

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="page-title">Store Settings</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your store profile and configuration</p>
            </div>

            <form onSubmit={handleSubmit} className="card p-6 space-y-5">
                <div><label className="label-text">Store Name</label><input className="input-field" value={form.storeName} onChange={e => setForm({ ...form, storeName: e.target.value })} required /></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><label className="label-text">GST Number</label><input className="input-field" value={form.gstNumber} onChange={e => setForm({ ...form, gstNumber: e.target.value })} /></div>
                    <div><label className="label-text">Default Tax Rate (%)</label><input type="number" step="0.01" min="0" max="100" className="input-field" value={form.defaultTaxRate} onChange={e => setForm({ ...form, defaultTaxRate: e.target.value })} /></div>
                </div>
                <div><label className="label-text">Address</label><textarea className="input-field" rows={2} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></div>
                <div><label className="label-text">Phone</label><input className="input-field" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
                <div className="pt-2">
                    <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
                        {saving ? <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" /> : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}
