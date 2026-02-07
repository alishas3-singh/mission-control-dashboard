'use client';

import { useEffect, useState } from 'react';
import { Heart, Clock, Package, TrendingUp } from 'lucide-react';
import {
    calculateLivesSaved,
    calculateTimeSaved,
    calculateSuccessRate,
    getCriticalDeliveriesCount,
    type Shipment
} from '@/lib/cargo-data';

interface ImpactMetricsProps {
    shipments: Shipment[];
}

function AnimatedCounter({ value, decimals = 0 }: { value: number; decimals?: number }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const duration = 1000; // 1 second animation
        const steps = 30;
        const increment = value / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
                setCount(value);
                clearInterval(timer);
            } else {
                setCount(current);
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [value]);

    return <span>{count.toFixed(decimals)}</span>;
}

export default function ImpactMetrics({ shipments }: ImpactMetricsProps) {
    const livesSaved = calculateLivesSaved(shipments);
    const timeSaved = Math.round(calculateTimeSaved(shipments));
    const successRate = calculateSuccessRate(shipments);
    const criticalDeliveries = getCriticalDeliveriesCount(shipments);

    const metrics = [
        {
            icon: Heart,
            label: 'Lives Saved',
            value: livesSaved,
            decimals: 1,
            color: 'text-[#00f5ff]',
            bgColor: 'bg-[#00f5ff]/10',
            subtitle: 'Est. impact',
        },
        {
            icon: Clock,
            label: 'Time Saved',
            value: timeSaved,
            decimals: 0,
            suffix: ' min',
            color: 'text-[#00f5ff]',
            bgColor: 'bg-[#00f5ff]/10',
            subtitle: 'This week',
        },
        {
            icon: Package,
            label: 'Critical Deliveries',
            value: criticalDeliveries,
            decimals: 0,
            color: 'text-[#ff3131]',
            bgColor: 'bg-[#ff3131]/10',
            subtitle: 'High priority',
        },
        {
            icon: TrendingUp,
            label: 'Success Rate',
            value: successRate,
            decimals: 0,
            suffix: '%',
            color: 'text-[#00f5ff]',
            bgColor: 'bg-[#00f5ff]/10',
            subtitle: 'Completion',
        },
    ];

    return (
        <div className="px-6 py-4 border-b border-white/10">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-[#00f5ff]" />
                    <h3 className="text-sm font-bold text-white">Impact Metrics</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {metrics.map((metric, index) => {
                        const Icon = metric.icon;
                        return (
                            <div
                                key={index}
                                className={`${metric.bgColor} border border-white/10 rounded-2xl p-4 transition-all hover:border-${metric.color.replace('text-', '')}/30`}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <Icon className={`w-5 h-5 ${metric.color} flex-shrink-0`} />
                                    <span className="font-mono text-[8px] uppercase tracking-widest text-white/40">
                                        {metric.subtitle}
                                    </span>
                                </div>

                                <div className="space-y-1">
                                    <div className={`text-2xl font-black ${metric.color}`}>
                                        <AnimatedCounter value={metric.value} decimals={metric.decimals} />
                                        {metric.suffix || ''}
                                    </div>
                                    <p className="text-[10px] font-semibold text-white/70">
                                        {metric.label}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
