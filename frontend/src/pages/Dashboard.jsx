import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { CubeIcon, UsersIcon, ShoppingCartIcon, CurrencyDollarIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/store/dashboard').then(res => setData(res.data.data)).catch(() => { }).finally(() => setLoading(false));
    }, []);

    const Skeleton = () => (
        <div className="card p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
            <div className="h-8 bg-gray-200 rounded w-16" />
        </div>
    );

    if (loading) return (
        <div className="space-y-6">
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {[...Array(5)].map((_, i) => <Skeleton key={i} />)}
            </div>
        </div>
    );

    const stats = [
        { label: 'Total Products', value: data?.totalProducts || 0, icon: CubeIcon, color: 'from-primary-500 to-primary-600', bg: 'bg-primary-50', text: 'text-primary-600' },
        { label: 'Total Customers', value: data?.totalCustomers || 0, icon: UsersIcon, color: 'from-accent-500 to-accent-600', bg: 'bg-accent-50', text: 'text-accent-600' },
        { label: 'Total Bills', value: data?.totalBills || 0, icon: ShoppingCartIcon, color: 'from-violet-500 to-violet-600', bg: 'bg-violet-50', text: 'text-violet-600' },
        { label: 'Total Revenue', value: `₹${(data?.totalRevenue || 0).toLocaleString('en-IN')}`, icon: CurrencyDollarIcon, color: 'from-amber-500 to-amber-600', bg: 'bg-amber-50', text: 'text-amber-600' },
        { label: 'Low Stock Items', value: data?.lowStockProducts || 0, icon: ExclamationTriangleIcon, color: 'from-red-500 to-red-600', bg: 'bg-red-50', text: 'text-red-600' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="page-title">Dashboard</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back! Here's your store overview.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
                {stats.map(({ label, value, icon: Icon, bg, text }) => (
                    <div key={label} className="card p-6 dark:bg-gray-900 hover:translate-y-[-2px]">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center`}>
                                <Icon className={`w-6 h-6 ${text}`} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        { label: 'New Bill', href: '/billing', color: 'bg-primary-600 hover:bg-primary-700' },
                        { label: 'Add Product', href: '/products', color: 'bg-accent-600 hover:bg-accent-700' },
                        { label: 'Add Customer', href: '/customers', color: 'bg-violet-600 hover:bg-violet-700' },
                        { label: 'Create Offer', href: '/offers', color: 'bg-amber-600 hover:bg-amber-700' },
                    ].map(({ label, href, color }) => (
                        <Link key={label} to={href}
                            className={`${color} text-white text-sm font-medium py-3 px-4 rounded-xl text-center transition-all duration-200 hover:translate-y-[-1px] hover:shadow-lg`}>
                            {label}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
