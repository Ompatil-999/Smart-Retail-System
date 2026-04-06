import { useState, useEffect } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon, EyeIcon } from '@heroicons/react/24/outline';

export default function Customers() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [modal, setModal] = useState({ open: false, edit: null });
    const [historyModal, setHistoryModal] = useState({ open: false, customer: null, bills: [] });
    const [form, setForm] = useState({ name: '', email: '', phone: '' });

    const load = () => {
        const url = search ? `/customers?search=${search}` : '/customers';
        api.get(url).then(r => setCustomers(r.data.data)).catch(() => { }).finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, [search]);

    const openCreate = () => { setForm({ name: '', email: '', phone: '' }); setModal({ open: true, edit: null }); };
    const openEdit = (c) => { setForm({ name: c.name, email: c.email || '', phone: c.phone || '' }); setModal({ open: true, edit: c }); };

    const viewHistory = async (customer) => {
        try {
            const res = await api.get(`/customers/${customer.id}/bills`);
            setHistoryModal({ open: true, customer, bills: res.data.data });
        } catch { toast.error('Failed to load bills'); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (modal.edit) {
                await api.put(`/customers/${modal.edit.id}`, form);
                toast.success('Customer updated');
            } else {
                await api.post('/customers', form);
                toast.success('Customer created');
            }
            setModal({ open: false, edit: null });
            load();
        } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this customer?')) return;
        try { await api.delete(`/customers/${id}`); toast.success('Deleted'); load(); } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="page-title">Customers</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your customer database</p>
                </div>
                <button onClick={openCreate} className="btn-primary"><PlusIcon className="w-5 h-5" /> Add Customer</button>
            </div>

            <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input className="input-field pl-10" placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            {loading ? (
                <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="card p-4 animate-pulse"><div className="h-5 bg-gray-200 rounded w-1/3" /></div>)}</div>
            ) : customers.length === 0 ? (
                <div className="card p-12 text-center"><p className="text-gray-500">No customers found.</p></div>
            ) : (
                <div className="card overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Name</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase hidden sm:table-cell">Email</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase hidden md:table-cell">Phone</th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                            {customers.map(c => (
                                <tr key={c.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">{c.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 hidden sm:table-cell">{c.email || '—'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">{c.phone || '—'}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => viewHistory(c)} className="p-2 rounded-lg hover:bg-violet-50 text-gray-400 hover:text-violet-600 transition" title="View Bills"><EyeIcon className="w-4 h-4" /></button>
                                            <button onClick={() => openEdit(c)} className="p-2 rounded-lg hover:bg-primary-50 text-gray-400 hover:text-primary-600 transition"><PencilIcon className="w-4 h-4" /></button>
                                            <button onClick={() => handleDelete(c.id)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition"><TrashIcon className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal isOpen={modal.open} onClose={() => setModal({ open: false, edit: null })} title={modal.edit ? 'Edit Customer' : 'New Customer'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div><label className="label-text">Name</label><input className="input-field" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
                    <div><label className="label-text">Email</label><input type="email" className="input-field" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
                    <div><label className="label-text">Phone</label><input className="input-field" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={() => setModal({ open: false, edit: null })} className="btn-secondary">Cancel</button>
                        <button type="submit" className="btn-primary">{modal.edit ? 'Update' : 'Create'}</button>
                    </div>
                </form>
            </Modal>

            <Modal isOpen={historyModal.open} onClose={() => setHistoryModal({ open: false, customer: null, bills: [] })} title={`Purchase History — ${historyModal.customer?.name || ''}`} size="lg">
                {historyModal.bills.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No purchase history found.</p>
                ) : (
                    <div className="space-y-3">
                        {historyModal.bills.map(bill => (
                            <div key={bill.id} className="border border-gray-100 dark:border-gray-700 rounded-xl p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-gray-100">{bill.billNumber}</p>
                                        <p className="text-xs text-gray-400">{new Date(bill.createdAt).toLocaleString()}</p>
                                    </div>
                                    <p className="font-bold text-primary-600">₹{parseFloat(bill.totalAmount).toLocaleString('en-IN')}</p>
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{bill.items?.length || 0} items</div>
                            </div>
                        ))}
                    </div>
                )}
            </Modal>
        </div>
    );
}
