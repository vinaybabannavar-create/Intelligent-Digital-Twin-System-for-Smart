import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle, AlertTriangle, Droplets, Map, Shield, X, Image, Brain, Cpu, Activity, Zap, ThermometerSun, Leaf, Beaker, ShieldAlert, TrendingUp } from 'lucide-react';
import { useCrop } from '../context/CropContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/95 dark:bg-slate-900/95 p-3 rounded-xl border border-agrigreen-500/30 shadow-2xl backdrop-blur-md">
                <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">{label}</p>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-agrigreen-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                    <p className="text-sm font-black text-slate-800 dark:text-white">
                        NDVI: {payload[0].value.toFixed(2)}
                    </p>
                </div>
            </div>
        );
    }
    return null;
};

const CropHealth = () => {
    const { cropData, selectedCrop, liveData } = useCrop();
    const [uploadState, setUploadState] = useState('idle'); // idle | uploading | done
    const [selectedDisease, setSelectedDisease] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [scanLogs, setScanLogs] = useState([]);
    const [irrigationStatus, setIrrigationStatus] = useState('idle'); // idle | scheduling | scheduled
    const [selectedSector, setSelectedSector] = useState(null);
    const fileInputRef = useRef(null);

    const logs = [
        "Initializing EfficientNet-B0 backbone...",
        "Extracting leaf texture features...",
        "Analyzing spectral reflectance patterns...",
        "Matching against 45,000+ disease datasets...",
        "Gen AI finalizing diagnostic report..."
    ];

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setUploadState('uploading');
        setScanLogs([]);

        // Cycle through neural logs
        logs.forEach((log, i) => {
            setTimeout(() => {
                setScanLogs(prev => [...prev, log]);
            }, i * 600);
        });

        // Simulate AI model processing
        setTimeout(() => {
            // Pick a random disease from the list for more dynamic "ML" feel
            const randomDisease = cropData.diseases[Math.floor(Math.random() * cropData.diseases.length)];
            setSelectedDisease(randomDisease);
            setUploadState('done');
        }, 3200);
    };

    const handleScheduleIrrigation = () => {
        setIrrigationStatus('scheduling');
        setTimeout(() => {
            setIrrigationStatus('scheduled');
        }, 2000);
    };

    const resetUpload = () => {
        setUploadState('idle');
        setSelectedDisease(null);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const waterStatus = cropData.waterRequirement;
    const isWaterCritical = waterStatus.status === 'critical';
    const isWaterWarning = waterStatus.status === 'warning';

    return (
        <div className="space-y-5">
            <div className="animate-fadeInUp text-left">
                <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
                    {cropData.emoji} {selectedCrop} — Crop Health Monitor
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 text-left">AI-powered disease detection, vegetation analysis & water monitoring</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Leaf Disease Detection */}
                <div className="glass-card p-6 animate-fadeInUp stagger-1">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4">
                        <UploadCloud className="text-agrigreen-500 w-5 h-5" /> Leaf Disease Scanner
                    </h2>
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                    />

                    {uploadState === 'idle' && (
                        <div
                            className="upload-zone border-slate-300 dark:border-slate-600"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className="flex flex-col items-center">
                                <div className="p-4 bg-slate-100 dark:bg-slate-800/60 rounded-2xl mb-4 text-center">
                                    <Image className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                                </div>
                                <p className="text-slate-600 dark:text-slate-300 font-semibold text-center">Click to upload leaf image</p>
                                <p className="text-xs text-slate-500 mt-2 text-center">Supports JPG, PNG • CNN / MobileNet model</p>
                            </div>
                        </div>
                    )}

                    {uploadState === 'uploading' && (
                        <div className="upload-zone active flex flex-col items-center border-agrigreen-500">
                            <div className="flex gap-6 items-center mb-6 w-full">
                                {previewUrl && <img src={previewUrl} alt="Leaf" className="w-40 h-40 object-cover rounded-2xl shadow-2xl border-2 border-agrigreen-500/50 animate-pulse" />}
                                <div className="space-y-1 text-left flex-1">
                                    <div className="flex items-center gap-2 text-agrigreen-600 dark:text-agrigreen-400 text-[10px] font-black mb-2 uppercase italic tracking-widest">
                                        <Cpu className="w-3.5 h-3.5 animate-spin" /> Neural Scan In Progress
                                    </div>
                                    {scanLogs.map((log, i) => (
                                        <p key={i} className="text-[10px] text-slate-500 dark:text-slate-500 font-mono animate-fadeIn"> &gt; {log}</p>
                                    ))}
                                </div>
                            </div>
                            <div className="w-full max-w-sm bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-gradient-to-r from-agrigreen-500 to-emerald-400 h-1.5 rounded-full transition-all duration-500" style={{ width: `${(scanLogs.length / logs.length) * 100}%` }} />
                            </div>
                        </div>
                    )}

                    {uploadState === 'done' && selectedDisease && (
                        <div className="border-2 border-red-500/30 rounded-2xl p-6 bg-red-900/10">
                            <div className="flex flex-col items-center text-center">
                                <div className="flex gap-6 items-start mb-6 text-left w-full">
                                    {previewUrl && <img src={previewUrl} alt="Leaf" className="w-32 h-32 object-cover rounded-xl border-2 border-red-500/30 shrink-0" />}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Shield className="w-4 h-4 text-red-400" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-red-500">AI Diagnostic Confirmation</span>
                                        </div>
                                        <h3 className="text-2xl font-black text-red-400 mb-1">{selectedDisease.name}</h3>
                                        <div className="flex items-center gap-4 mt-2">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-slate-500 uppercase font-black">Confidence</span>
                                                <span className="text-sm font-black text-slate-800 dark:text-white">{selectedDisease.confidence}%</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-slate-500 uppercase font-black">Severity</span>
                                                <span className={`text-sm font-black ${selectedDisease.severity === 'High' ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'}`}>{selectedDisease.severity}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Enhanced Diagnostic Result */}
                                <div className="w-full space-y-3 mb-6">
                                    <div className="bg-white dark:bg-slate-900/40 p-4 rounded-xl border border-red-500/10 dark:border-white/5 text-left">
                                        <div className="flex items-center gap-2 mb-2">
                                            <AlertTriangle className="w-4 h-4 text-red-500" />
                                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase italic">Primary Cause</span>
                                        </div>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
                                            {selectedDisease.cause}
                                        </p>
                                    </div>

                                    <div className="bg-agrigreen-500/5 dark:bg-agrigreen-900/20 p-4 rounded-xl border border-agrigreen-500/20 text-left">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Zap className="w-4 h-4 text-agrigreen-600 dark:text-agrigreen-400" />
                                            <span className="text-xs font-bold text-agrigreen-700 dark:text-agrigreen-400 uppercase italic">AI Treatment Plan</span>
                                        </div>
                                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                                            {selectedDisease.treatment}
                                        </p>
                                    </div>
                                </div>

                                <button onClick={resetUpload} className="w-full py-3 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2">
                                    <X className="w-4 h-4" /> Scan Another Leaf
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Water Stress Detection */}
                <div className="glass-card p-6 flex flex-col justify-between animate-fadeInUp stagger-2">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4">
                            <Droplets className={`w-5 h-5 ${isWaterCritical ? 'text-red-500' : isWaterWarning ? 'text-yellow-500' : 'text-blue-500'}`} /> Water Stress Monitor
                        </h2>
                        <div className={`p-5 rounded-xl border flex items-start gap-4 text-left ${isWaterCritical ? 'bg-red-500/5 dark:bg-red-500/10 border-red-500/20' : isWaterWarning ? 'bg-yellow-500/5 dark:bg-yellow-500/10 border-yellow-500/20' : 'bg-blue-500/5 dark:bg-blue-500/10 border-blue-500/20'}`}>
                            {(isWaterCritical || isWaterWarning) && (
                                <AlertTriangle className={`w-7 h-7 shrink-0 mt-1 ${isWaterCritical ? 'text-red-500' : 'text-yellow-500'}`} />
                            )}
                            {!isWaterCritical && !isWaterWarning && (
                                <CheckCircle className="w-7 h-7 shrink-0 mt-1 text-blue-500" />
                            )}
                            <div>
                                <h3 className={`font-black mb-1 ${isWaterCritical ? 'text-red-600 dark:text-red-400' : isWaterWarning ? 'text-yellow-600 dark:text-yellow-400' : 'text-blue-600 dark:text-blue-400'}`}>
                                    {isWaterCritical ? 'CRITICAL: Water stress risk!' : isWaterWarning ? 'WARNING: Moderate water stress' : 'Normal: Adequate moisture'}
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{waterStatus.message}</p>
                                <div className="mt-4 grid grid-cols-2 gap-3">
                                    <div className="bg-white dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700/30">
                                        <p className="text-xs text-slate-500 font-bold uppercase">Daily Need</p>
                                        <p className="text-lg font-black text-slate-800 dark:text-slate-100">{waterStatus.daily} {waterStatus.unit}</p>
                                    </div>
                                    <div className="bg-white dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700/30">
                                        <p className="text-xs text-slate-500 font-bold uppercase">Soil Moisture</p>
                                        <p className="text-lg font-black text-slate-800 dark:text-slate-100">{isWaterCritical ? '28%' : isWaterWarning ? '42%' : '65%'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {(isWaterCritical || isWaterWarning) && irrigationStatus === 'idle' && (
                        <button
                            onClick={handleScheduleIrrigation}
                            className={`mt-5 w-full py-3 font-semibold rounded-xl transition-all active:scale-[0.98] shadow-lg ${isWaterCritical ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/30' : 'bg-yellow-600 hover:bg-yellow-500 text-white shadow-yellow-900/30'}`}
                        >
                            🚿 Schedule Irrigation Now
                        </button>
                    )}
                    {irrigationStatus === 'scheduling' && (
                        <button disabled className="mt-5 w-full py-3 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-400 flex items-center justify-center gap-2 opacity-70">
                            <Cpu className="w-4 h-4 animate-spin" /> Analyzing pump pressure...
                        </button>
                    )}
                    {irrigationStatus === 'scheduled' && (
                        <div className="mt-5 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Activity className="w-5 h-5 text-blue-500 animate-pulse" />
                                <div>
                                    <p className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Cycle Confirmed</p>
                                    <p className="text-[10px] text-slate-500">Irrigation starts in 45m</p>
                                </div>
                            </div>
                            <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded-full font-bold">LIVE</span>
                        </div>
                    )}
                </div>

                {/* NDVI Map & Trend Sub-section */}
                <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                    <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4 uppercase tracking-widest">
                        <Map className="w-5 h-5 text-agrigreen-600 dark:text-agrigreen-400" />
                        NDVI Crop Health Map — {selectedCrop}
                    </h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {/* Interactive Map Side */}
                        <div className="h-64 w-full rounded-xl overflow-hidden relative border border-slate-200 dark:border-slate-700/30 shadow-sm">
                            <div className="absolute inset-0 ndvi-gradient opacity-40 dark:opacity-60"></div>
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.1)_0%,transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.3)_0%,transparent_70%)]"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="grid grid-cols-6 gap-3 p-4 opacity-70">
                                    {(cropData.sectors || Array.from({ length: 24 })).map((sector, i) => {
                                        const health = sector.ndvi || Math.random();
                                        const color = health > 0.6 ? 'bg-green-500' : health > 0.3 ? 'bg-yellow-500' : 'bg-red-500';
                                        const isSelected = selectedSector?.id === sector.id;

                                        return (
                                            <div
                                                key={sector.id || i}
                                                onClick={() => setSelectedSector(sector)}
                                                className={`w-6 h-6 rounded-full ${color} cursor-pointer transition-all duration-300 hover:scale-125 hover:opacity-100 ${isSelected ? 'ring-2 ring-white scale-125 opacity-100 shadow-[0_0_15px_rgba(255,255,255,0.5)]' : 'opacity-60 blur-[1px]'}`}
                                            />
                                        );
                                    })}
                                </div>
                            </div>

                            {selectedSector && (
                                <div className="absolute top-3 right-3 bg-white/95 dark:bg-slate-900/95 p-4 rounded-xl border border-agrigreen-500/30 shadow-2xl backdrop-blur-md animate-fadeInRight max-w-[200px] z-20">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-[10px] font-black text-slate-800 dark:text-white uppercase tracking-tighter">{selectedSector.name}</h4>
                                        <button onClick={(e) => { e.stopPropagation(); setSelectedSector(null); }} className="text-slate-400 hover:text-red-500">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-800 p-1.5 rounded-lg">
                                            <span className="text-[9px] text-slate-500 font-bold">NDVI</span>
                                            <span className="text-xs font-black text-agrigreen-600">{selectedSector.ndvi}</span>
                                        </div>
                                        <p className="text-[9px] text-slate-600 dark:text-slate-400 italic leading-tight">
                                            {selectedSector.message}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-agridark/90 p-3 rounded-xl border border-slate-200 dark:border-slate-600 shadow-xl backdrop-blur-md">
                                <h4 className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest font-black mb-2">NDVI Index: {(liveData.healthScore / 100).toFixed(2)}</h4>
                                <div className="space-y-1.5 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                                    <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]"></div> Healthy (NDVI &gt; 0.6)</div>
                                    <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-[0_0_6px_rgba(234,179,8,0.6)]"></div> Moderate (0.3–0.6)</div>
                                    <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.6)]"></div> Poor (&lt; 0.3)</div>
                                </div>
                            </div>
                        </div>

                        {/* Trend Area Chart Side */}
                        <div className="h-64 w-full rounded-xl overflow-hidden bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700/30 p-4 relative shadow-sm flex flex-col">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                    <TrendingUp className="w-3.5 h-3.5 text-agrigreen-500" /> Historical Trend
                                </h4>
                                <div className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-1 rounded font-bold">Past 4 Weeks</div>
                            </div>

                            <div className="flex-1 mt-2">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={cropData.ndviTrend} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorNdvi" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.6} />
                                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                            </linearGradient>
                                            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                                <feGaussianBlur stdDeviation="3" result="blur" />
                                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                            </filter>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" opacity={0.15} />
                                        <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} domain={[0, 1]} dx={-10} />
                                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#22c55e', strokeWidth: 1.5, strokeDasharray: '4 4' }} />
                                        <Area
                                            type="monotone"
                                            dataKey="score"
                                            stroke="#22c55e"
                                            strokeWidth={4}
                                            fillOpacity={1}
                                            fill="url(#colorNdvi)"
                                            filter="url(#glow)"
                                            dot={{ fill: '#22c55e', r: 3, strokeWidth: 0 }}
                                            activeDot={{ r: 5, strokeWidth: 0, fill: '#fff' }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CropHealth;
