'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, AlertTriangle } from 'lucide-react';

interface LifeCostCardProps {
    time?: number;
    weather?: number;
    severity?: number;
}

export default function LifeCostCard({ time = 15, weather = 0.7, severity = 8.5 }: LifeCostCardProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Life-Cost Index Formula: LC = (Time × Weather) + Severity
    const lifeCost = (time * weather) + severity;
    const isHighRisk = lifeCost > 15;

    if (!mounted) return null;

    return (
        <div className="absolute bottom-6 left-6 z-[500] w-80 bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/60">
                        Active Cargo
                    </p>
                    <h3 className="text-2xl font-black italic text-white mt-1">
                        Life-Cost Index
                    </h3>
                </div>
                {isHighRisk ? (
                    <AlertTriangle className="w-6 h-6 text-[#ff3131]" />
                ) : (
                    <TrendingUp className="w-6 h-6 text-[#00f5ff]" />
                )}
            </div>

            {/* Formula Display */}
            <div className="bg-white/5 rounded-2xl p-4 mb-4">
                <p className="font-mono text-xs text-white/70 mb-2">
                    LC = (Time × Weather) + Severity
                </p>
                <p className="font-mono text-xs text-white/50">
                    LC = ({time} × {weather.toFixed(1)}) + {severity}
                </p>
            </div>

            {/* Life-Cost Value */}
            <div className="flex items-baseline gap-2 mb-4">
                <span
                    className={`text-4xl font-black ${isHighRisk ? 'text-[#ff3131]' : 'text-[#00f5ff]'
                        }`}
                >
                    {lifeCost.toFixed(1)}
                </span>
                <span className="font-mono text-xs text-white/50 uppercase">
                    LC Units
                </span>
            </div>

            {/* Component Breakdown */}
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span className="font-mono text-[10px] text-white/60 uppercase tracking-wider">
                        Time Factor
                    </span>
                    <span className="text-sm font-bold text-white">{time} min</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="font-mono text-[10px] text-white/60 uppercase tracking-wider">
                        Weather Impact
                    </span>
                    <span className="text-sm font-bold text-white">{(weather * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="font-mono text-[10px] text-white/60 uppercase tracking-wider">
                        Medical Severity
                    </span>
                    <span className="text-sm font-bold text-[#ff3131]">{severity}/10</span>
                </div>
            </div>

            {/* Status Indicator */}
            <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isHighRisk ? 'bg-[#ff3131]' : 'bg-[#00f5ff]'} animate-pulse`} />
                    <span className={`font-mono text-[10px] uppercase tracking-widest ${isHighRisk ? 'text-[#ff3131]' : 'text-[#00f5ff]'}`}>
                        {isHighRisk ? 'Priority Dispatch' : 'Standard Route'}
                    </span>
                </div>
            </div>
        </div>
    );
}
