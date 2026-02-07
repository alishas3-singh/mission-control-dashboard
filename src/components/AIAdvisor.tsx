'use client';

import { useEffect, useState } from 'react';
import { Brain, Loader2, AlertCircle } from 'lucide-react';
import { generateRouteExplanation } from '@/lib/openai';
import type { Shipment } from '@/lib/cargo-data';

interface AIAdvisorProps {
    shipment: Shipment;
    weatherImpact: number;
    congestionLevel: number;
}

export default function AIAdvisor({ shipment, weatherImpact, congestionLevel }: AIAdvisorProps) {
    const [explanation, setExplanation] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

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
            <div className="flex items-start gap-3 mb-4">
                <Brain className="w-6 h-6 text-[#00f5ff] flex-shrink-0 mt-1" />
                <div className="flex-1">
                    <h3 className="text-lg font-black italic text-white mb-1">
                        AI Advisor
                    </h3>
                    <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/60">
                        Route Analysis
                    </p>
                </div>
                <div className="w-2 h-2 bg-[#00f5ff] rounded-full animate-pulse" />
            </div>

            <div className="min-h-[80px]">
                {loading && (
                    <div className="flex items-center justify-center py-6">
                        <Loader2 className="w-5 h-5 text-[#00f5ff] animate-spin" />
                        <span className="ml-2 text-sm text-white/60">Analyzing route...</span>
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
                            <span className="px-2 py-1 bg-white/5 rounded-lg text-[10px] font-mono text-white/60 capitalize">
                                {shipment.vehicleType}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
