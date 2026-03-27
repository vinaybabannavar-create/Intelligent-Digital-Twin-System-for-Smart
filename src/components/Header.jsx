import React, { useState, useEffect, useRef } from 'react';
import { Bell, Search, User, ChevronDown, Check, AlertTriangle, TrendingUp, Clock, Droplets, Bug } from 'lucide-react';
import { useCrop } from '../context/CropContext';
import { useAlerts } from '../context/AlertContext';

const iconMap = {
    warning: AlertTriangle,
    water: Droplets,
    price: TrendingUp,
    harvest: Clock,
    pest: Bug,
};

const formatTimeAgo = (timestamp) => {
    if (!timestamp) return '';
    const diff = Math.floor((new Date() - new Date(timestamp)) / 1000); // in seconds
    if (diff < 60) return 'just now';
    const mins = Math.floor(diff / 60);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
};

const Header = () => {
    const { selectedCrop, cropData, cropList, switchCrop } = useCrop();
    const { notificationHistory, unreadCount, markAllRead, silenceAlarm, isSilenced } = useAlerts();

    // Load farmer name from profile
    const [farmerName, setFarmerName] = useState('Farmer');
    useEffect(() => {
        const loadName = () => {
            const saved = localStorage.getItem('agritwin_farmer_profile');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.name) setFarmerName(parsed.name);
            }
        };
        loadName();
        // Listen for storage changes (when profile is saved)
        window.addEventListener('storage', loadName);
        const interval = setInterval(loadName, 2000);
        return () => {
            window.removeEventListener('storage', loadName);
            clearInterval(interval);
        };
    }, []);

    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Auto-update timestamps
    const [, setTick] = useState(0);
    useEffect(() => {
        const timer = setInterval(() => setTick(t => t + 1), 60000); // Update relative times every minute
        return () => clearInterval(timer);
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsNotificationOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleNotifications = () => {
        setIsNotificationOpen(!isNotificationOpen);
        if (!isNotificationOpen && unreadCount > 0) {
            markAllRead();
        }
    };

    return (
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3 bg-agridark/90 dark:bg-agridark/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700/50 shadow-sm dark:shadow-lg transition-colors">
            {/* Search */}
            <div className="flex items-center flex-1">
                <div className="relative w-full max-w-md">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                    </span>
                    <input
                        type="text"
                        className="w-full py-2.5 pl-10 pr-4 text-sm bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:border-agrigreen-500 focus:ring-1 focus:ring-agrigreen-500/50 transition-all placeholder-slate-400 dark:placeholder-slate-500"
                        placeholder="Search farms, crops, data..."
                    />
                </div>
            </div>

            {/* Crop Selector */}
            <div className="flex items-center gap-4">
                <div className="relative">
                    <select
                        value={selectedCrop}
                        onChange={(e) => switchCrop(e.target.value)}
                        className="appearance-none bg-slate-100 dark:bg-gradient-to-r dark:from-agrigreen-900/40 dark:to-agrigreen-800/20 border border-agrigreen-500/30 text-agrigreen-600 dark:text-agrigreen-400 text-sm font-semibold py-2.5 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-agrigreen-500/40 cursor-pointer transition-all hover:border-agrigreen-500/60"
                    >
                        {cropList.map((crop) => (
                            <option key={crop} value={crop} className="bg-white dark:bg-agridark text-slate-800 dark:text-slate-200">
                                {crop}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-agrigreen-600 dark:text-agrigreen-400 pointer-events-none" />
                </div>

                {/* Notification bell */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={toggleNotifications}
                        className={`relative p-2 rounded-full transition-colors ${isNotificationOpen ? 'bg-slate-200 dark:bg-slate-700 text-agrigreen-600 dark:text-agrigreen-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                    >
                        <Bell className="w-5 h-5" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-agridark animate-pulse" />
                        )}
                    </button>

                    {/* Notification Dropdown */}
                    {isNotificationOpen && (
                        <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden animate-fadeInUp origin-top-right">
                            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/20">
                                <div>
                                    <h3 className="text-sm font-black text-slate-800 dark:text-slate-100">Alert History</h3>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-0.5">{selectedCrop} Profile</p>
                                </div>
                                {unreadCount > 0 && (
                                    <span className="text-[10px] bg-agrigreen-500/10 text-agrigreen-600 dark:text-agrigreen-400 px-2 py-1 rounded-full font-bold">
                                        {unreadCount} New
                                    </span>
                                )}
                            </div>
                            
                            {/* Alarm Control Section */}
                            <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/10 flex items-center justify-between">
                                <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Sound Alerts</p>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); silenceAlarm(); }}
                                    className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${isSilenced ? 'bg-slate-200 dark:bg-slate-700 text-slate-500' : 'bg-agrigreen-500/10 text-agrigreen-600 dark:text-agrigreen-400 border border-agrigreen-500/30'}`}
                                >
                                    {isSilenced ? '✓ MUTED' : '🔊 MUTE ALARMS'}
                                </button>
                            </div>

                            <div className="max-h-96 overflow-y-auto">
                                {notificationHistory.length === 0 ? (
                                    <div className="p-6 text-center text-slate-500 dark:text-slate-400">
                                        <Check className="w-8 h-8 mx-auto mb-2 text-agrigreen-500/50" />
                                        <p className="text-sm font-bold">All clear for {selectedCrop}</p>
                                        <p className="text-xs">No recent alerts recorded.</p>
                                    </div>
                                ) : (
                                    notificationHistory.map((alert) => {
                                        const Icon = iconMap[alert.type] || AlertTriangle;
                                        return (
                                            <div key={alert.id} className="p-4 border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors flex gap-3">
                                                <div className="mt-1">
                                                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                                        <Icon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start mb-0.5">
                                                        <p className={`text-sm font-bold text-slate-800 dark:text-slate-200 ${!alert.read ? 'text-agrigreen-600 dark:text-agrigreen-400' : ''}`}>
                                                            {alert.title}
                                                        </p>
                                                        <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap ml-2">
                                                            {formatTimeAgo(alert.timestamp)}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                                        {alert.message}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {notificationHistory.length > 0 && (
                                <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/20 text-center">
                                    <button className="text-xs font-bold text-agrigreen-600 dark:text-agrigreen-400 hover:text-agrigreen-700 dark:hover:text-agrigreen-300">
                                        View Security Logs
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Profile */}
                <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-700/50">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{farmerName}</p>
                        <p className="text-xs text-slate-500">{cropData.emoji} {selectedCrop}</p>
                    </div>
                    <div className="flex items-center justify-center w-9 h-9 bg-gradient-to-br from-agrigreen-600 to-agrigreen-800 text-white rounded-full shadow-lg">
                        <User className="w-5 h-5" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
