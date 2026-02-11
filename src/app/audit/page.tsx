'use client';

import { useEffect, useState } from 'react';
import { Brain, Activity } from 'lucide-react';
import ShapPlot from '@/components/ShapPlot';
import DecisionTree from '@/components/DecisionTree';
import { fetchWeather, fetchTraffic } from '@/lib/api';
import { ACTIVE_SHIPMENTS } from '@/lib/cargo-data';

export default function AuditPage() {
    const [weather, setWeather] = useState({ temperature: 15, impactFactor: 0.3, weathercode: 0 });
    const [traffic, setTraffic] = useState({ congestionLevel: 0.25, currentSpeed: 45, freeFlowSpeed: 60 });

    // Get the highest severity shipment
    const activeShipments = ACTIVE_SHIPMENTS.filter(s => s.status === 'in-transit');
    const criticalShipment = activeShipments.reduce(
        (max, s) => (s.severity > max.severity ? s : max),
        activeShipments[0]
    );

    useEffect(() => {
        async function loadLiveData() {
            const [weatherData, trafficData] = await Promise.all([
                fetchWeather(),
                fetchTraffic(),
            ]);
            setWeather(weatherData);
            setTraffic(trafficData);
        }
        loadLiveData();

        // Refresh every 5 minutes
        const interval = setInterval(loadLiveData, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <main className="min-h-screen bg-[#0a0a0a] pt-16 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <header className="border-b border-white/10 pb-6">
                    <div className="flex items-center gap-4 mb-3">
                        <Brain className="w-10 h-10 text-[#00f5ff]" />
                        <h1 className="text-4xl font-black italic text-white">
                            Clinical Audit
                        </h1>
                    </div>
                    <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/60">
                        Interpretable AI Panel // Explainability Dashboard
                    </p>
                </header>

                {/* AI Explanation Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* SHAP Waterfall Plot */}
                    <div>
                        <ShapPlot />
                    </div>

                    {/* Decision Tree - Live Data */}
                    <div>
                        <DecisionTree
                            weatherImpact={weather.impactFactor}
                            trafficCongestion={traffic.congestionLevel}
                            severity={criticalShipment?.severity ?? 8.5}
                        />
                    </div>
                </div>

                {/* Model Information */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                    <div className="flex items-start gap-4">
                        <Activity className="w-6 h-6 text-[#00f5ff] flex-shrink-0 mt-1" />
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-white mb-2">
                                Model Architecture
                            </h3>
                            <p className="text-sm text-white/70 leading-relaxed">
                                The emergency medical logistics routing system uses a hybrid Random Forest ensemble
                                combined with rule-based decision trees. The SHAP waterfall plot above shows feature
                                importance and cumulative impact on routing decisions. Blue bars represent time-saving
                                features (high medical severity, short distance), while red bars indicate delay factors
                                (traffic congestion, adverse weather). The decision tree visualization demonstrates the
                                rule-based logic paths used to select optimal routes based on real-time conditions.
                            </p>
                            <div className="mt-4 flex items-center gap-2">
                                <div className="w-2 h-2 bg-[#00f5ff] rounded-full animate-pulse" />
                                <span className="font-mono text-[10px] uppercase tracking-widest text-[#00f5ff]">
                                    Model Active — Live Data Connected
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
