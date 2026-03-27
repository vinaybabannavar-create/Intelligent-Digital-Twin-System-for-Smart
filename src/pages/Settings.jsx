import React, { useState, useEffect } from 'react';
import {
    Moon, Sun, Monitor, Bell, Globe, Shield, Zap, User, Phone, MapPin,
    Ruler, Languages, Save, Edit3, Check, X, Thermometer, Bug, Droplets,
    TrendingUp, Calendar, BarChart2, Smartphone, AlertTriangle, Leaf, Mail
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useCrop } from '../context/CropContext';

const PROFILE_KEY = 'agritwin_farmer_profile';
const ALERTS_PREF_KEY = 'agritwin_alert_prefs';

const defaultProfile = {
    name: '',
    mobile: '',
    email: '',
    farmLocation: '',
    state: '',
    farmArea: '',
    language: 'English',
    emergencyContact: '',
};

const defaultAlertPrefs = {
    weatherAlerts: true,
    pestAlerts: true,
    irrigationAlerts: true,
    marketAlerts: true,
    harvestAlerts: true,
    weeklySummary: true,
    alertFrequency: 'realtime',
    quietHoursEnabled: false,
    quietStart: '22:00',
    quietEnd: '06:00',
};

// ── Extracted components (outside Settings to prevent re-mount on parent re-render) ──

const Toggle = ({ enabled, onToggle }) => (
    <button
        onClick={onToggle}
        className={`relative w-14 h-7 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-agrigreen-500/50 ${enabled ? 'bg-agrigreen-500' : 'bg-slate-300 dark:bg-slate-700'}`}
    >
        <div className={`w-5 h-5 bg-white rounded-full shadow-lg transform transition-transform duration-300 ${enabled ? 'translate-x-7' : 'translate-x-0'}`} />
    </button>
);

const SettingItem = ({ icon: Icon, title, subtext, action }) => (
    <div className="flex items-center justify-between p-4 bg-slate-800/10 dark:bg-slate-800/20 rounded-2xl border border-slate-200 dark:border-slate-700/30 hover:border-agrigreen-500/30 transition-all group">
        <div className="flex items-center gap-4 text-left">
            <div className="p-3 bg-agrigreen-500/10 rounded-xl group-hover:scale-110 transition-transform">
                <Icon className="w-5 h-5 text-agrigreen-500" />
            </div>
            <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100">{title}</h3>
                <p className="text-xs text-slate-500">{subtext}</p>
            </div>
        </div>
        <div className="flex-shrink-0">{action}</div>
    </div>
);

const ProfileField = ({ icon: Icon, label, value, onChange, type, placeholder, isEditing }) => (
    <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-700/30">
        <div className="p-2.5 bg-agrigreen-500/10 rounded-lg">
            <Icon className="w-4 h-4 text-agrigreen-500" />
        </div>
        <div className="flex-1 text-left">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">{label}</p>
            {isEditing ? (
                <input
                    type={type || 'text'}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:border-agrigreen-500 focus:ring-1 focus:ring-agrigreen-500/50 outline-none transition-all"
                />
            ) : (
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {value || <span className="text-slate-400 italic">Not set</span>}
                </p>
            )}
        </div>
    </div>
);

