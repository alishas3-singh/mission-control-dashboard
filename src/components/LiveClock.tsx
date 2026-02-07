'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function LiveClock() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
        });
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <div className="absolute top-4 right-20 z-[1000] bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-2">
            <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#00f5ff]" />
                <div className="text-right">
                    <p className="font-mono text-sm font-bold text-white">
                        {formatTime(time)}
                    </p>
                    <p className="font-mono text-[9px] uppercase tracking-wider text-white/60">
                        {formatDate(time)}
                    </p>
                </div>
            </div>
        </div>
    );
}
