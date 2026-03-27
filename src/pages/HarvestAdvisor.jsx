import { Calendar, TrendingUp, Star, Leaf, Clock, DollarSign, CheckCircle, Wheat, Droplets, Thermometer, CheckCircle2, X, RefreshCcw, Cpu, Save, Edit3 } from 'lucide-react';
import { useCrop } from '../context/CropContext';
import { useState, useEffect } from 'react';

const HarvestAdvisor = () => {
    const { cropData, selectedCrop, liveData } = useCrop();
    const harvest = cropData.harvest;
    const market = cropData.market;

    const [schedulingStatus, setSchedulingStatus] = useState('idle'); // idle | processing | scheduled
    const [isCustomizing, setIsCustomizing] = useState(false);
    const [isCustomSaved, setIsCustomSaved] = useState(false);
    const [customPrice, setCustomPrice] = useState(harvest.expectedPrice);
    const [customDate, setCustomDate] = useState(harvest.optimalDate);

    // Sync state when crop changes
    useEffect(() => {
        setCustomPrice(harvest.expectedPrice);
        setCustomDate(harvest.optimalDate);
        setSchedulingStatus('idle');
        setIsCustomizing(false);
        setIsCustomSaved(false);
    }, [selectedCrop, harvest.expectedPrice, harvest.optimalDate]);

    const handleSchedule = () => {
        setSchedulingStatus('processing');
        setTimeout(() => setSchedulingStatus('scheduled'), 2000);
    };

    const handleSaveCustom = () => {
        setIsCustomizing(false);
        setIsCustomSaved(true);
    };

    const resetPlan = () => {
        setCustomPrice(harvest.expectedPrice);
        setCustomDate(harvest.optimalDate);
        setIsCustomizing(false);
        setIsCustomSaved(false);
        setSchedulingStatus('idle');
    };

    const displayDate = isCustomizing || isCustomSaved ? customDate : harvest.optimalDate;
    const displayPrice = isCustomizing || isCustomSaved ? customPrice : harvest.expectedPrice;

    const factors = [
        { label: 'Crop Maturity', value: `${harvest.maturity}%`, icon: Leaf, color: 'text-agrigreen-600 dark:text-agrigreen-400', bg: 'bg-agrigreen-500/10 dark:bg-agrigreen-500/15' },
        { label: 'Market Demand', value: market.monthlyDemand[market.monthlyDemand.length - 1]?.level || 'High', icon: TrendingUp, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-500/10 dark:bg-indigo-500/15' },
        { label: 'Expected Price', value: `₹${liveData.currentPrice.toFixed(2)}/kg`, icon: DollarSign, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10 dark:bg-emerald-500/15' },
        { label: 'Seed Rate', value: `${cropData.seedRatePerAcre} kg/ac`, icon: Wheat, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-500/10 dark:bg-violet-500/15' },
        { label: 'Water Need', value: `${cropData.waterRequirement.daily} mm/day`, icon: Droplets, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/10 dark:bg-blue-500/15' },
        { label: 'Temperature', value: `${liveData.temperature.toFixed(1)}°C`, icon: Thermometer, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-500/10 dark:bg-orange-500/15' },
    ];

    return (
        <div className="space-y-5">
            <div className="animate-fadeInUp text-left">
                <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
                    {cropData.emoji} {selectedCrop} — Smart Harvest Timing Advisor
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">AI synthesizes maturity, demand & price to find the optimal window</p>
            </div>

            {/* Factors Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 animate-fadeInUp">
                {factors.map((f, idx) => (
                    <div key={f.label} className="glass-card p-4 text-center" style={{ animationDelay: `${idx * 0.05}s` }}>
                        <div className={`p-2.5 rounded-xl ${f.bg} inline-block mb-2`}>
                            <f.icon className={`w-5 h-5 ${f.color}`} />
                        </div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">{f.label}</p>
                        <p className={`text-lg font-black ${f.color} mt-1`}>{f.value}</p>
                    </div>
                ))}
            </div>

            {/* Main Recommendation */}
            <div className="glass-card p-7 relative overflow-hidden border-agrigreen-500/30 border animate-fadeInUp">
                <div className="absolute inset-0 bg-gradient-to-br from-agrigreen-500/5 dark:from-agrigreen-900/15 to-transparent pointer-events-none" />
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-agrigreen-500 to-transparent opacity-60" />

                <div className="relative z-10 text-left">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-agrigreen-500/10 dark:bg-agrigreen-500/15 rounded-2xl glow-green">
                            <Star className="w-6 h-6 text-agrigreen-600 dark:text-agrigreen-400 fill-agrigreen-600 dark:fill-agrigreen-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">AI Recommended Harvest Plan</h2>
                            <p className="text-xs text-slate-500">Combined analysis of {selectedCrop} data</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className={`transition-all duration-300 ${isCustomizing || isCustomSaved ? 'ring-2 ring-indigo-500 bg-indigo-500/5' : 'bg-slate-100 dark:bg-slate-800/50'} p-5 rounded-2xl border border-slate-200 dark:border-slate-700/40`}>
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-slate-500" />
                                    <span className="text-xs text-slate-500 uppercase tracking-widest font-black">Harvest Date</span>
                                </div>
                                {(isCustomizing || isCustomSaved) && <span className="text-[10px] bg-indigo-500 text-white px-1.5 py-0.5 rounded font-bold">MANUAL</span>}
                            </div>
                            {isCustomizing ? (
                                <input
                                    type="text"
                                    value={customDate}
                                    onChange={(e) => setCustomDate(e.target.value)}
                                    className="w-full bg-transparent text-3xl font-black text-indigo-600 outline-none border-b border-indigo-500/50 border-dashed"
                                    autoFocus
                                />
                            ) : (
                                <p className={`text-3xl font-black ${isCustomSaved ? 'text-indigo-600' : 'text-slate-800 dark:text-slate-100'}`}>{displayDate}</p>
                            )}
                        </div>

                        <div className="bg-agrigreen-50/50 dark:bg-slate-800/50 p-5 rounded-2xl border border-agrigreen-500/20 glow-green hover:border-agrigreen-500/40 transition-colors">
                            <div className="flex items-center gap-2 mb-3">
                                <Clock className="w-4 h-4 text-agrigreen-600 dark:text-agrigreen-400" />
                                <span className="text-xs text-agrigreen-600 dark:text-agrigreen-400 uppercase tracking-widest font-black">Best Selling Window</span>
                            </div>
                            <p className="text-3xl font-black text-agrigreen-600 dark:text-agrigreen-400">{harvest.sellingWindow}</p>
                        </div>

                        <div className={`transition-all duration-300 ${isCustomizing || isCustomSaved ? 'ring-2 ring-emerald-500 bg-emerald-500/5' : 'bg-emerald-500/5 dark:bg-emerald-900/30'} p-5 rounded-2xl border border-emerald-500/20`}>
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                    <span className="text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-widest font-black">Expected Price</span>
                                </div>
                                {(isCustomizing || isCustomSaved) && <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded font-bold">TARGET</span>}
                            </div>
                            {isCustomizing ? (
                                <div className="flex items-baseline gap-1 border-b border-emerald-500/50 border-dashed">
                                    <span className="text-xl font-black text-emerald-600 uppercase">₹</span>
                                    <input
                                        type="number"
                                        value={customPrice}
                                        onChange={(e) => setCustomPrice(Number(e.target.value))}
                                        className="w-full bg-transparent text-3xl font-black text-emerald-600 outline-none"
                                    />
                                    <span className="text-sm font-bold text-emerald-600">/kg</span>
                                </div>
                            ) : (
                                <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400">₹{liveData.currentPrice.toFixed(2)}/kg</p>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-agrigreen-500/5 dark:bg-agrigreen-900/20 rounded-xl border border-agrigreen-500/15 flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-agrigreen-600 dark:text-agrigreen-400 shrink-0 mt-0.5" />
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                            <span className="font-black text-agrigreen-700 dark:text-agrigreen-400 not-italic">AI Recommendation:</span> {harvest.recommendation}
                        </p>
                    </div>

                    {/* Revenue estimate */}
                    <div className="mt-5 p-4 bg-slate-100 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700/30">
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-3">Income Projection (3 acres)</p>
                        <div className="flex items-center justify-between">
                            <div className="text-left">
                                <p className="text-xs text-slate-500 font-medium">If sold at current price</p>
                                <p className="text-lg font-black text-slate-700 dark:text-slate-300">₹{(cropData.yieldPerAcre * 3 * liveData.currentPrice * 1000).toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                                <p className={`text-xs ${isCustomizing || isCustomSaved ? 'text-indigo-600 animate-pulse' : 'text-emerald-600 dark:text-emerald-400'} font-medium`}>
                                    {isCustomizing || isCustomSaved ? 'Forecasted Manual Revenue' : 'If sold during best window'}
                                </p>
                                <p className={`text-lg font-black ${isCustomizing || isCustomSaved ? 'text-indigo-600' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                    ₹{(cropData.yieldPerAcre * 3 * displayPrice * 1000).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 flex gap-4">
                        {isCustomizing ? (
                            <>
                                <button
                                    onClick={handleSaveCustom}
                                    className="grow-[2] py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl transition-all shadow-lg shadow-indigo-900/30 active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    <Save className="w-5 h-5" /> Save Custom Plan
                                </button>
                                <button
                                    onClick={resetPlan}
                                    className="grow py-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-black rounded-xl transition-all border border-slate-300 dark:border-slate-700 active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    <X className="w-4 h-4" /> Cancel
                                </button>
                            </>
                        ) : (
                            <>
                                {schedulingStatus === 'idle' ? (
                                    <button
                                        onClick={handleSchedule}
                                        className="grow-[2] py-3.5 bg-gradient-to-r from-agrigreen-600 to-agrigreen-500 hover:from-agrigreen-500 hover:to-agrigreen-400 text-white font-black rounded-xl transition-all shadow-lg shadow-agrigreen-900/30 active:scale-[0.98]"
                                    >
                                        ✅ {isCustomSaved ? 'Schedule Custom Plan' : 'Accept AI Plan & Schedule'}
                                    </button>
                                ) : schedulingStatus === 'processing' ? (
                                    <button disabled className="grow-[2] py-3.5 bg-slate-200 dark:bg-slate-800 text-slate-400 font-black rounded-xl flex items-center justify-center gap-3">
                                        <Cpu className="w-5 h-5 animate-spin" /> Finalizing Schedule...
                                    </button>
                                ) : (
                                    <div className="grow-[2] py-3.5 bg-blue-600 text-white font-black rounded-xl flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(37,99,235,0.4)] animate-pulse">
                                        <CheckCircle2 className="w-5 h-5" /> Harvest Scheduled: {displayDate}
                                    </div>
                                )}

                                {isCustomSaved ? (
                                    <button
                                        onClick={resetPlan}
                                        className="grow py-3.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 font-black rounded-xl transition-all border border-red-500/30 active:scale-[0.98] flex items-center justify-center gap-2"
                                    >
                                        <RefreshCcw className="w-4 h-4" /> Revert to AI
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => { setIsCustomizing(true); setSchedulingStatus('idle'); }}
                                        className="grow py-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-black rounded-xl transition-all border border-slate-300 dark:border-slate-700 active:scale-[0.98] flex items-center justify-center gap-2"
                                    >
                                        <Edit3 className="w-4 h-4" /> Customize Plan
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HarvestAdvisor;