const LiveStatusGrid = ({ liveData, selectedCrop, cropData, profile }) => (
    <div className="glass-card p-8 space-y-6">
        <h2 className="text-lg font-bold text-agrigreen-500 flex items-center gap-2">
            <Leaf className="w-5 h-5" /> Live System Status
            <span className="text-[10px] bg-agrigreen-500/20 text-agrigreen-600 dark:text-agrigreen-300 px-2 py-0.5 rounded-full font-mono animate-pulse ml-2">LIVE</span>
        </h2>
        <p className="text-xs text-slate-500 text-left">Real-time snapshot of what the system is currently monitoring for your farm.</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
                { label: 'Temperature', value: `${liveData.temperature.toFixed(1)}°C`, icon: '🌡️' },
                { label: 'Humidity', value: `${liveData.humidity.toFixed(1)}%`, icon: '💧' },
                { label: 'Soil Moisture', value: `${(liveData.soilMoisture || 0).toFixed?.(1) || 0}%`, icon: '🌱' },
                { label: 'Wind Speed', value: `${liveData.windSpeed.toFixed(1)} km/h`, icon: '💨' },
                { label: 'Health Score', value: `${liveData.healthScore.toFixed(1)}/100`, icon: '❤️' },
                { label: 'Market Price', value: `₹${liveData.currentPrice.toFixed(1)}/kg`, icon: '📈' },
                { label: 'Active Crop', value: selectedCrop, icon: cropData.emoji },
                { label: 'AI Status', value: liveData.aiStatus, icon: '🤖' },
            ].map((item, i) => (
                <div key={i} className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-3 border border-slate-200 dark:border-slate-700/30 text-left">
                    <p className="text-lg mb-1">{item.icon}</p>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">{item.label}</p>
                    <p className="text-sm font-black text-slate-800 dark:text-slate-100">{item.value}</p>
                </div>
            ))}
        </div>

        <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3 text-left">
            <AlertTriangle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
                <p className="text-sm font-bold text-blue-600 dark:text-blue-400">All data synced to {profile.mobile}</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    The above sensor readings are being continuously streamed from your connected IoT devices.
                    Any threshold breaches will trigger alerts to your registered mobile instantly.
                </p>
            </div>
        </div>
    </div>
);

// ── Main Settings Component ──

