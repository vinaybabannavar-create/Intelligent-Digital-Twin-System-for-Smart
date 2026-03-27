import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    Home,
    Leaf,
    Sprout,
    BarChart2,
    TrendingUp,
    Calendar,
    Settings,
    PanelLeftClose,
    PanelLeftOpen
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const navItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Crop Health', path: '/health', icon: Leaf },
    { name: 'Growth Stage', path: '/growth', icon: Sprout },
    { name: 'Yield Prediction', path: '/yield', icon: BarChart2 },
    { name: 'Market Demand', path: '/demand', icon: TrendingUp },
    { name: 'Harvest Advisor', path: '/harvest', icon: Calendar },
];

const Sidebar = ({ collapsed, onToggle }) => {
    return (
        <div
            className={cn(
                'flex flex-col bg-agricard border-r border-slate-200 dark:border-slate-700/50 transition-all duration-300 ease-in-out relative',
                collapsed ? 'w-20' : 'w-64'
            )}
        >
            {/* Logo */}
            <div className="flex items-center justify-center h-20 border-b border-slate-200 dark:border-slate-700/50">
                <div className="flex items-center gap-2 text-agrigreen-500">
                    <Leaf className="w-8 h-8 flex-shrink-0" />
                    {!collapsed && (
                        <span className="text-xl font-bold tracking-wider text-slate-800 dark:text-white whitespace-nowrap">
                            AgriTwin<span className="text-agrigreen-500">AI</span>
                        </span>
                    )}
                </div>
            </div>

            {/* Toggle Button */}
            <button
                onClick={onToggle}
                className="absolute -right-3 top-24 z-50 w-6 h-6 rounded-full bg-agrigreen-500 text-white flex items-center justify-center shadow-lg hover:bg-agrigreen-400 transition-colors border-2 border-slate-800"
                title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
                {collapsed
                    ? <PanelLeftOpen className="w-3.5 h-3.5" />
                    : <PanelLeftClose className="w-3.5 h-3.5" />
                }
            </button>

            {/* Nav Items */}
            <div className="flex flex-col flex-1 overflow-y-auto">
                <nav className="flex-1 px-3 py-6 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            title={collapsed ? item.name : ''}
                            className={({ isActive }) =>
                                cn(
                                    'flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200',
                                    collapsed && 'justify-center px-2',
                                    isActive
                                        ? 'bg-agrigreen-500/10 text-agrigreen-500'
                                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                                )
                            }
                        >
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            {!collapsed && <span className="whitespace-nowrap">{item.name}</span>}
                        </NavLink>
                    ))}
                </nav>
            </div>

            {/* Settings */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-700/50">
                <NavLink
                    to="/settings"
                    title={collapsed ? 'Settings' : ''}
                    className={({ isActive }) =>
                        cn(
                            'flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200',
                            collapsed && 'justify-center px-2',
                            isActive
                                ? 'bg-agrigreen-500/10 text-agrigreen-500'
                                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                        )
                    }
                >
                    <Settings className="w-5 h-5 flex-shrink-0" />
                    {!collapsed && <span className="whitespace-nowrap">Settings</span>}
                </NavLink>
            </div>
        </div>
    );
};

export default Sidebar;
