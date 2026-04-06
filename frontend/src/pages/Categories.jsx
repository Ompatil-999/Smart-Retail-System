import { useState, useEffect } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [modal, setModal] = useState({ open: false, edit: null });
    const [form, setForm] = useState({ name: '', description: '' });

    const load = () => {
        const url = search ? `/categories?search=${search}` : '/categories';
        api.get(url).then(r => setCategories(r.data.data)).catch(() => toast.error('Failed to load')).finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, [search]);

    const openCreate = () => { setForm({ name: '', description: '' }); setModal({ open: true, edit: null }); };
    const openEdit = (cat) => { setForm({ name: cat.name, description: cat.description || '' }); setModal({ open: true, edit: cat }); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (modal.edit) {
                await api.put(`/categories/${modal.edit.id}`, form);
                toast.success('Category updated');
            } else {
                await api.post('/categories', form);
                toast.success('Category created');
            }
            setModal({ open: false, edit: null });
            load();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this category?')) return;
        try {
            await api.delete(`/categories/${id}`);
            toast.success('Category deleted');
            load();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="page-title">Categories</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your product categories</p>
                </div>
                <button onClick={openCreate} className="btn-primary">
                    <PlusIcon className="w-5 h-5" /> Add Category
                </button>
            </div>

            <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input className="input-field pl-10" placeholder="Search categories..."
                    value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            {loading ? (
                <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="card p-4 animate-pulse"><div className="h-5 bg-gray-200 rounded w-1/3" /></div>)}</div>
            ) : categories.length === 0 ? (
                <div className="card p-12 text-center">
                    <p className="text-gray-500 dark:text-gray-400">No categories found. Create your first category!</p>
                </div>
            ) : (
                <div className="card overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">Description</th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                            {categories.map(cat => (
                                <tr key={cat.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">{cat.name}</td>
                                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm hidden sm:table-cell">{cat.description || '—'}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => openEdit(cat)} className="p-2 rounded-lg hover:bg-primary-50 text-gray-400 hover:text-primary-600 transition"><PencilIcon className="w-4 h-4" /></button>
                                            <button onClick={() => handleDelete(cat.id)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition"><TrashIcon className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal isOpen={modal.open} onClose={() => setModal({ open: false, edit: null })} title={modal.edit ? 'Edit Category' : 'New Category'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="label-text">Name</label>
                        <input className="input-field" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                    </div>
                    <div>
                        <label className="label-text">Description</label>
                        <textarea className="input-field" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={() => setModal({ open: false, edit: null })} className="btn-secondary">Cancel</button>
                        <button type="submit" className="btn-primary">{modal.edit ? 'Update' : 'Create'}</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
