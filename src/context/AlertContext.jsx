import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AlertTriangle, TrendingUp, Clock, Droplets, X, Bug, MessageSquare, Volume2 } from 'lucide-react';
import { useCrop } from './CropContext';

const AlertContext = createContext(null);

const iconMap = {
    warning: AlertTriangle,
    water: Droplets,
    price: TrendingUp,
    harvest: Clock,
    pest: Bug,
    sms: MessageSquare,
};

const colorMap = {
    warning: { border: 'border-yellow-500/50', bg: 'bg-yellow-900/30', text: 'text-yellow-400' },
    water: { border: 'border-blue-500/50', bg: 'bg-blue-900/30', text: 'text-blue-400' },
    price: { border: 'border-emerald-500/50', bg: 'bg-emerald-900/30', text: 'text-emerald-400' },
    harvest: { border: 'border-orange-500/50', bg: 'bg-orange-900/30', text: 'text-orange-400' },
    pest: { border: 'border-red-500/50', bg: 'bg-red-900/30', text: 'text-red-400' },
    sms: { border: 'border-agrigreen-500/50', bg: 'bg-agrigreen-900/30', text: 'text-agrigreen-400' },
};

export const AlertProvider = ({ children }) => {
    // Ephemeral popups
    const [alerts, setAlerts] = useState([]);

    // Persistent history per crop
    const [notificationHistory, setNotificationHistory] = useState({});

    // Use a ref to track which crops have already fired their initial mock alerts
    const firedCropsRef = React.useRef(new Set());
    const situationalAlertsRef = React.useRef(new Set());
    const [silencedCrops, setSilencedCrops] = useState(new Set());

    const { cropData, selectedCrop, liveData } = useCrop();
    const alarmRef = React.useRef(null);
    const smsFiredRef = React.useRef(new Set());
    const lastSentEmailCropRef = React.useRef(null);
    
    const silenceAlarm = useCallback((cropName) => {
        setSilencedCrops(prev => new Set([...prev, cropName || selectedCrop]));
    }, [selectedCrop]);

    const removeAlert = useCallback((id) => {
        setAlerts(prev => prev.filter(a => a.id !== id));
    }, []);

    const addAlert = useCallback((alert) => {
        const id = Date.now() + Math.random();
        const newAlert = { ...alert, id, timestamp: new Date().toISOString(), read: false };

        setAlerts(prev => {
            const isDuplicate = prev.some(a => a.title === alert.title && a.message === alert.message);
            if (isDuplicate) return prev;

            const limited = [...prev, newAlert];
            if (limited.length > 4) return limited.slice(1);
            return limited;
        });

        // Restore ephemeral cleanup
        setTimeout(() => removeAlert(id), 10000);

        // Add to persistent history
        setNotificationHistory(prev => {
            const currentHistory = prev[selectedCrop] || [];
            const isPersistentDuplicate = currentHistory.some(a =>
                a.title === alert.title &&
                a.message === alert.message &&
                (new Date() - new Date(a.timestamp)) < 300000
            );
            if (isPersistentDuplicate) return prev;

            return {
                ...prev,
                [selectedCrop]: [newAlert, ...currentHistory]
            };
        });
    }, [removeAlert, selectedCrop]);

    // Mark current crop's notifications as read
    const markAllRead = useCallback(() => {
        setNotificationHistory(prev => {
            const currentHistory = prev[selectedCrop] || [];
            const updatedHistory = currentHistory.map(a => ({ ...a, read: true }));
            return { ...prev, [selectedCrop]: updatedHistory };
        });
    }, [selectedCrop]);

    // Situational Intelligence: Trigger alerts based on live sensor data
    useEffect(() => {
        if (!liveData) return;

        // 1. Frost Risk Detection (Situational)
        if (liveData.temperature < 32.5) { // Use a threshold that actually happens in our simulation
            const key = `${selectedCrop}-frost`;
            if (!situationalAlertsRef.current.has(key)) {
                addAlert({
                    type: 'warning',
                    title: '❄️ Frost Warning',
                    message: `Night temperature forecast is ${liveData.temperature}°C. Protect sensitive ${selectedCrop} yield.`
                });
                situationalAlertsRef.current.add(key);
            }
        }

        // 2. High Humidity / Disease Risk
        if (liveData.humidity > 82) {
            const key = `${selectedCrop}-humidity`;
            if (!situationalAlertsRef.current.has(key)) {
                addAlert({
                    type: 'pest',
                    title: '🦟 Disease Pre-Warning',
                    message: `High humidity detected (${liveData.humidity}%). Pathogen risk is elevated.`
                });
                situationalAlertsRef.current.add(key);
            }
        }
    }, [liveData.temperature, liveData.humidity, selectedCrop, addAlert]);

    // Push crop-specific alerts on FIRST load of that crop
    useEffect(() => {
        if (!cropData?.alerts || !selectedCrop) return;

        if (firedCropsRef.current.has(selectedCrop)) return;

        // Firing alerts for the first time for this crop in this session
        firedCropsRef.current.add(selectedCrop);

        const timers = cropData.alerts.map((alert, i) =>
            setTimeout(() => addAlert(alert), (i + 1) * 2000)
        );

        return () => {
            timers.forEach(t => clearTimeout(t));
        };
    }, [cropData, selectedCrop, addAlert]);
    
    // 3. Water Critical Alarm Sound
    useEffect(() => {
        if (!cropData || !selectedCrop) return;
        
        const isCritical = cropData.waterRequirement?.status === 'critical';
        const isSilenced = silencedCrops.has(selectedCrop);
        
        if (isCritical && !isSilenced) {
            if (!alarmRef.current) {
                const playAlarm = () => {
                    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
                    audio.volume = 0.5;
                    audio.play().catch(e => console.log("Audio play blocked by browser", e));
                    alarmRef.current = audio;
                };
                
                playAlarm();
                const interval = setInterval(playAlarm, 5000);
                return () => {
                    clearInterval(interval);
                    if (alarmRef.current) {
                        alarmRef.current.pause();
                        alarmRef.current = null;
                    }
                };
            }
        }
    }, [cropData?.waterRequirement?.status, selectedCrop, silencedCrops]);

    // 4. Email Notification — fires every time selectedCrop changes
    useEffect(() => {
        if (!cropData || !selectedCrop) return;
        
        const isCritical = cropData.waterRequirement?.status === 'critical';
        const isSilenced = silencedCrops.has(selectedCrop);
        
        if (!isCritical || isSilenced) return;

        const profile = JSON.parse(localStorage.getItem('agritwin_farmer_profile') || '{}');
        const mobile = profile.mobile || 'Registered Mobile';
        const receiverEmail = profile.email || '';
        
        if (!receiverEmail) {
            addAlert({
                type: 'warning',
                title: 'Email Alert Skipped',
                message: 'No receiver email configured in your profile.',
                duration: 5000
            });
            return;
        }

        addAlert({
            type: 'warning',
            title: 'Sending Email Alert...',
            message: `Sending critical alert for ${selectedCrop} to ${receiverEmail}...`,
            duration: 3000
        });

        fetch('http://localhost:8000/api/send-alert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                crop_name: selectedCrop,
                water_need: liveData?.waterNeed || cropData?.waterRequirement?.daily || 8.0,
                mobile_number: mobile,
                receiver_email: receiverEmail
            })
        })
        .then(res => {
            if (!res.ok) throw new Error('Failed to send email');
            return res.json();
        })
        .then(data => {
            addAlert({
                type: 'sms',
                title: '📧 Email Alert Sent',
                message: `Critical alert for ${selectedCrop} sent to ${receiverEmail}.`,
                duration: 8000
            });
        })
        .catch(err => {
            console.error('Email API Error:', err);
            addAlert({
                type: 'pest',
                title: '❌ Email Failed',
                message: 'Could not send email alert. Check backend configuration.',
                duration: 5000
            });
        });
    }, [selectedCrop]);

    const unreadCount = (notificationHistory[selectedCrop] || []).filter(a => !a.read).length;

    return (
        <AlertContext.Provider value={{
            alerts,
            notificationHistory: notificationHistory[selectedCrop] || [],
            unreadCount,
            removeAlert,
            addAlert,
            markAllRead,
            silenceAlarm,
            isSilenced: silencedCrops.has(selectedCrop)
        }}>
            {children}
            <AlertPanel />
        </AlertContext.Provider>
    );
};

export const useAlerts = () => {
    const ctx = useContext(AlertContext);
    if (!ctx) throw new Error('useAlerts must be used within AlertProvider');
    return ctx;
};

const AlertPanel = () => {
    const { alerts, removeAlert } = useContext(AlertContext);
    if (!alerts.length) return null;

    return (
        <div className="fixed top-20 right-4 z-50 flex flex-col gap-3 pointer-events-none" style={{ maxWidth: '400px' }}>
            {alerts.map((alert) => {
                const Icon = iconMap[alert.type] || AlertTriangle;
                const colors = colorMap[alert.type] || colorMap.warning;
                return (
                    <div
                        key={alert.id}
                        className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl animate-slideInRight ${colors.border} ${colors.bg}`}
                    >
                        <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${colors.text}`} />
                        <div className="flex-1 min-w-0">
                            <p className={`text-sm font-bold ${colors.text}`}>{alert.title}</p>
                            <p className="text-xs text-slate-300 mt-1 leading-relaxed">{alert.message}</p>
                        </div>
                        <button onClick={() => removeAlert(alert.id)} className="shrink-0 text-slate-500 hover:text-white transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

export default AlertContext;
