'use client';

import { useEffect, useState } from 'react';
import { Brain, Loader2, AlertCircle, Route } from 'lucide-react';
import { generateRouteExplanation, getRouteStrategy } from '@/lib/openai';
import type { Shipment } from '@/lib/cargo-data';

interface AIAdvisorProps {
    shipment: Shipment;
    weatherImpact: number;
    congestionLevel: number;
    weatherDescription?: string;
}

function getConditionColor(value: number): string {
    if (value >= 0.6) return 'bg-[#ff3131]/15 text-[#ff3131] border-[#ff3131]/30';
    if (value >= 0.3) return 'bg-orange-500/15 text-orange-400 border-orange-500/30';
    return 'bg-[#22c55e]/15 text-[#22c55e] border-[#22c55e]/30';
}

function getConditionLabel(value: number): string {
    if (value >= 0.6) return 'High';
    if (value >= 0.3) return 'Moderate';
    return 'Low';
}

export default function AIAdvisor({ shipment, weatherImpact, congestionLevel, weatherDescription }: AIAdvisorProps) {
    const [explanation, setExplanation] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const strategy = getRouteStrategy(weatherImpact, congestionLevel, shipment.severity);

    useEffect(() => {
        async function fetchExplanation() {
            setLoading(true);
            setError(false);

            try {
                const result = await generateRouteExplanation({
                    cargoDescription: shipment.cargo.description,
                    severity: shipment.severity,
                    priority: shipment.cargo.priority,
                    origin: shipment.origin.name,
                    destination: shipment.destination.name,
                    vehicleType: shipment.vehicleType,
                    estArrival: shipment.estArrival,
                    weatherImpact,
                    congestionLevel,
                    weatherDescription,
                });

                setExplanation(result);
            } catch (err) {
                console.error('Failed to generate explanation:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        }

        fetchExplanation();
    }, [shipment.id, weatherImpact, congestionLevel]); // Re-generate when shipment or conditions change

    return (
        <div className="absolute bottom-6 right-6 z-[500] w-96 bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-start gap-3 mb-3">
                <Brain className="w-6 h-6 text-[#00f5ff] flex-shrink-0 mt-1" />
                <div className="flex-1">
                    <h3 className="text-lg font-black italic text-white mb-1">
                        AI Advisor
                    </h3>
                    <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/60">
                        Live Route Analysis
                    </p>
                </div>
                <div className="w-2 h-2 bg-[#00f5ff] rounded-full animate-pulse" />
            </div>

            {/* Live Condition Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-2 py-1 rounded-lg text-[10px] font-mono border ${getConditionColor(weatherImpact)}`}>
                    ☁️ Weather: {(weatherImpact * 100).toFixed(0)}% ({getConditionLabel(weatherImpact)})
                </span>
                <span className={`px-2 py-1 rounded-lg text-[10px] font-mono border ${getConditionColor(congestionLevel)}`}>
                    🚦 Traffic: {(congestionLevel * 100).toFixed(0)}% ({getConditionLabel(congestionLevel)})
                </span>
                <span className="px-2 py-1 rounded-lg text-[10px] font-mono border bg-[#00f5ff]/10 text-[#00f5ff] border-[#00f5ff]/30 flex items-center gap-1">
                    <Route size={10} /> Road Route
                </span>
            </div>

            {/* Route Strategy Badge */}
            <div className={`mb-4 px-3 py-2 rounded-xl border text-[11px] font-semibold ${strategy.urgency === 'critical'
                    ? 'bg-[#ff3131]/10 border-[#ff3131]/30 text-[#ff3131]'
                    : strategy.urgency === 'high'
                        ? 'bg-orange-500/10 border-orange-500/30 text-orange-400'
                        : 'bg-[#00f5ff]/10 border-[#00f5ff]/30 text-[#00f5ff]'
                }`}>
                🚗 {strategy.routeName}
            </div>

            <div className="min-h-[80px]">
                {loading && (
                    <div className="flex items-center justify-center py-6">
                        <Loader2 className="w-5 h-5 text-[#00f5ff] animate-spin" />
                        <span className="ml-2 text-sm text-white/60">Analyzing road routes...</span>
                    </div>
                )}

                {error && !loading && (
                    <div className="flex items-start gap-2 p-3 bg-[#ff3131]/10 border border-[#ff3131]/20 rounded-xl">
                        <AlertCircle className="w-4 h-4 text-[#ff3131] flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-white/70">
                            Unable to generate AI explanation. Please check API configuration.
                        </p>
                    </div>
                )}

                {!loading && !error && explanation && (
                    <div className="space-y-3">
                        <p className="text-sm text-white/90 leading-relaxed">
                            {explanation}
                        </p>

                        {/* Shipment context pills */}
                        <div className="flex flex-wrap gap-2 pt-3 border-t border-white/10">
                            <span className="px-2 py-1 bg-white/5 rounded-lg text-[10px] font-mono text-white/60">
                                ID: {shipment.id}
                            </span>
                            <span className={`px-2 py-1 rounded-lg text-[10px] font-mono ${shipment.severity >= 9
                                ? 'bg-[#ff3131]/10 text-[#ff3131]'
                                : 'bg-[#00f5ff]/10 text-[#00f5ff]'
                                }`}>
                                Severity: {shipment.severity.toFixed(1)}
                            </span>
                            <span className="px-2 py-1 bg-white/5 rounded-lg text-[10px] font-mono text-white/60">
                                🚑 Ambulance
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
