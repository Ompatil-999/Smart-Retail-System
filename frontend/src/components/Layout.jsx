import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import {
    HomeIcon, TagIcon, CubeIcon, UsersIcon, ShoppingCartIcon,
    GiftIcon, Cog6ToothIcon, ArrowRightStartOnRectangleIcon,
    Bars3Icon, XMarkIcon, BuildingStorefrontIcon,
    SunIcon, MoonIcon
} from '@heroicons/react/24/outline';

const navItems = [
    { path: '/', icon: HomeIcon, label: 'Dashboard' },
    { path: '/categories', icon: TagIcon, label: 'Categories' },
    { path: '/products', icon: CubeIcon, label: 'Products' },
    { path: '/customers', icon: UsersIcon, label: 'Customers' },
    { path: '/billing', icon: ShoppingCartIcon, label: 'Billing' },
    { path: '/offers', icon: GiftIcon, label: 'Offers' },
    { path: '/settings', icon: Cog6ToothIcon, label: 'Settings' },
];

export default function Layout() {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const Sidebar = ({ mobile = false }) => (
        <div className={`flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 ${mobile ? 'w-72' : collapsed ? 'w-20' : 'w-64'} transition-all duration-300`}>
            {/* Logo */}
            <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100 dark:border-gray-800">
                <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center">
                    <BuildingStorefrontIcon className="w-5 h-5 text-white" />
                </div>
                {(!collapsed || mobile) && (
                    <div className="overflow-hidden">
                        <h1 className="text-lg font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent truncate">SmartRetail</h1>
                    </div>
                )}
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {navItems.map(({ path, icon: Icon, label }) => (
                    <NavLink key={path} to={path} end={path === '/'}
                        onClick={() => mobile && setMobileOpen(false)}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${isActive
                                ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
                            }`
                        }
                    >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        {(!collapsed || mobile) && <span className="truncate">{label}</span>}
                    </NavLink>
                ))}
            </nav>

            {/* Bottom */}
            <div className="p-3 border-t border-gray-100 dark:border-gray-800 space-y-1">
                {/* Theme toggle */}
                <button onClick={toggleTheme}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800 transition-all duration-200">
                    {theme === 'dark' ? (
                        <SunIcon className="w-5 h-5 flex-shrink-0 text-amber-500" />
                    ) : (
                        <MoonIcon className="w-5 h-5 flex-shrink-0 text-indigo-500" />
                    )}
                    {(!collapsed || mobile) && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
                </button>

                {/* Logout */}
                <button onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-all duration-200">
                    <ArrowRightStartOnRectangleIcon className="w-5 h-5 flex-shrink-0" />
                    {(!collapsed || mobile) && <span>Log out</span>}
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block flex-shrink-0">
                <Sidebar />
            </div>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
                    <div className="relative h-full">
                        <Sidebar mobile />
                    </div>
                </div>
            )}

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top bar */}
                <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                                <Bars3Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            </button>
                            <button onClick={() => setCollapsed(!collapsed)} className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                                <Bars3Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            </button>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{user?.storeName}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.ownerName}</p>
                            </div>
                            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                {user?.ownerName?.charAt(0)?.toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-auto p-4 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
