import React, { useState, useEffect } from 'react';
import {
    Activity, Sprout, Tractor, DollarSign, Clock, Droplets,
    Thermometer, Wind, CloudRain, Leaf, Wheat, Zap, Brain, Cpu, Sparkles, TestTubes, TrendingUp, Wallet, AlertTriangle, AlertCircle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useCrop } from '../context/CropContext';
import { useAlerts } from '../context/AlertContext';

const AnimatedNumber = ({ value, suffix = '' }) => {
    const [display, setDisplay] = useState(0);
    useEffect(() => {
        const num = parseFloat(value) || 0;
        let startPos = 0;
        const duration = 800;
        const step = num / (duration / 16);
        const timer = setInterval(() => {
            startPos += step;
            if (startPos >= num) {
                setDisplay(num.toFixed(num % 1 === 0 ? 0 : 1));
                clearInterval(timer);
            } else {
                setDisplay(num % 1 === 0 ? Math.round(startPos) : startPos.toFixed(1));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [value]);
    return <span className="animate-countUp">{display}{suffix}</span>;
};

const StatCard = ({ title, value, subtext, icon: Icon, color, glow }) => (
    <div className={`stat-card group ${glow}`} style={{ '--accent-color': color }}>
        <div className="flex items-start justify-between mb-3">
            <div className={`p-2.5 rounded-xl`} style={{ backgroundColor: `${color}15` }}>
                <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <div className="w-8 h-8 rounded-full opacity-10 group-hover:opacity-20 transition-opacity" style={{ backgroundColor: color }} />
        </div>
        <h3 className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">{title}</h3>
        <div className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">{value}</div>
        {subtext && <p className="text-xs text-slate-500 dark:text-slate-500 mt-2 leading-relaxed">{subtext}</p>}
    </div>
);

const GenAIInsights = ({ insights }) => (
    <div className="glass-card p-6 bg-gradient-to-br from-indigo-500/5 to-agrigreen-500/5 dark:from-indigo-900/20 dark:to-agrigreen-900/10 border-agrigreen-500/20 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
            <Sparkles className="w-16 h-16 text-agrigreen-500" />
        </div>
        <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-agrigreen-500/15 rounded-xl">
                <Brain className="w-5 h-5 text-agrigreen-600 dark:text-agrigreen-400" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">Gen AI Analysis</h3>
            <span className="text-[10px] bg-agrigreen-500/20 text-agrigreen-600 dark:text-agrigreen-300 px-2 py-0.5 rounded-full font-mono animate-pulse">{insights.status || 'LIVE AGENT'}</span>
        </div>
        <div className="space-y-4 relative z-10 text-left">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-relaxed italic border-l-2 border-agrigreen-500/40 pl-4">
                "{insights.summary}"
            </p>
            <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-100 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200 dark:border-white/5">
                {insights.genAiReport}
            </div>
            <div className="flex items-center gap-4 text-[11px] text-slate-500 font-mono">
                <div className="flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5" /> {insights.mlModel.name}
                </div>
                <div className="flex items-center gap-1.5 text-agrigreen-600 dark:text-agrigreen-400">
                    <Activity className="w-3.5 h-3.5" /> Accuracy: {insights.mlModel.accuracy}
                </div>
            </div>
        </div>
    </div>
);

const WeatherWidget = ({ weather, liveHumidity, liveWind, liveTemp }) => (
    <div className="glass-card p-5">
        <h3 className="text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
            <CloudRain className="w-4 h-4 text-slate-400" /> Regional Weather
        </h3>
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-left">
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700/30">
                    <Droplets className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                    <div>
                        <p className="text-[10px] text-slate-500 uppercase font-bold">Humidity</p>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{liveHumidity}%</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700/30">
                    <Wind className="w-4 h-4 text-agrigreen-600 dark:text-agrigreen-400" />
                    <div>
                        <p className="text-[10px] text-slate-500 uppercase font-bold">Wind Speed</p>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{liveWind} km/h</p>
                    </div>
                </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {weather.forecast.map((f, i) => (
                    <div key={i} className={`flex-shrink-0 flex flex-col items-center rounded-xl px-3 py-2 min-w-[70px] border transition-colors ${i === 0 ? 'bg-agrigreen-500/10 border-agrigreen-500/30' : 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/30'}`}>
                        <span className="text-[10px] text-slate-500 font-bold uppercase">{f.day}</span>
                        <span className="text-lg my-1">{f.icon}</span>
                        <span className="text-sm font-black text-slate-700 dark:text-slate-200">{i === 0 ? liveTemp.toFixed(1) : f.temp}°</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const PHPanel = ({ soilPH, livePH }) => {
    // Calculate position percentage (0 = pH 0, 100% = pH 14)
    // We'll zoom in on the relevant agricultural range (e.g., pH 4 to 9) for better visual fidelity
    const minPH = 4;
    const maxPH = 9;
    
    // Ensure value is bounded for the visual bar
    const clampedPH = Math.max(minPH, Math.min(maxPH, livePH));
    const positionPercent = ((clampedPH - minPH) / (maxPH - minPH)) * 100;
    
    // Optimal range box calculation
    const optMin = Math.max(minPH, soilPH.optimalRange[0]);
    const optMax = Math.min(maxPH, soilPH.optimalRange[1]);
    const optLeftPercent = ((optMin - minPH) / (maxPH - minPH)) * 100;
    const optWidthPercent = ((optMax - optMin) / (maxPH - minPH)) * 100;

    return (
        <div className="glass-card p-6 border-slate-200/50 dark:border-white/5 relative overflow-hidden group">
            {/* Background decorative blob */}
            <div className={`absolute -right-20 -top-20 w-40 h-40 rounded-full blur-3xl opacity-10 pointer-events-none transition-colors duration-1000 ${
                soilPH.status === 'critical' ? 'bg-red-500' : soilPH.status === 'warning' ? 'bg-yellow-500' : 'bg-agrigreen-500'
            }`} />

            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-xl text-left ${
                        soilPH.status === 'critical' ? 'bg-red-500/15' : soilPH.status === 'warning' ? 'bg-yellow-500/15' : 'bg-emerald-500/15'
                    }`}>
                        <TestTubes className={`w-5 h-5 ${
                            soilPH.status === 'critical' ? 'text-red-500' : soilPH.status === 'warning' ? 'text-yellow-500' : 'text-emerald-500'
                        }`} />
                    </div>
                    <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Soil pH Insights</h3>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-3 py-1 rounded-lg">
                        {soilPH.soilType}
                    </span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${
                        soilPH.status === 'critical' ? 'bg-red-500/20 text-red-600 dark:text-red-400' :
                        soilPH.status === 'warning' ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400' :
                        'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                    }`}>
                        {soilPH.status}
                    </span>
                </div>
            </div>

            {/* Scale Visualizer */}
            <div className="mt-8 mb-6 relative px-4">
                {/* Visual Bar */}
                <div className="h-4 w-full rounded-full bg-gradient-to-r from-red-500 via-emerald-500 to-blue-500 relative shadow-inner overflow-visible">
                    
                    {/* Optimal Range Highlight */}
                    <div className="absolute top-0 bottom-0 border-x-2 border-white/60 bg-white/20 backdrop-blur-sm shadow-[0_0_10px_rgba(255,255,255,0.3)] z-10"
                         style={{ left: `${optLeftPercent}%`, width: `${optWidthPercent}%` }}>
                         <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">
                             OPTIMAL RANGE
                         </div>
                    </div>

                    {/* Current Value Needle */}
                    <div className="absolute top-1/2 -translate-y-1/2 w-4 h-8 bg-white border-2 border-slate-800 rounded-sm shadow-lg z-20 transition-all duration-500 ease-out"
                         style={{ left: `calc(${positionPercent}% - 8px)` }}>
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded shadow-md whitespace-nowrap">
                            <span className="animate-pulse">{livePH.toFixed(2)}</span>
                            {/* Little triangle pointing down */}
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                        </div>
                    </div>
                </div>
                
                {/* Labels */}
                <div className="flex justify-between mt-3 text-[10px] font-mono text-slate-400 font-medium">
                    <span>pH {minPH} (Acidic)</span>
                    <span>Neutral 7</span>
                    <span>pH {maxPH} (Alkaline)</span>
                </div>
            </div>

            {/* Recommendation */}
            <div className="bg-slate-100 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/40 mt-4">
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    <span className="font-bold flex-inline items-center gap-1">AI Recommendation:</span> {soilPH.recommendation}
                </p>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const { cropData, selectedCrop, liveData } = useCrop();
    const { addAlert, silenceAlarm, isSilenced } = useAlerts();
    const [isScheduling, setIsScheduling] = useState(false);
    const [isScheduled, setIsScheduled] = useState(false);

    // Reset interaction state on crop change
    useEffect(() => {
        setIsScheduled(false);
        setIsScheduling(false);
    }, [selectedCrop]);

    const handleScheduleHarvest = () => {
        setIsScheduling(true);
        setTimeout(() => {
            addAlert({
                type: 'success',
                title: '✅ Harvest Scheduled',
                message: `Harvest equipment and labor for ${selectedCrop} have been booked for ${cropData.harvest.optimalDate}.`
            });
            setIsScheduling(false);
            setIsScheduled(true);
        }, 1500);
    };

    return (
        <div className="space-y-6">
            {/* Title */}
            <div className="flex items-center justify-between animate-fadeInUp">
                <div className="text-left">
                    <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
                        {cropData.emoji} {selectedCrop} Farm Overview
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Real-time AI analytics • {cropData.season}</p>
                </div>
                <div className="px-4 py-2 bg-agrigreen-500/10 text-agrigreen-400 text-sm font-mono border border-agrigreen-500/20 rounded-xl flex items-center gap-2 glow-green">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-agrigreen-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-agrigreen-500"></span>
                    </span>
                    {liveData.aiStatus || 'Live Monitoring'}
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                <div className="animate-fadeInUp stagger-1">
                    <StatCard
                        title="Farm Health Score"
                        value={<><AnimatedNumber value={liveData.healthScore} /> <span className="text-base text-slate-500">/ 100</span></>}
                        subtext={`NDVI: ${cropData.ndviScore} • Monitoring 42 parameters`}
                        icon={Activity}
                        color="#22c55e"
                        glow="glow-green"
                    />
                </div>
                <div className="animate-fadeInUp stagger-2">
                    <StatCard
                        title="Growth Stage"
                        value={cropData.currentStage}
                        subtext={`Harvest in ${cropData.daysToHarvest} days`}
                        icon={Sprout}
                        color="#eab308"
                        glow="glow-amber"
                    />
                </div>
                <div className="animate-fadeInUp stagger-3">
                    <StatCard
                        title="Yield Prediction"
                        value={<><AnimatedNumber value={cropData.yieldPerAcre * 3} suffix="" /> <span className="text-sm text-slate-400">tons</span></>}
                        subtext={`${cropData.yieldPerAcre} tons/acre × 3 acres`}
                        icon={Tractor}
                        color="#3b82f6"
                        glow="glow-blue"
                    />
                </div>
                <div className="animate-fadeInUp stagger-4">
                    <StatCard
                        title="Market Price Prediction"
                        value={<>₹<AnimatedNumber value={liveData.currentPrice} />/kg</>}
                        subtext={`Organic live fluctuations (Trend: ${cropData.market.priceChange})`}
                        icon={DollarSign}
                        color="#10b981"
                        glow="glow-green"
                    />
                </div>
                <div className="animate-fadeInUp stagger-5">
                    <StatCard
                        title="Profit Analysis"
                        value={<>
                            <span className="text-agrigreen-600 dark:text-agrigreen-400">₹<AnimatedNumber value={cropData.profit.predicted} /></span>
                            <span className="text-xs text-slate-400 ml-2 font-normal">Predicted</span>
                        </>}
                        subtext={`Past Profit: ${cropData.profit.currency}${cropData.profit.past.toLocaleString()}`}
                        icon={Wallet}
                        color="#8b5cf6"
                        glow="glow-purple"
                    />
                </div>
                <div className="animate-fadeInUp stagger-6">
                    <StatCard
                        title="AI Grain Count Prediction"
                        value={<><AnimatedNumber value={liveData.grainCount} /> <span className="text-sm text-slate-400">{liveData.grainUnit.split('/')[0]}</span></>}
                        subtext={`Projected per ${liveData.grainUnit.split('/')[1] || 'unit'}`}
                        icon={Brain}
                        color="#3b82f6"
                        glow="glow-blue"
                    />
                </div>
            </div>

            {/* Sensor Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 animate-fadeInUp">
                <div className="glass-card p-5 flex items-center gap-4">
                    <div className="p-3 bg-violet-500/15 rounded-xl">
                        <Wheat className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Seed Rate</p>
                        <p className="text-xl font-black text-slate-800 dark:text-slate-100">{cropData.seedRatePerAcre} <span className="text-sm text-slate-400">kg/acre</span></p>
                        <p className="text-[10px] text-slate-400 mt-0.5 italic">(Simulation: Not accurate)</p>
                    </div>
                </div>
                <div className={`glass-card p-5 flex items-center gap-4 transition-all duration-500 ${cropData.waterRequirement.status === 'critical' ? 'border-red-500/50 bg-red-500/5 glow-red animate-pulse' : cropData.waterRequirement.status === 'warning' ? 'border-yellow-500/30 glow-amber' : ''}`}>
                    <div className={`p-3 rounded-xl ${cropData.waterRequirement.status === 'critical' ? 'bg-red-500/20' : cropData.waterRequirement.status === 'warning' ? 'bg-yellow-500/15' : 'bg-blue-500/15'}`}>
                        <Droplets className={`w-5 h-5 ${cropData.waterRequirement.status === 'critical' ? 'text-red-500' : cropData.waterRequirement.status === 'warning' ? 'text-yellow-400' : 'text-blue-400'}`} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Water Need</p>
                        <p className="text-xl font-black text-slate-800 dark:text-slate-100"><AnimatedNumber value={liveData.waterNeed} /> <span className="text-sm text-slate-400">{cropData.waterRequirement.unit}</span></p>
                        <p className={`text-[10px] font-black mt-1 px-2 py-0.5 rounded flex items-center justify-between gap-1 ${cropData.waterRequirement.status === 'critical' ? 'bg-red-500 text-white' : cropData.waterRequirement.status === 'warning' ? 'bg-yellow-500 text-slate-900' : 'text-slate-500'}`}>
                            <span className="flex items-center gap-1">
                                {cropData.waterRequirement.status === 'critical' ? <><AlertTriangle className="w-3 h-3" /> ⚠ CRITICAL ALARM</> : cropData.waterRequirement.status === 'warning' ? '⚡ WARNING' : '✓ Normal'}
                            </span>
                            {cropData.waterRequirement.status === 'critical' && !isSilenced && (
                                <button 
                                    onClick={(e) => { e.stopPropagation(); silenceAlarm(); }}
                                    className="ml-2 px-1.5 py-0.5 bg-white/20 hover:bg-white/40 rounded text-[9px] uppercase font-bold transition-all border border-white/30"
                                >
                                    OFF
                                </button>
                            )}
                        </p>
                    </div>
                </div>
                <div className="glass-card p-5 flex items-center gap-4">
                    <div className="p-3 bg-cyan-500/15 rounded-xl">
                        <Droplets className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Soil Moisture</p>
                        <p className="text-xl font-black text-slate-800 dark:text-slate-100"><AnimatedNumber value={liveData.soilMoisture} /> <span className="text-sm text-slate-400">%</span></p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Live Sensor Feedback</p>
                    </div>
                </div>
                <div className="glass-card p-5 flex items-center gap-4">
                    <div className="p-3 bg-orange-500/15 rounded-xl">
                        <Zap className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Live Temp</p>
                        <p className="text-xl font-black text-slate-800 dark:text-slate-100">{liveData.temperature.toFixed(1)} <span className="text-sm text-slate-400">°C</span></p>
                    </div>
                </div>
                
                {/* New pH Sensor Card */}
                <div className={`glass-card p-5 flex items-center gap-4 ${
                    cropData.soilPH.status === 'critical' ? 'border-red-500/30 glow-red' : 
                    cropData.soilPH.status === 'warning' ? 'border-yellow-500/30 glow-amber' : ''
                }`}>
                    <div className={`p-3 rounded-xl ${
                        cropData.soilPH.status === 'critical' ? 'bg-red-500/15' : 
                        cropData.soilPH.status === 'warning' ? 'bg-yellow-500/15' : 'bg-emerald-500/15'
                    }`}>
                        <TestTubes className={`w-5 h-5 ${
                            cropData.soilPH.status === 'critical' ? 'text-red-400' : 
                            cropData.soilPH.status === 'warning' ? 'text-yellow-400' : 'text-emerald-400'
                        }`} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Live pH</p>
                        <p className="text-xl font-black text-slate-800 dark:text-slate-100">
                            <AnimatedNumber value={liveData.soilPH} /> 
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                            {cropData.soilPH.optimalRange[0]}–{cropData.soilPH.optimalRange[1]} ideal
                        </p>
                    </div>
                </div>
            </div>

            {/* Chart + Harvest */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 glass-card p-6 animate-fadeInUp">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Price Trend Forecast</h3>
                        <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-3 py-1 rounded-lg">{selectedCrop}</span>
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={cropData.market.demandTrend}>
                                <defs>
                                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={cropData.color} stopOpacity={0.3} />
                                        <stop offset="95%" stopColor={cropData.color} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-slate-800" vertical={false} opacity={0.1} />
                                <XAxis dataKey="month" stroke="currentColor" className="text-slate-400 dark:text-slate-600" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="currentColor" className="text-slate-400 dark:text-slate-600" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                        backdropFilter: 'blur(12px)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '16px',
                                        boxShadow: '0 10px 30px -5px rgba(0,0,0,0.1)',
                                        padding: '12px',
                                    }}
                                    itemStyle={{ color: cropData.color, fontWeight: '800' }}
                                    cursor={{ stroke: cropData.color, strokeOpacity: 0.2, strokeWidth: 2 }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="price"
                                    stroke={cropData.color}
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorPrice)"
                                    dot={{ fill: cropData.color, r: 4, strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 6, strokeWidth: 0, fill: cropData.color }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Harvest Advisor Mini */}
                <div className="glass-card p-6 flex flex-col justify-between animate-fadeInUp">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-indigo-500/15 rounded-xl text-left"><Clock className="w-5 h-5 text-indigo-500 dark:text-indigo-400" /></div>
                            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Harvest Advisor</h3>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-5 leading-relaxed text-left">
                            Based on maturity, demand, and price predictions:
                        </p>
                        <div className="space-y-3 text-left">
                            <div className="bg-slate-100 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/40">
                                <p className="text-xs text-slate-500 mb-1 font-bold uppercase">Harvest Date</p>
                                <p className="text-xl font-black text-slate-800 dark:text-slate-100">{cropData.harvest.optimalDate}</p>
                            </div>
                            <div className="bg-agrigreen-500/5 dark:bg-slate-800/60 p-4 rounded-xl border border-agrigreen-500/20">
                                <p className="text-xs text-agrigreen-600 dark:text-agrigreen-400 mb-1 font-bold uppercase">Best Selling Window</p>
                                <p className="text-xl font-black text-agrigreen-600 dark:text-agrigreen-400">{cropData.harvest.sellingWindow}</p>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleScheduleHarvest}
                        disabled={isScheduled || isScheduling}
                        className={`mt-5 w-full py-3 font-semibold rounded-xl transition-all shadow-lg active:scale-[0.98] ${isScheduled
                            ? 'bg-slate-700 text-slate-400 cursor-not-allowed border border-slate-600'
                            : 'bg-gradient-to-r from-agrigreen-600 to-agrigreen-500 hover:from-agrigreen-500 hover:to-agrigreen-400 text-white shadow-agrigreen-900/30'
                            } ${isScheduling ? 'animate-pulse opacity-70' : ''}`}
                    >
                        {isScheduling ? 'Scheduling...' : isScheduled ? '✓ Harvest Scheduled' : 'Schedule Harvest'}
                    </button>
                </div>
            </div>

            {/* AI Insights + Weather Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-fadeInUp">
                <GenAIInsights insights={{ ...cropData.aiInsights, status: liveData.aiStatus }} />
                <WeatherWidget weather={cropData.weather} liveHumidity={liveData.humidity} liveWind={liveData.windSpeed} liveTemp={liveData.temperature} />
            </div>

            {/* pH Detailed Panel Row */}
            <div className="animate-fadeInUp pt-2">
                <PHPanel soilPH={cropData.soilPH} livePH={liveData.soilPH} />
            </div>
        </div>
    );
};

export default Dashboard;
