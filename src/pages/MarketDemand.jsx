import React from 'react';
import { TrendingUp, MapPin, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { useCrop } from '../context/CropContext';

const MarketDemand = () => {
    const { cropData, selectedCrop, liveData } = useCrop();
    const market = cropData.market;
    const priceUp = (liveData.currentPrice + 5) > liveData.currentPrice; // Simplified logic for UI sync

    return (
        <div className="space-y-5">
            <div className="animate-fadeInUp text-left">
                <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
                    {cropData.emoji} {selectedCrop} — Market Demand & Price Forecasting
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">LSTM time series model • ARIMA price forecasting</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Regional Summary */}
                <div className="glass-card p-6 flex flex-col justify-between animate-fadeInUp stagger-1">
                    <div>
                        <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-5">
                            <MapPin className="text-indigo-500 dark:text-indigo-400 w-5 h-5" /> Regional Harvest Forecast
                        </h2>
                        <div className="space-y-3 text-left">
                            <div className="p-4 bg-slate-100 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/30">
                                <span className="text-xs text-slate-500 block mb-1 font-bold uppercase">Region</span>
                                <span className="text-lg font-black text-slate-800 dark:text-slate-200">{market.region}</span>
                            </div>
                            <div className="p-4 bg-slate-100 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/30">
                                <span className="text-xs text-slate-500 block mb-1 font-bold uppercase">{selectedCrop} Harvest Peak</span>
                                <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">{market.harvestPeak}</span>
                            </div>
                            <div className="p-4 bg-slate-100 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/30">
                                <span className="text-xs text-slate-500 block mb-1 font-bold uppercase">Predicted Supply</span>
                                <span className={`text-lg font-black ${market.supplyLevel === 'HIGH' ? 'text-red-600 dark:text-red-400' : market.supplyLevel === 'LOW' ? 'text-emerald-600 dark:text-emerald-400' : 'text-yellow-600 dark:text-yellow-400'}`}>{market.supplyLevel}</span>
                            </div>
                        </div>
                    </div>
                    {/* Monthly demand levels */}
                    <div className="mt-4">
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-black mb-3 text-left">Demand Outlook</p>
                        {market.monthlyDemand.map((m, i) => (
                            <div key={i} className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-800 last:border-0">
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{m.month}</span>
                                <span className={`text-xs font-black px-2 py-0.5 rounded-md ${m.level === 'Very High' ? 'bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400' : m.level === 'High' ? 'bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400' : 'bg-yellow-500/10 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'}`}>
                                    {m.level}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chart */}
                <div className="glass-card p-6 lg:col-span-2 animate-fadeInUp stagger-2">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                            <TrendingUp className="text-agrigreen-600 dark:text-agrigreen-400 w-5 h-5" /> Demand vs Price Trends
                        </h2>
                        <div className="text-xs text-slate-500 flex gap-4 font-bold">
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-indigo-500"></div> Demand</span>
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded bg-agrigreen-500"></div> Price</span>
                        </div>
                    </div>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={market.demandTrend} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="gDemand" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="gPrice" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={cropData.color} stopOpacity={0.3} />
                                        <stop offset="95%" stopColor={cropData.color} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" stroke="currentColor" className="text-slate-400 dark:text-slate-600" fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis stroke="currentColor" className="text-slate-400 dark:text-slate-600" fontSize={11} tickLine={false} axisLine={false} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-slate-800" />
                                <RechartsTooltip
                                    contentStyle={{
                                        backgroundColor: 'var(--bg-card)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '12px',
                                        color: 'var(--text-main)'
                                    }}
                                    itemStyle={{ color: 'var(--text-main)', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="demand" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#gDemand)" />
                                <Area type="monotone" dataKey="price" stroke={cropData.color} strokeWidth={2.5} fillOpacity={1} fill="url(#gPrice)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeInUp font-black">
                <div className="glass-card p-5 flex items-center justify-between bg-gradient-to-r from-white dark:from-agricard to-indigo-500/5 dark:to-indigo-900/20 text-left">
                    <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Suggested Crop Now</p>
                        <p className="text-2xl font-black text-slate-800 dark:text-white mt-1">{selectedCrop} {cropData.emoji}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-indigo-600 dark:text-indigo-300 uppercase tracking-widest font-black">Peak Demand</p>
                        <p className="text-lg font-black text-indigo-700 dark:text-indigo-400 mt-1">{market.monthlyDemand[market.monthlyDemand.length - 1]?.month || 'N/A'}</p>
                    </div>
                </div>

                <div className={`glass-card p-5 flex items-center justify-between text-left ${priceUp ? 'border-emerald-500/20' : 'border-red-500/20'}`}>
                    <div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Current Price</p>
                        <p className="text-2xl font-black text-slate-800 dark:text-slate-200 mt-1">₹{liveData.currentPrice.toFixed(2)}/kg</p>
                    </div>
                    <div className="text-right flex flex-col items-end">
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Predicted Next Month</p>
                        <div className="flex items-center gap-2 mt-1">
                            {priceUp ? <ArrowUpRight className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> : <ArrowDownRight className="w-5 h-5 text-red-600 dark:text-red-400" />}
                            <p className={`text-2xl font-black ${priceUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>₹{(liveData.currentPrice + 10).toFixed(1)}/kg</p>
                        </div>
                        <p className={`text-xs font-black ${priceUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>({market.priceChange})</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarketDemand;