const Settings = () => {
    const {
        theme, toggleTheme,
        region, setRegion,
        alertsEnabled, setAlertsEnabled,
        dataSovereignty, setDataSovereignty
    } = useTheme();
    const { liveData, cropData, selectedCrop } = useCrop();

    // Profile state
    const [profile, setProfile] = useState(defaultProfile);
    const [isEditing, setIsEditing] = useState(false);
    const [editDraft, setEditDraft] = useState(defaultProfile);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);

    // Alert preferences state
    const [alertPrefs, setAlertPrefs] = useState(defaultAlertPrefs);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem(PROFILE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            setProfile(parsed);
            setEditDraft(parsed);
            setIsRegistered(!!parsed.mobile);
        }
        const savedAlerts = localStorage.getItem(ALERTS_PREF_KEY);
        if (savedAlerts) {
            setAlertPrefs(JSON.parse(savedAlerts));
        }
    }, []);

    const handleSaveProfile = () => {
        setProfile(editDraft);
        localStorage.setItem(PROFILE_KEY, JSON.stringify(editDraft));
        setIsEditing(false);
        setIsRegistered(!!editDraft.mobile);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
    };

    const handleCancelEdit = () => {
        setEditDraft(profile);
        setIsEditing(false);
    };

    const updateDraftField = (field, value) => {
        setEditDraft(prev => ({ ...prev, [field]: value }));
    };

    const updateAlertPref = (key, value) => {
        const updated = { ...alertPrefs, [key]: value };
        setAlertPrefs(updated);
        localStorage.setItem(ALERTS_PREF_KEY, JSON.stringify(updated));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fadeInUp">
            <div className="text-left">
                <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Settings & Profile</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Manage your farm identity, alert preferences, and system configuration.</p>
            </div>

            {/* ═══════════════ FARMER PROFILE ═══════════════ */}
            <div className="glass-card p-8 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-agrigreen-500 flex items-center gap-2">
                        <User className="w-5 h-5" /> Farmer Profile
                    </h2>
                    <div className="flex items-center gap-2">
                        {saveSuccess && (
                            <span className="text-xs bg-agrigreen-500/10 text-agrigreen-600 dark:text-agrigreen-400 px-3 py-1 rounded-full font-bold animate-fadeInUp flex items-center gap-1">
                                <Check className="w-3 h-3" /> Saved
                            </span>
                        )}
                        {isRegistered && !isEditing && (
                            <span className="text-[10px] bg-agrigreen-500/10 text-agrigreen-600 dark:text-agrigreen-400 px-2 py-1 rounded-full font-bold uppercase">
                                ✅ Registered
                            </span>
                        )}
                        {isEditing ? (
                            <div className="flex gap-2">
                                <button onClick={handleCancelEdit} className="px-4 py-2 text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1">
                                    <X className="w-3 h-3" /> Cancel
                                </button>
                                <button onClick={handleSaveProfile} className="px-4 py-2 text-xs font-bold text-white bg-agrigreen-500 rounded-lg hover:bg-agrigreen-400 transition-colors flex items-center gap-1 shadow-lg shadow-agrigreen-500/30">
                                    <Save className="w-3 h-3" /> Save Profile
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => setIsEditing(true)} className="px-4 py-2 text-xs font-bold text-agrigreen-600 dark:text-agrigreen-400 bg-agrigreen-500/10 rounded-lg hover:bg-agrigreen-500/20 transition-colors flex items-center gap-1">
                                <Edit3 className="w-3 h-3" /> Edit
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ProfileField icon={User} label="Farmer Name" value={isEditing ? editDraft.name : profile.name} onChange={(e) => updateDraftField('name', e.target.value)} placeholder="Enter your full name" isEditing={isEditing} />
                    <ProfileField icon={Phone} label="Mobile Number" value={isEditing ? editDraft.mobile : profile.mobile} onChange={(e) => updateDraftField('mobile', e.target.value)} type="tel" placeholder="+91 9876543210" isEditing={isEditing} />
                    <ProfileField icon={Mail} label="Receiver Email (For Critical Alerts)" value={isEditing ? editDraft.email : profile.email} onChange={(e) => updateDraftField('email', e.target.value)} type="email" placeholder="farmer@example.com" isEditing={isEditing} />
                    <ProfileField icon={MapPin} label="Farm Location (District)" value={isEditing ? editDraft.farmLocation : profile.farmLocation} onChange={(e) => updateDraftField('farmLocation', e.target.value)} placeholder="e.g. Dharwad" isEditing={isEditing} />
                    <ProfileField icon={MapPin} label="State" value={isEditing ? editDraft.state : profile.state} onChange={(e) => updateDraftField('state', e.target.value)} placeholder="e.g. Karnataka" isEditing={isEditing} />
                    <ProfileField icon={Ruler} label="Total Farm Area (acres)" value={isEditing ? editDraft.farmArea : profile.farmArea} onChange={(e) => updateDraftField('farmArea', e.target.value)} type="number" placeholder="e.g. 5" isEditing={isEditing} />
                    <ProfileField icon={Phone} label="Emergency Contact" value={isEditing ? editDraft.emergencyContact : profile.emergencyContact} onChange={(e) => updateDraftField('emergencyContact', e.target.value)} type="tel" placeholder="+91 9000000000" isEditing={isEditing} />
                </div>

                {/* Language Selector */}
                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-700/30">
                    <div className="p-2.5 bg-agrigreen-500/10 rounded-lg">
                        <Languages className="w-4 h-4 text-agrigreen-500" />
                    </div>
                    <div className="flex-1 text-left">
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">Preferred Language</p>
                        {isEditing ? (
                            <select
                                value={editDraft.language}
                                onChange={(e) => updateDraftField('language', e.target.value)}
                                className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:border-agrigreen-500 outline-none"
                            >
                                {['English', 'Hindi', 'Kannada', 'Telugu', 'Tamil', 'Marathi', 'Bengali'].map(l => (
                                    <option key={l} value={l}>{l}</option>
                                ))}
                            </select>
                        ) : (
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{profile.language}</p>
                        )}
                    </div>
                </div>

                {/* Mobile Registration Info */}
                {isRegistered && (
                    <div className="bg-agrigreen-500/5 border border-agrigreen-500/20 rounded-xl p-4 flex items-start gap-3">
                        <Smartphone className="w-5 h-5 text-agrigreen-500 mt-0.5 flex-shrink-0" />
                        <div className="text-left">
                            <p className="text-sm font-bold text-agrigreen-600 dark:text-agrigreen-400">
                                Mobile Linked: {profile.mobile}
                            </p>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                Your mobile number is your unique identity. Real-time updates and SMS mock-alerts are sent here. 
                                By adding your Receiver Email, you allow the system to send secure, real-time emails to you when Farm Sensors trigger critical events.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* ═══════════════ SMART ALERT PREFERENCES ═══════════════ */}
            <div className="glass-card p-8 space-y-6">
                <h2 className="text-lg font-bold text-agrigreen-500 flex items-center gap-2">
                    <Bell className="w-5 h-5" /> Smart Alert Preferences
                </h2>
                <p className="text-xs text-slate-500 text-left">Choose which real-time alerts you want to receive on your registered mobile.</p>

                <div className="grid gap-4">
                    <SettingItem icon={Thermometer} title="🌡️ Weather Alerts" subtext="Heavy rain, frost warnings, heatwave alerts"
                        action={<Toggle enabled={alertPrefs.weatherAlerts} onToggle={() => updateAlertPref('weatherAlerts', !alertPrefs.weatherAlerts)} />} />
                    <SettingItem icon={Bug} title="🐛 Pest & Disease Alerts" subtext="AI-detected pest risks, disease confidence scores"
                        action={<Toggle enabled={alertPrefs.pestAlerts} onToggle={() => updateAlertPref('pestAlerts', !alertPrefs.pestAlerts)} />} />
                    <SettingItem icon={Droplets} title="💧 Irrigation Reminders" subtext="Soil moisture drops, scheduled watering alerts"
                        action={<Toggle enabled={alertPrefs.irrigationAlerts} onToggle={() => updateAlertPref('irrigationAlerts', !alertPrefs.irrigationAlerts)} />} />
                    <SettingItem icon={TrendingUp} title="📈 Market Price Alerts" subtext="Price surges, selling window recommendations"
                        action={<Toggle enabled={alertPrefs.marketAlerts} onToggle={() => updateAlertPref('marketAlerts', !alertPrefs.marketAlerts)} />} />
                    <SettingItem icon={Calendar} title="🌾 Harvest Window Alerts" subtext="Optimal harvest dates, equipment reminders"
                        action={<Toggle enabled={alertPrefs.harvestAlerts} onToggle={() => updateAlertPref('harvestAlerts', !alertPrefs.harvestAlerts)} />} />
                    <SettingItem icon={BarChart2} title="📊 Weekly AI Summary" subtext="Digest of crop health, NDVI changes, and recommendations"
                        action={<Toggle enabled={alertPrefs.weeklySummary} onToggle={() => updateAlertPref('weeklySummary', !alertPrefs.weeklySummary)} />} />
                </div>

                {/* Alert Frequency */}
                <div className="border-t border-slate-200 dark:border-slate-700/50 pt-6">
                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 text-left">Alert Delivery Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-700/30 text-left">
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-2">Frequency</p>
                            <select
                                value={alertPrefs.alertFrequency}
                                onChange={(e) => updateAlertPref('alertFrequency', e.target.value)}
                                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:border-agrigreen-500 outline-none"
                            >
                                <option value="realtime">⚡ Real-time (Instant)</option>
                                <option value="daily">📅 Daily Digest</option>
                                <option value="weekly">📊 Weekly Summary</option>
                            </select>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-700/30 text-left">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Quiet Hours</p>
                                <Toggle enabled={alertPrefs.quietHoursEnabled} onToggle={() => updateAlertPref('quietHoursEnabled', !alertPrefs.quietHoursEnabled)} />
                            </div>
                            {alertPrefs.quietHoursEnabled && (
                                <div className="flex items-center gap-2 mt-2">
                                    <input type="time" value={alertPrefs.quietStart} onChange={(e) => updateAlertPref('quietStart', e.target.value)} className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-2 py-1 text-xs text-slate-700 dark:text-slate-200 focus:border-agrigreen-500 outline-none" />
                                    <span className="text-xs text-slate-500">to</span>
                                    <input type="time" value={alertPrefs.quietEnd} onChange={(e) => updateAlertPref('quietEnd', e.target.value)} className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-2 py-1 text-xs text-slate-700 dark:text-slate-200 focus:border-agrigreen-500 outline-none" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══════════════ LIVE SYSTEM STATUS ═══════════════ */}
            {isRegistered && (
                <LiveStatusGrid liveData={liveData} selectedCrop={selectedCrop} cropData={cropData} profile={profile} />
            )}

            {/* ═══════════════ APPEARANCE ═══════════════ */}
            <div className="glass-card p-8 space-y-8">
                <div>
                    <h2 className="text-lg font-bold text-agrigreen-500 mb-4 flex items-center gap-2">
                        <Monitor className="w-5 h-5" /> Appearance
                    </h2>
                    <div className="grid gap-4">
                        <SettingItem
                            icon={theme === 'dark' ? Moon : Sun}
                            title="Interface Theme"
                            subtext={`Currently using ${theme === 'dark' ? 'Dark' : 'Light'} Mode`}
                            action={
                                <button
                                    onClick={toggleTheme}
                                    className="relative w-14 h-7 bg-slate-300 dark:bg-slate-700 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-agrigreen-500/50"
                                >
                                    <div className={`w-5 h-5 bg-agrigreen-500 rounded-full shadow-lg transform transition-transform duration-300 flex items-center justify-center ${theme === 'dark' ? 'translate-x-7' : 'translate-x-0'}`}>
                                        {theme === 'dark' ? <Moon className="w-3 h-3 text-white" /> : <Sun className="w-3 h-3 text-white" />}
                                    </div>
                                </button>
                            }
                        />
                    </div>
                </div>

                {/* AI Config */}
                <div className="border-t border-slate-200 dark:border-slate-700/50 pt-8">
                    <h2 className="text-lg font-bold text-agrigreen-500 mb-4 flex items-center gap-2">
                        <Zap className="w-5 h-5" /> AI Preferences
                    </h2>
                    <div className="grid gap-4">
                        <SettingItem
                            icon={Globe}
                            title="Neural Network Region"
                            subtext="Optimize model responses for specific geographical regions."
                            action={
                                <select
                                    value={region}
                                    onChange={(e) => setRegion(e.target.value)}
                                    className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 focus:border-agrigreen-500 outline-none cursor-pointer"
                                >
                                    {['Global', 'North America', 'Europe', 'Asia', 'India', 'South America'].map(r => (
                                        <option key={r} value={r}>{r}</option>
                                    ))}
                                </select>
                            }
                        />
                        <SettingItem
                            icon={Bell}
                            title="AI Predictive Alerts"
                            subtext="Receive notifications based on high-probability model outputs."
                            action={<Toggle enabled={alertsEnabled} onToggle={() => setAlertsEnabled(!alertsEnabled)} />}
                        />
                    </div>
                </div>

                {/* Security */}
                <div className="border-t border-slate-200 dark:border-slate-700/50 pt-8">
                    <h2 className="text-lg font-bold text-agrigreen-500 mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5" /> Security & Privacy
                    </h2>
                    <div className="grid gap-4">
                        <SettingItem
                            icon={Shield}
                            title="Data Sovereignty"
                            subtext="Control how your farm data is used for model training."
                            action={
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] bg-agrigreen-500/10 text-agrigreen-600 font-bold px-2 py-0.5 rounded uppercase">{dataSovereignty ? 'Encrypted' : 'Standard'}</span>
                                    <Toggle enabled={dataSovereignty} onToggle={() => setDataSovereignty(!dataSovereignty)} />
                                </div>
                            }
                        />
                    </div>
                </div>
            </div>

            <div className="text-center pb-8">
                <p className="text-xs text-slate-500">AgriTwin Version 2.1.0-alpha • Powered by DeepMind Advanced Agentic AI</p>
            </div>
        </div>
    );
};

export default Settings;
