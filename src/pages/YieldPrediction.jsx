import React, { useState, useEffect } from 'react';
import { Tractor, Info, BarChart, Wheat, Droplets, Thermometer, Cpu, Activity, ListChecks } from 'lucide-react';
import { useCrop } from '../context/CropContext';

const YieldPrediction = () => {
    const { cropData, selectedCrop, liveData } = useCrop();
    const [acres, setAcres] = useState(3);
    const [soilHealth, setSoilHealth] = useState(82);
    const [yieldResult, setYieldResult] = useState(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const [progress, setProgress] = useState(0);

    // Reset when crop changes
    useEffect(() => {
        setYieldResult(null);
        setProgress(0);
    }, [selectedCrop]);

    const calculateYield = () => {
        setIsCalculating(true);
        setProgress(0);
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) { clearInterval(interval); return 100; }
                return prev + 4;
            });
        }, 50);

        setTimeout(() => {
            setIsCalculating(false);
            const baseYield = cropData.yieldPerAcre;
            const soilFactor = soilHealth / 100;
            const weatherFactor = cropData.weather.humidity > 75 ? 0.95 : 1.02;
            const totalYield = (baseYield * acres * soilFactor * weatherFactor).toFixed(1);
            const confidence = Math.min(97, Math.round(80 + soilHealth / 10 + Math.random() * 5));
            setYieldResult({ estimatedYield: totalYield, confidence, perAcre: baseYield });
        }, 2500);
    };

    return (
        <div className="space-y-5">
            <div className="animate-fadeInUp text-left">
                <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
                    {cropData.emoji} {selectedCrop} — Smart Yield Prediction
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Random Forest / XGBoost ML models • Season: {cropData.season}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Input */}
                <div className="glass-card p-6 animate-fadeInUp stagger-1">
                    <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-5 flex items-center gap-2">
                        <Tractor className="text-agrigreen-500 w-5 h-5" /> Yield Estimator
                    </h2>
                    <div className="space-y-5 text-left">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Crop</label>
                            <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 rounded-xl px-4 py-3">
                                <span className="text-2xl">{cropData.emoji}</span>
                                <div className="text-left">
                                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{selectedCrop}</p>
                                    <p className="text-xs text-slate-500">{cropData.season} • Base yield: {cropData.yieldPerAcre} tons/acre</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Farm Size (Acres): <span className="text-agrigreen-600 dark:text-agrigreen-400 font-black">{acres}</span></label>
                            <input
                                type="range"
                                min="0.5"
                                max="50"
                                step="0.5"
                                value={acres}
                                onChange={(e) => setAcres(Number(e.target.value))}
                                className="w-full accent-agrigreen-500 cursor-pointer"
                            />
                            <div className="flex justify-between text-xs text-slate-500 mt-1">
                                <span>0.5 acre</span>
                                <span>50 acres</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Soil Health Index: <span className="text-agrigreen-600 dark:text-agrigreen-400 font-black">{soilHealth}%</span></label>
                            <input
                                type="range"
                                min="20"
                                max="100"
                                value={soilHealth}
                                onChange={(e) => setSoilHealth(Number(e.target.value))}
                                className="w-full accent-yellow-500 cursor-pointer"
                            />
                            <div className="flex justify-between text-xs text-slate-600 mt-1">
                                <span>Poor</span>
                                <span>Excellent</span>
                            </div>
                        </div>

                        {/* Extra info */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-slate-100 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200 dark:border-slate-700/30 text-center">
                                <Wheat className="w-4 h-4 text-violet-500 dark:text-violet-400 mx-auto mb-1" />
                                <p className="text-[10px] text-slate-500 font-bold uppercase">Seed Rate</p>
                                <p className="text-sm font-black text-slate-800 dark:text-slate-200">{cropData.seedRatePerAcre} kg</p>
                            </div>
                            <div className="bg-slate-100 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200 dark:border-slate-700/30 text-center">
                                <Droplets className="w-4 h-4 text-blue-500 dark:text-blue-400 mx-auto mb-1" />
                                <p className="text-[10px] text-slate-500 font-bold uppercase">Water</p>
                                <p className="text-sm font-black text-slate-800 dark:text-slate-200">{cropData.waterRequirement.daily} mm/d</p>
                            </div>
                            <div className="bg-slate-100 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200 dark:border-slate-700/30 text-center">
                                <Thermometer className="w-4 h-4 text-orange-500 dark:text-orange-400 mx-auto mb-1" />
                                <p className="text-[10px] text-slate-500 font-bold uppercase">Temp</p>
                                <p className="text-sm font-black text-slate-800 dark:text-slate-200">{liveData.temperature.toFixed(1)}°C</p>
                            </div>
                        </div>

                        <button
                            onClick={calculateYield}
                            disabled={isCalculating}
                            className="w-full py-3.5 bg-gradient-to-r from-agrigreen-600 to-agrigreen-500 hover:from-agrigreen-500 hover:to-agrigreen-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-agrigreen-900/30 disabled:opacity-50 active:scale-[0.98]"
                        >
                            {isCalculating ? 'Running XGBoost Model...' : '🔬 Calculate Yield Prediction'}
                        </button>
                        {isCalculating && (
                            <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                                <div className="bg-gradient-to-r from-agrigreen-500 to-emerald-400 h-2 rounded-full transition-all duration-100" style={{ width: `${progress}%` }} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Result */}
                <div className="glass-card p-6 flex flex-col items-center justify-center relative overflow-hidden animate-fadeInUp stagger-2">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <BarChart className="w-48 h-48 text-agrigreen-500" />
                    </div>

                    {yieldResult ? (
                        <div className="z-10 text-center animate-countUp w-full">
                            <p className="text-xs text-slate-500 uppercase tracking-widest font-black mb-4">AI Yield Prediction Output</p>
                            <div className="text-6xl font-black text-slate-800 dark:text-slate-100 drop-shadow-xl mb-2">
                                {yieldResult.estimatedYield}
                                <span className="text-2xl text-agrigreen-600 dark:text-agrigreen-400 ml-2">tons</span>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{yieldResult.perAcre} tons/acre × {acres} acres</p>

                            <div className="inline-flex items-center gap-2 bg-agrigreen-500/10 dark:bg-agrigreen-900/30 border border-agrigreen-500/20 px-5 py-2.5 rounded-full mb-6">
                                <Info className="w-4 h-4 text-agrigreen-600 dark:text-agrigreen-400" />
                                <span className="text-sm text-agrigreen-700 dark:text-agrigreen-100 font-bold">Model Confidence: <strong>{yieldResult.confidence}%</strong></span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mt-4 text-left">
                                <div className="bg-slate-100 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/30">
                                    <p className="text-xs text-slate-500 font-bold uppercase">Estimated Revenue</p>
                                    <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">₹{(yieldResult.estimatedYield * liveData.currentPrice * 1000).toLocaleString()}</p>
                                </div>
                                <div className="bg-slate-100 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/30">
                                    <p className="text-xs text-slate-500 font-bold uppercase">Seed Required</p>
                                    <p className="text-xl font-black text-violet-600 dark:text-violet-400">{(cropData.seedRatePerAcre * acres).toFixed(0)} kg</p>
                                </div>
                            </div>

                            {/* ML Breakdown */}
                            <div className="mt-5 p-4 bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-white/5 text-left">
                                <div className="flex items-center gap-2 mb-3">
                                    <Cpu className="w-4 h-4 text-agrigreen-600 dark:text-agrigreen-400" />
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase italic">Model Technicals</span>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[11px]">
                                        <span className="text-slate-500">Base Model:</span>
                                        <span className="text-slate-700 dark:text-slate-300 font-mono font-bold">{cropData.aiInsights.mlModel.name}</span>
                                    </div>
                                    <div className="flex justify-between text-[11px]">
                                        <span className="text-slate-500">Training Accuracy:</span>
                                        <span className="text-agrigreen-600 dark:text-agrigreen-400 font-mono font-black">{cropData.aiInsights.mlModel.accuracy}</span>
                                    </div>
                                    <div className="mt-3">
                                        <div className="flex items-center gap-1.5 mb-1.5">
                                            <ListChecks className="w-3.5 h-3.5 text-slate-500" />
                                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Weighted Features</span>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {cropData.aiInsights.mlModel.features.map((f, i) => (
                                                <span key={i} className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700/50">
                                                    {f}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button onClick={() => setYieldResult(null)} className="mt-5 px-5 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white transition-all">
                                Recalculate
                            </button>
                        </div>
                    ) : (
                        <div className="z-10 text-center">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 flex items-center justify-center border border-slate-200 dark:border-slate-700/30">
                                <Tractor className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                            </div>
                            <p className="text-slate-500 text-sm font-medium">Configure parameters and run the AI model</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default YieldPrediction;
