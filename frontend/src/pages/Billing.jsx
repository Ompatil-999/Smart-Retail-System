import { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import InvoiceView from '../components/InvoiceView';
import { MagnifyingGlassIcon, PlusIcon, MinusIcon, ShoppingCartIcon, XMarkIcon, UserPlusIcon } from '@heroicons/react/24/outline';

export default function Billing() {
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState('');
    const [cart, setCart] = useState([]);
    const [billDiscount, setBillDiscount] = useState('');
    const [customerId, setCustomerId] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [lastBill, setLastBill] = useState(null);
    const [taxRate, setTaxRate] = useState(18);
    const [showInvoice, setShowInvoice] = useState(false);

    // Inline new customer
    const [showNewCustomer, setShowNewCustomer] = useState(false);
    const [newCust, setNewCust] = useState({ name: '', email: '', phone: '' });

    useEffect(() => {
        api.get('/products').then(r => setProducts(r.data.data)).catch(() => { });
        api.get('/customers').then(r => setCustomers(r.data.data)).catch(() => { });
        api.get('/store').then(r => setTaxRate(parseFloat(r.data.data.defaultTaxRate))).catch(() => { });
    }, []);

    const searchResults = search.trim()
        ? products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || (p.barcode && p.barcode.includes(search)))
        : products;

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(i => i.productId === product.id);
            if (existing) {
                if (existing.quantity >= product.stockQty) { toast.error('No more stock available'); return prev; }
                return prev.map(i => i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            if (product.stockQty <= 0) { toast.error('Out of stock'); return prev; }
            return [...prev, { productId: product.id, name: product.name, price: parseFloat(product.price), quantity: 1, discount: 0, maxStock: product.stockQty, imageUrl: product.imageUrl }];
        });
    };

    const updateQty = (productId, delta) => {
        setCart(prev => prev.map(i => {
            if (i.productId !== productId) return i;
            const newQty = i.quantity + delta;
            if (newQty <= 0) return i;
            if (newQty > i.maxStock) { toast.error('Exceeds stock'); return i; }
            return { ...i, quantity: newQty };
        }));
    };

    const updateItemDiscount = (productId, discount) => {
        setCart(prev => prev.map(i => i.productId === productId ? { ...i, discount: parseFloat(discount) || 0 } : i));
    };

    const removeFromCart = (productId) => setCart(prev => prev.filter(i => i.productId !== productId));

    // Calculations: Subtotal → Item Discount → Bill Discount → GST → Total
    const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const totalItemDiscount = cart.reduce((sum, i) => sum + (i.discount || 0), 0);
    const billDiscountNum = parseFloat(billDiscount) || 0;
    const afterItemDiscount = Math.max(subtotal - totalItemDiscount, 0);
    const taxableAmount = Math.max(afterItemDiscount - billDiscountNum, 0);
    const gstAmount = +(taxableAmount * taxRate / 100).toFixed(2);
    const totalAmount = +(taxableAmount + gstAmount).toFixed(2);

    const handleCreateCustomer = async () => {
        if (!newCust.name.trim()) { toast.error('Customer name required'); return; }
        try {
            const res = await api.post('/customers', newCust);
            const created = res.data.data;
            setCustomers(prev => [...prev, created]);
            setCustomerId(String(created.id));
            setNewCust({ name: '', email: '', phone: '' });
            setShowNewCustomer(false);
            toast.success('Customer created & selected');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create customer');
        }
    };

    const handleSubmit = async () => {
        if (cart.length === 0) { toast.error('Cart is empty'); return; }
        setSubmitting(true);
        try {
            const payload = {
                customerId: customerId || null,
                billDiscount: billDiscountNum,
                items: cart.map(i => ({ productId: i.productId, quantity: i.quantity, discount: i.discount || 0 }))
            };
            const res = await api.post('/bills', payload);
            setLastBill(res.data.data);
            setShowInvoice(true);
            setCart([]);
            setBillDiscount('');
            setCustomerId('');
            setSearch('');
            toast.success('Bill generated successfully!');
            // Refresh product stock
            api.get('/products').then(r => setProducts(r.data.data)).catch(() => { });
            api.get('/customers').then(r => setCustomers(r.data.data)).catch(() => { });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Billing failed');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="page-title">Billing</h1>
                <p className="text-gray-500 mt-1">Create invoices and manage transactions</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                {/* Left: Product Search */}
                <div className="xl:col-span-3 space-y-4">
                    <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input className="input-field pl-10 text-base" placeholder="Search products by name or barcode..."
                            value={search} onChange={e => setSearch(e.target.value)} autoFocus />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[calc(100vh-320px)] overflow-y-auto pr-1">
                        {searchResults.map(p => (
                            <button key={p.id} onClick={() => addToCart(p)} disabled={p.stockQty <= 0}
                                className="card p-3 text-left hover:border-primary-200 hover:shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed group">
                                <div className="flex gap-3 items-start">
                                    {p.imageUrl ? (
                                        <img src={`${p.imageUrl}`} alt={p.name}
                                            className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-gray-100" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                                            <span className="text-gray-300 text-lg">📦</span>
                                        </div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold text-gray-900 text-sm truncate group-hover:text-primary-700 transition">{p.name}</p>
                                        {p.barcode && <p className="text-xs text-gray-400 font-mono mt-0.5">{p.barcode}</p>}
                                        <div className="flex justify-between items-center mt-1.5">
                                            <p className="text-sm font-bold text-primary-600">₹{p.price}</p>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${p.stockQty <= (p.lowStockThreshold || 10) ? 'bg-red-50 text-red-600' : 'bg-accent-50 text-accent-700'}`}>
                                                Stock: {p.stockQty}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}
                        {searchResults.length === 0 && (
                            <div className="col-span-full text-center py-12 text-gray-400">No products found</div>
                        )}
                    </div>
                </div>

                {/* Right: Cart */}
                <div className="xl:col-span-2">
                    <div className="card sticky top-24">
                        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                            <ShoppingCartIcon className="w-5 h-5 text-primary-600" />
                            <h2 className="font-semibold text-gray-900">Cart</h2>
                            <span className="ml-auto bg-primary-100 text-primary-700 text-xs font-semibold px-2 py-0.5 rounded-full">{cart.length} items</span>
                        </div>

                        {cart.length === 0 ? (
                            <div className="p-8 text-center text-gray-400">
                                <ShoppingCartIcon className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                                <p>Select products to start billing</p>
                            </div>
                        ) : (
                            <div className="max-h-64 overflow-y-auto divide-y divide-gray-50">
                                {cart.map(item => (
                                    <div key={item.productId} className="px-5 py-3">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0 flex-1">
                                                <p className="font-medium text-sm text-gray-900 truncate">{item.name}</p>
                                                <p className="text-xs text-gray-400 mt-0.5">₹{item.price} × {item.quantity}</p>
                                            </div>
                                            <p className="font-semibold text-sm text-gray-900 whitespace-nowrap">₹{(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                        <div className="flex items-center gap-3 mt-2">
                                            <div className="flex items-center border border-gray-200 rounded-lg">
                                                <button onClick={() => updateQty(item.productId, -1)} className="p-1.5 hover:bg-gray-50 transition rounded-l-lg">
                                                    <MinusIcon className="w-3.5 h-3.5 text-gray-500" />
                                                </button>
                                                <span className="px-3 text-sm font-medium min-w-[2rem] text-center">{item.quantity}</span>
                                                <button onClick={() => updateQty(item.productId, 1)} className="p-1.5 hover:bg-gray-50 transition rounded-r-lg">
                                                    <PlusIcon className="w-3.5 h-3.5 text-gray-500" />
                                                </button>
                                            </div>
                                            <input type="number" min="0" step="0.01" placeholder="Disc"
                                                className="w-20 text-xs px-2 py-1.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary-500"
                                                value={item.discount || ''} onChange={e => updateItemDiscount(item.productId, e.target.value)} />
                                            <button onClick={() => removeFromCart(item.productId)} className="p-1.5 hover:bg-red-50 rounded-lg transition ml-auto">
                                                <XMarkIcon className="w-4 h-4 text-red-400" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Customer Selection + Inline Create */}
                        <div className="px-5 py-3 border-t border-gray-100 space-y-3">
                            <div className="flex items-center gap-2">
                                <select className="input-field text-sm flex-1" value={customerId} onChange={e => setCustomerId(e.target.value)}>
                                    <option value="">Walk-in Customer</option>
                                    {customers.map(c => <option key={c.id} value={c.id}>{c.name} {c.email ? `(${c.email})` : c.phone ? `(${c.phone})` : ''}</option>)}
                                </select>
                                <button onClick={() => setShowNewCustomer(!showNewCustomer)}
                                    className="p-2.5 border border-gray-200 rounded-lg hover:bg-primary-50 hover:border-primary-200 transition"
                                    title="Add new customer">
                                    <UserPlusIcon className="w-4 h-4 text-primary-600" />
                                </button>
                            </div>

                            {/* Inline New Customer Form */}
                            {showNewCustomer && (
                                <div className="bg-primary-50/50 border border-primary-100 rounded-lg p-3 space-y-2">
                                    <p className="text-xs font-semibold text-primary-700">Quick Add Customer</p>
                                    <input className="input-field text-sm" placeholder="Name *" value={newCust.name}
                                        onChange={e => setNewCust({ ...newCust, name: e.target.value })} />
                                    <div className="grid grid-cols-2 gap-2">
                                        <input className="input-field text-sm" placeholder="Email" value={newCust.email}
                                            onChange={e => setNewCust({ ...newCust, email: e.target.value })} />
                                        <input className="input-field text-sm" placeholder="Phone" value={newCust.phone}
                                            onChange={e => setNewCust({ ...newCust, phone: e.target.value })} />
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={handleCreateCustomer}
                                            className="btn-primary text-xs py-1.5 px-3">Create & Select</button>
                                        <button onClick={() => { setShowNewCustomer(false); setNewCust({ name: '', email: '', phone: '' }); }}
                                            className="text-xs text-gray-500 hover:text-gray-700">Cancel</button>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-2">
                                <label className="text-sm text-gray-500 whitespace-nowrap">Bill Discount:</label>
                                <input type="number" min="0" step="0.01" className="input-field text-sm" placeholder="₹0.00"
                                    value={billDiscount} onChange={e => setBillDiscount(e.target.value)} />
                            </div>
                        </div>

                        {/* Totals */}
                        <div className="px-5 py-4 border-t border-gray-200 bg-gray-50/50 space-y-2 text-sm">
                            <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                            {totalItemDiscount > 0 && <div className="flex justify-between text-accent-600"><span>Item Discounts</span><span>-₹{totalItemDiscount.toFixed(2)}</span></div>}
                            {billDiscountNum > 0 && <div className="flex justify-between text-accent-600"><span>Bill Discount</span><span>-₹{billDiscountNum.toFixed(2)}</span></div>}
                            <div className="flex justify-between text-gray-600"><span>GST ({taxRate}%)</span><span>₹{gstAmount.toFixed(2)}</span></div>
                            <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                                <span>Total</span><span className="text-primary-600">₹{totalAmount.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="px-5 py-4">
                            <button onClick={handleSubmit} disabled={cart.length === 0 || submitting}
                                className="btn-primary w-full justify-center text-base py-3 disabled:opacity-50">
                                {submitting ? <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" /> : 'Generate Invoice'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Invoice View Modal */}
            {showInvoice && lastBill && (
                <InvoiceView bill={lastBill} onClose={() => setShowInvoice(false)} />
            )}

            {/* Last Bill Summary (compact) */}
            {lastBill && !showInvoice && (
                <div className="card p-4 border-l-4 border-accent-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-gray-900 text-sm">Last Invoice: {lastBill.billNumber}</h3>
                            <p className="text-sm text-gray-500">Total: ₹{parseFloat(lastBill.totalAmount).toFixed(2)} • {lastBill.items?.length} items</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setShowInvoice(true)}
                                className="px-3 py-1.5 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition">
                                View Invoice
                            </button>
                            <button onClick={() => setLastBill(null)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                                <XMarkIcon className="w-4 h-4 text-gray-400" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
