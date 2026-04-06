import { useState, useEffect } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';
import toast from 'react-hot-toast';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon, PhotoIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [modal, setModal] = useState({ open: false, edit: null });
    const [form, setForm] = useState({ name: '', description: '', price: '', barcode: '', stockQty: '', lowStockThreshold: '10', categoryId: '' });
    const [uploading, setUploading] = useState(null);

    const load = () => {
        const url = search ? `/products?search=${search}` : '/products';
        api.get(url).then(r => setProducts(r.data.data)).catch(() => { }).finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, [search]);
    useEffect(() => { api.get('/categories').then(r => setCategories(r.data.data)).catch(() => { }); }, []);

    const openCreate = () => {
        setForm({ name: '', description: '', price: '', barcode: '', stockQty: '', lowStockThreshold: '10', categoryId: '' });
        setModal({ open: true, edit: null });
    };
    const openEdit = (p) => {
        setForm({
            name: p.name, description: p.description || '', price: p.price,
            barcode: p.barcode || '', stockQty: p.stockQty, lowStockThreshold: p.lowStockThreshold || '10',
            categoryId: p.categoryId || ''
        });
        setModal({ open: true, edit: p });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...form, price: parseFloat(form.price), stockQty: parseInt(form.stockQty), lowStockThreshold: parseInt(form.lowStockThreshold) || 10, categoryId: form.categoryId || null };
        try {
            if (modal.edit) {
                await api.put(`/products/${modal.edit.id}`, payload);
                toast.success('Product updated');
            } else {
                await api.post('/products', payload);
                toast.success('Product created');
            }
            setModal({ open: false, edit: null });
            load();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this product?')) return;
        try { await api.delete(`/products/${id}`); toast.success('Deleted'); load(); } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    };

    const handleImageUpload = async (productId, file) => {
        if (!file) return;
        const allowed = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowed.includes(file.type)) { toast.error('Only JPG, PNG, WebP allowed'); return; }
        if (file.size > 2 * 1024 * 1024) { toast.error('Max 2MB file size'); return; }

        setUploading(productId);
        const formData = new FormData();
        formData.append('file', file);
        try {
            await api.post(`/products/${productId}/image`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Image uploaded');
            load();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Upload failed');
        } finally {
            setUploading(null);
        }
    };

    const triggerUpload = (productId) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/jpeg,image/png,image/webp';
        input.onchange = (e) => handleImageUpload(productId, e.target.files[0]);
        input.click();
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="page-title">Products</h1>
                    <p className="text-gray-500 mt-1">Manage inventory and product catalog</p>
                </div>
                <button onClick={openCreate} className="btn-primary"><PlusIcon className="w-5 h-5" /> Add Product</button>
            </div>

            <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input className="input-field pl-10" placeholder="Search by name or barcode..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            {loading ? (
                <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="card p-4 animate-pulse"><div className="h-5 bg-gray-200 rounded w-1/2" /></div>)}</div>
            ) : products.length === 0 ? (
                <div className="card p-12 text-center"><p className="text-gray-500">No products found.</p></div>
            ) : (
                <div className="card overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Product</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Barcode</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Category</th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Price</th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Stock</th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                            {products.map(p => (
                                <tr key={p.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {p.imageUrl ? (
                                                <img src={`${p.imageUrl}`} alt={p.name}
                                                    className="w-10 h-10 rounded-lg object-cover border border-gray-100 flex-shrink-0" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                                    <PhotoIcon className="w-5 h-5 text-gray-300" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-medium text-gray-900">{p.name}</p>
                                                {p.description && <p className="text-xs text-gray-400 mt-0.5 truncate max-w-48">{p.description}</p>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 font-mono hidden md:table-cell">{p.barcode || '—'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 hidden sm:table-cell">{p.categoryName || '—'}</td>
                                    <td className="px-6 py-4 text-right font-semibold text-gray-900">₹{parseFloat(p.price).toLocaleString('en-IN')}</td>
                                    <td className="px-6 py-4 text-right">
                                        <span className={p.lowStock ? 'badge-danger' : 'badge-success'}>{p.stockQty}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button onClick={() => triggerUpload(p.id)} disabled={uploading === p.id}
                                                className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition"
                                                title="Upload image">
                                                {uploading === p.id
                                                    ? <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
                                                    : <ArrowUpTrayIcon className="w-4 h-4" />}
                                            </button>
                                            <button onClick={() => openEdit(p)} className="p-2 rounded-lg hover:bg-primary-50 text-gray-400 hover:text-primary-600 transition"><PencilIcon className="w-4 h-4" /></button>
                                            <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition"><TrashIcon className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal isOpen={modal.open} onClose={() => setModal({ open: false, edit: null })} title={modal.edit ? 'Edit Product' : 'New Product'} size="lg">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div><label className="label-text">Name</label><input className="input-field" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
                        <div><label className="label-text">Barcode</label><input className="input-field" value={form.barcode} onChange={e => setForm({ ...form, barcode: e.target.value })} /></div>
                        <div><label className="label-text">Price (₹)</label><input type="number" step="0.01" min="0.01" className="input-field" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required /></div>
                        <div><label className="label-text">Stock Qty</label><input type="number" min="0" className="input-field" value={form.stockQty} onChange={e => setForm({ ...form, stockQty: e.target.value })} required /></div>
                        <div><label className="label-text">Low Stock Threshold</label><input type="number" min="0" className="input-field" value={form.lowStockThreshold} onChange={e => setForm({ ...form, lowStockThreshold: e.target.value })} /></div>
                        <div>
                            <label className="label-text">Category</label>
                            <select className="input-field" value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })}>
                                <option value="">No category</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div><label className="label-text">Description</label><textarea className="input-field" rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={() => setModal({ open: false, edit: null })} className="btn-secondary">Cancel</button>
                        <button type="submit" className="btn-primary">{modal.edit ? 'Update' : 'Create'}</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
