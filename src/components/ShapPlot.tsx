'use client';

import { useEffect, useState } from 'react';

interface Feature {
    name: string;
    value: number;
    type: 'time-saving' | 'delay';
}

export default function ShapPlot() {
    const [mounted, setMounted] = useState(false);
    const [barsAnimated, setBarsAnimated] = useState(false);

    useEffect(() => {
        setMounted(true);
        const timer = setTimeout(() => setBarsAnimated(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // Example SHAP features for emergency medical logistics
    const features: Feature[] = [
        { name: 'High Medical Severity', value: 4.2, type: 'time-saving' },
        { name: 'Short Geospatial Distance', value: 2.1, type: 'time-saving' },
        { name: 'Traffic Congestion', value: -2.8, type: 'delay' },
        { name: 'Adverse Weather', value: -1.5, type: 'delay' },
        { name: 'Time of Day (Peak)', value: -0.9, type: 'delay' },
        { name: 'Hospital Capacity', value: 1.2, type: 'time-saving' },
    ];

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

    if (!mounted) return null;

    return (
        <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8">
            <div className="mb-6">
                <h3 className="text-2xl font-black italic text-white mb-2">
                    SHAP Waterfall Analysis
                </h3>
                <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/60">
                    Feature Impact on Route Prioritization
                </p>
            </div>

            <div className="space-y-6">
                {waterfallData.map((feature, index) => (
                    <div key={index} className="space-y-2">
                        <div className="flex justify-between items-baseline">
                            <span className="text-sm font-semibold text-white">
                                {feature.name}
                            </span>
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

            {/* Legend */}
            <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-6">
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
