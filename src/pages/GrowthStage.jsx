import React from 'react';
import { Sprout, CheckCircle, Circle, Clock } from 'lucide-react';
import { useCrop } from '../context/CropContext';

const GrowthStage = () => {
    const { cropData, selectedCrop, liveData } = useCrop();
    const stages = cropData.stages;
    const completedCount = stages.filter(s => s.status === 'completed').length;
    const progress = ((completedCount + 0.5) / stages.length) * 100;

    return (
        <div className="space-y-5">
            <div className="animate-fadeInUp text-left">
                <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
                    {cropData.emoji} {selectedCrop} — Growth Stage Detection
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">AI image classification • CNN model • Season: {cropData.season}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Timeline */}
                <div className="glass-card p-6 animate-fadeInUp stagger-1 text-left">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">Growth Timeline</h2>
                        <div className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-3 py-1 rounded-lg font-black uppercase tracking-widest">{stages.length} stages</div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 mb-8 overflow-hidden">
                        <div className="h-2 rounded-full bg-gradient-to-r from-agrigreen-600 to-agrigreen-400 transition-all duration-1000" style={{ width: `${progress}%` }} />
                    </div>

                    <div className="relative border-l-2 border-slate-200 dark:border-slate-700/60 ml-4 space-y-6 pb-2">
                        {stages.map((stage, idx) => (
                            <div key={stage.name} className={`relative pl-8 animate-fadeInUp`} style={{ animationDelay: `${idx * 0.1}s` }}>
                                {stage.status === 'completed' && (
                                    <CheckCircle className="absolute -left-[11px] top-0 w-5 h-5 text-agrigreen-500 bg-white dark:bg-agricard rounded-full" />
                                )}
                                {stage.status === 'current' && (
                                    <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-agrigreen-100 dark:bg-agrigreen-900 border-2 border-agrigreen-500 dark:border-agrigreen-400 flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-agrigreen-500 dark:bg-agrigreen-400 animate-pulse" />
                                    </div>
                                )}
                                {stage.status === 'upcoming' && (
                                    <Circle className="absolute -left-[11px] top-0 w-5 h-5 text-slate-300 dark:text-slate-600 bg-white dark:bg-agricard" />
                                )}
                                <div className="flex items-center justify-between">
                                    <div className="text-left">
                                        <h3 className={`text-sm font-black ${stage.status === 'current' ? 'text-agrigreen-600 dark:text-agrigreen-400' : stage.status === 'completed' ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400 dark:text-slate-500 font-medium'}`}>
                                            {stage.name}
                                        </h3>
                                        <p className="text-[10px] text-slate-500 font-bold">{stage.date} • {stage.duration}</p>
                                    </div>
                                    {stage.status === 'current' && (
                                        <span className="text-[10px] bg-agrigreen-500/10 text-agrigreen-600 dark:text-agrigreen-400 px-2 py-1 rounded-lg font-black border border-agrigreen-500/20 uppercase italic tracking-widest">Active</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Assessment */}
                <div className="glass-card p-6 flex flex-col justify-center animate-fadeInUp stagger-2">
                    <div className="text-center">
                        <p className="text-xs text-slate-500 uppercase tracking-widest font-black mb-3 italic">AI Growth Assessment</p>
                        <div className="text-5xl font-black text-slate-800 dark:text-white drop-shadow-xl mb-2">{liveData.healthScore.toFixed(0)}%</div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 font-medium italic">{selectedCrop} health index</p>

                        <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto text-left">
                            <div className="bg-slate-100 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/40">
                                <Clock className="w-5 h-5 text-agrigreen-600 dark:text-agrigreen-400 mx-auto mb-2" />
                                <p className="text-[10px] text-slate-500 font-black uppercase text-center">Harvest In</p>
                                <p className="text-2xl font-black text-slate-800 dark:text-white text-center">{cropData.daysToHarvest}</p>
                                <p className="text-[10px] text-slate-500 font-bold text-center">days</p>
                            </div>
                            <div className="bg-slate-100 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/40">
                                <Sprout className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
                                <p className="text-[10px] text-slate-500 font-black uppercase text-center">Total Days</p>
                                <p className="text-2xl font-black text-slate-800 dark:text-white text-center">{cropData.growthDurationDays}</p>
                                <p className="text-[10px] text-slate-500 font-bold text-center">lifespan</p>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-agrigreen-500/5 dark:bg-agrigreen-900/30 rounded-xl border border-agrigreen-500/10 dark:border-agrigreen-500/20">
                            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed italic">
                                <span className="font-black text-agrigreen-700 dark:text-agrigreen-400 not-italic">Model:</span> CNN Image Classification •
                                <span className="font-black text-agrigreen-700 dark:text-agrigreen-400 not-italic"> Accuracy:</span> 94.2% •
                                <span className="font-black text-agrigreen-700 dark:text-agrigreen-400 not-italic"> Seed Rate:</span> {cropData.seedRatePerAcre} kg/acre
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GrowthStage;
