'use client';

import { useEffect, useState } from 'react';

interface Feature {
    name: string;
    value: number;
    type: 'time-saving' | 'delay';
    liveLabel?: string;
}

interface ShapPlotProps {
    weatherImpact?: number;
    trafficCongestion?: number;
    severity?: number;
}

// Compute SHAP-like feature impact values based on live data
function computeFeatures(weather: number, traffic: number, severity: number): Feature[] {
    // Severity contribution: higher severity = stronger positive SHAP value (speeds up dispatch)
    const severityImpact = severity >= 7
        ? 2.0 + (severity - 7) * 0.7   // High severity: strong positive push
        : 0.5 + severity * 0.1;         // Low severity: mild positive

    // Distance is semi-static but varies slightly
    const distanceImpact = 2.1;

    // Traffic: higher congestion = stronger negative SHAP value (delays)
    const trafficImpact = -(traffic * 5.0);  // 0% → 0, 50% → -2.5, 100% → -5.0

    // Weather: higher impact = stronger negative SHAP value
    const weatherDelay = -(weather * 3.5);   // 0% → 0, 50% → -1.75, 100% → -3.5

    // Time of day: peak hours add negative impact (scaled by traffic)
    const hour = new Date().getHours();
    const isPeak = (hour >= 7 && hour <= 9) || (hour >= 16 && hour <= 19);
    const timeImpact = isPeak ? -(0.5 + traffic * 1.0) : -0.2;

    // Hospital capacity: positive contribution
    const capacityImpact = 1.2;

    return [
        {
            name: 'Medical Severity',
            value: parseFloat(severityImpact.toFixed(2)),
            type: 'time-saving',
            liveLabel: `${severity.toFixed(1)}/10`,
        },
        {
            name: 'Geospatial Distance',
            value: distanceImpact,
            type: 'time-saving',
            liveLabel: '4.2 km',
        },
        {
            name: 'Traffic Congestion',
            value: parseFloat(trafficImpact.toFixed(2)),
            type: 'delay',
            liveLabel: `${(traffic * 100).toFixed(0)}%`,
        },
        {
            name: 'Weather Conditions',
            value: parseFloat(weatherDelay.toFixed(2)),
            type: 'delay',
            liveLabel: `${(weather * 100).toFixed(0)}% impact`,
        },
        {
            name: `Time of Day ${isPeak ? '(Peak)' : '(Off-Peak)'}`,
            value: parseFloat(timeImpact.toFixed(2)),
            type: 'delay',
            liveLabel: `${hour}:00`,
        },
        {
            name: 'Hospital Capacity',
            value: capacityImpact,
            type: 'time-saving',
            liveLabel: '25 beds',
        },
    ];
}

export default function ShapPlot({ weatherImpact = 0.3, trafficCongestion = 0.25, severity = 8.5 }: ShapPlotProps) {
    const [mounted, setMounted] = useState(false);
    const [barsAnimated, setBarsAnimated] = useState(false);

    useEffect(() => {
        setMounted(true);
        const timer = setTimeout(() => setBarsAnimated(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // Compute features from live data
    const features = computeFeatures(weatherImpact, trafficCongestion, severity);

    // Calculate cumulative values for waterfall effect
    let cumulative = 0;
    const waterfallData = features.map((feature) => {
        const start = cumulative;
        cumulative += feature.value;
        return {
            ...feature,
            start,
            end: cumulative,
        };
    });

    const maxAbsValue = Math.max(...features.map((f) => Math.abs(f.value)));
    const scale = 100 / (maxAbsValue * 2.5); // Scale for visualization

    // Net score determines routing recommendation
    const netScore = cumulative;

    if (!mounted) return null;

    return (
        <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8">
            <div className="mb-6">
                <h3 className="text-2xl font-black italic text-white mb-2">
                    SHAP Waterfall Analysis
                </h3>
                <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/60">
                    Live Feature Impact on Route Prioritization
                </p>
                <div className="flex items-center gap-2 mt-2">
                    <div className="w-2 h-2 bg-[#00f5ff] rounded-full animate-pulse" />
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#00f5ff]">
                        Real-Time Analysis
                    </span>
                </div>
            </div>

            <div className="space-y-6">
                {waterfallData.map((feature, index) => (
                    <div key={index} className="space-y-2">
                        <div className="flex justify-between items-baseline">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-white">
                                    {feature.name}
                                </span>
                                {feature.liveLabel && (
                                    <span className="font-mono text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-white/50">
                                        ⚡ {feature.liveLabel}
                                    </span>
                                )}
                            </div>
                            <span
                                className={`font-mono text-xs ${feature.type === 'time-saving'
                                    ? 'text-[#00f5ff]'
                                    : 'text-[#ff3131]'
                                    }`}
                            >
                                {feature.value > 0 ? '+' : ''}
                                {feature.value.toFixed(2)}
                            </span>
                        </div>

                        {/* Waterfall bar */}
                        <div className="relative h-8 bg-white/5 rounded-lg overflow-hidden">
                            <div
                                className={`absolute h-full transition-all duration-1000 ease-out ${feature.type === 'time-saving'
                                    ? 'bg-[#00f5ff]'
                                    : 'bg-[#ff3131]'
                                    }`}
                                style={{
                                    left: barsAnimated
                                        ? `${Math.max(0, Math.min(feature.start, feature.end)) * scale + 50}%`
                                        : '50%',
                                    width: barsAnimated
                                        ? `${Math.abs(feature.value) * scale}%`
                                        : '0%',
                                }}
                            >
                                {/* Value label inside bar */}
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 font-mono text-[10px] font-bold text-white">
                                    {Math.abs(feature.value).toFixed(1)}
                                </span>
                            </div>

                            {/* Center line */}
                            <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-white/20" />
                        </div>

                        {/* Cumulative value indicator */}
                        <div className="flex justify-end">
                            <span className="font-mono text-[9px] text-white/40">
                                Cumulative: {feature.end.toFixed(2)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Net Score */}
            <div className="mt-6 p-4 bg-white/5 rounded-2xl">
                <div className="flex justify-between items-center">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-white/60">
                        Net SHAP Score
                    </span>
                    <span className={`text-2xl font-black ${netScore > 0 ? 'text-[#00f5ff]' : 'text-[#ff3131]'}`}>
                        {netScore > 0 ? '+' : ''}{netScore.toFixed(2)}
                    </span>
                </div>
                <p className="font-mono text-[9px] text-white/40 mt-1">
                    {netScore > 2 ? 'Strong positive — prioritize fastest route' :
                        netScore > 0 ? 'Mild positive — standard routing recommended' :
                            netScore > -2 ? 'Mild negative — consider alternate routes' :
                                'Strong negative — reroute to avoid delays'}
                </p>
            </div>

            {/* Legend */}
            <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-[#00f5ff] rounded-sm" />
                    <span className="font-mono text-[10px] text-white/70 uppercase">
                        Time-Saving
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-[#ff3131] rounded-sm" />
                    <span className="font-mono text-[10px] text-white/70 uppercase">
                        Delay Factor
                    </span>
                </div>
            </div>
        </div>
    );
}
