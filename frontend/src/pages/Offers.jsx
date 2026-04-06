import { useState, useEffect } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import { PlusIcon, PencilIcon, TrashIcon, GiftIcon } from '@heroicons/react/24/outline';

export default function Offers() {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState({ open: false, edit: null });
    const [form, setForm] = useState({ title: '', description: '', discount: '', validFrom: '', validTill: '' });

    const load = () => {
        api.get('/offers').then(r => setOffers(r.data.data)).catch(() => { }).finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const openCreate = () => {
        setForm({ title: '', description: '', discount: '', validFrom: '', validTill: '' });
        setModal({ open: true, edit: null });
    };
    const openEdit = (o) => {
        setForm({ title: o.title, description: o.description || '', discount: o.discount, validFrom: o.validFrom || '', validTill: o.validTill });
        setModal({ open: true, edit: o });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...form, discount: parseFloat(form.discount), validFrom: form.validFrom || null };
        try {
            if (modal.edit) {
                await api.put(`/offers/${modal.edit.id}`, payload);
                toast.success('Offer updated');
            } else {
                await api.post('/offers', payload);
                toast.success('Offer created & emails sent!');
            }
            setModal({ open: false, edit: null });
            load();
        } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this offer?')) return;
        try { await api.delete(`/offers/${id}`); toast.success('Deleted'); load(); } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="page-title">Offers & Promotions</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Create and manage promotional offers</p>
                </div>
                <button onClick={openCreate} className="btn-primary"><PlusIcon className="w-5 h-5" /> Create Offer</button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[...Array(3)].map((_, i) => <div key={i} className="card p-5 animate-pulse"><div className="h-6 bg-gray-200 rounded w-1/2 mb-3" /><div className="h-4 bg-gray-200 rounded w-3/4" /></div>)}
                </div>
            ) : offers.length === 0 ? (
                <div className="card p-12 text-center">
                    <GiftIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">No offers yet. Create your first promotional offer!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {offers.map(offer => (
                        <div key={offer.id} className={`card p-5 hover:translate-y-[-2px] ${offer.expired ? 'opacity-60' : ''}`}>
                            <div className="flex justify-between items-start">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{offer.title}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{offer.description || 'No description'}</p>
                                </div>
                                <div className="ml-3 flex-shrink-0">
                                    <div className="bg-gradient-to-br from-accent-500 to-accent-600 text-white text-lg font-bold px-3 py-1.5 rounded-xl">
                                        {parseFloat(offer.discount)}%
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 space-y-2">
                                {offer.validFrom && (
                                    <p className="text-xs text-gray-400">From: {offer.validFrom}</p>
                                )}
                                <p className="text-xs text-gray-400">Expires: {offer.validTill}</p>
                                <div className="flex items-center gap-2">
                                    {offer.expired ? <span className="badge-danger">Expired</span> : offer.active ? <span className="badge-success">Active</span> : <span className="badge-warning">Inactive</span>}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                                <button onClick={() => openEdit(offer)} className="p-2 rounded-lg hover:bg-primary-50 text-gray-400 hover:text-primary-600 transition"><PencilIcon className="w-4 h-4" /></button>
                                <button onClick={() => handleDelete(offer.id)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition"><TrashIcon className="w-4 h-4" /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal isOpen={modal.open} onClose={() => setModal({ open: false, edit: null })} title={modal.edit ? 'Edit Offer' : 'Create Offer'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div><label className="label-text">Title</label><input className="input-field" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
                    <div><label className="label-text">Description</label><textarea className="input-field" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div><label className="label-text">Discount (%)</label><input type="number" min="0.01" max="100" step="0.01" className="input-field" value={form.discount} onChange={e => setForm({ ...form, discount: e.target.value })} required /></div>
                        <div><label className="label-text">Valid From</label><input type="date" className="input-field" value={form.validFrom} onChange={e => setForm({ ...form, validFrom: e.target.value })} /></div>
                        <div><label className="label-text">Valid Till</label><input type="date" className="input-field" value={form.validTill} onChange={e => setForm({ ...form, validTill: e.target.value })} required /></div>
                    </div>
                    {!modal.edit && <p className="text-xs text-gray-400 bg-primary-50 dark:bg-primary-900/20 p-3 rounded-lg">📧 Creating an offer will automatically send email notifications to all your store customers.</p>}
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={() => setModal({ open: false, edit: null })} className="btn-secondary">Cancel</button>
                        <button type="submit" className="btn-primary">{modal.edit ? 'Update' : 'Create & Notify'}</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
