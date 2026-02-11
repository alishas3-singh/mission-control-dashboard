'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { fetchWeather, fetchTraffic } from '@/lib/api';
import { ACTIVE_SHIPMENTS, HOSPITALS, type Hospital, type Shipment } from '@/lib/cargo-data';
import { Activity, Cloud, Navigation, Package, Building2 } from 'lucide-react';
import LifeCostCard from '@/components/LifeCostCard';
import AIAdvisor from '@/components/AIAdvisor';
import ImpactMetrics from '@/components/ImpactMetrics';
import Onboarding from '@/components/Onboarding';
import LiveClock from '@/components/LiveClock';
import Navbar from '@/components/Navbar';

// Dynamic import to avoid SSR issues with Leaflet
const MapView = dynamic(() => import('@/components/MapView'), {
    ssr: false,
    loading: () => (
        <div className="h-full w-full bg-[#0a0a0a] flex items-center justify-center">
            <span className="font-mono text-white/50 text-xs uppercase tracking-widest animate-pulse">
                Initializing grid...
            </span>
        </div>
    ),
});

export default function DispatchPage() {
    const [weather, setWeather] = useState({ temperature: 15, impactFactor: 0.3 });
    const [traffic, setTraffic] = useState({ congestionLevel: 0.25 });
    const [loading, setLoading] = useState(true);

    // Search and selection states
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<{
        hospitals: Hospital[];
        shipments: Shipment[];
    }>({ hospitals: [], shipments: [] });
    const [selectedHospital, setSelectedHospital] = useState<string | null>(null);
    const [selectedShipment, setSelectedShipment] = useState<string | null>(null);

    useEffect(() => {
        async function loadData() {
            const [weatherData, trafficData] = await Promise.all([
                fetchWeather(),
                fetchTraffic(),
            ]);
            setWeather(weatherData);
            setTraffic(trafficData);
            setLoading(false);
        }
        loadData();

        // Refresh every 5 minutes
        const interval = setInterval(loadData, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    // Search handler
    const handleSearch = (query: string) => {
        setSearchQuery(query);

        if (!query.trim()) {
            setSearchResults({ hospitals: [], shipments: [] });
            setSelectedHospital(null);
            setSelectedShipment(null);
            return;
        }

        const lowerQuery = query.toLowerCase();

        // Search hospitals
        const matchedHospitals = HOSPITALS.filter(hospital =>
            hospital.name.toLowerCase().includes(lowerQuery) ||
            hospital.id.toLowerCase().includes(lowerQuery) ||
            hospital.specialties.some(s => s.toLowerCase().includes(lowerQuery))
        );

        // Search shipments
        const matchedShipments = ACTIVE_SHIPMENTS.filter(shipment =>
            shipment.id.toLowerCase().includes(lowerQuery) ||
            shipment.cargo.description.toLowerCase().includes(lowerQuery) ||
            shipment.cargo.type.toLowerCase().includes(lowerQuery) ||
            shipment.origin.name.toLowerCase().includes(lowerQuery) ||
            shipment.destination.name.toLowerCase().includes(lowerQuery)
        );

        setSearchResults({
            hospitals: matchedHospitals,
            shipments: matchedShipments,
        });
    };

    // Selection handlers
    const handleSelectHospital = (hospital: Hospital) => {
        setSelectedHospital(hospital.id);
        setSelectedShipment(null);
    };

    const handleSelectShipment = (shipment: Shipment) => {
        setSelectedShipment(shipment.id);
        setSelectedHospital(null);
    };

    // Get active (in-transit) shipments
    const activeShipments = ACTIVE_SHIPMENTS.filter(s => s.status === 'in-transit');
    const pendingShipments = ACTIVE_SHIPMENTS.filter(s => s.status === 'pending');

    // Find the highest severity shipment for Life-Cost card
    const criticalShipment = selectedShipment
        ? ACTIVE_SHIPMENTS.find(s => s.id === selectedShipment) || activeShipments[0]
        : activeShipments.reduce((max, s) => s.severity > max.severity ? s : max, activeShipments[0]);

    return (
        <>
            <Navbar
                onSearch={handleSearch}
                searchResults={searchResults}
                onSelectHospital={handleSelectHospital}
                onSelectShipment={handleSelectShipment}
            />

            <main className="min-h-screen bg-[#0a0a0a] pt-16">
                <div className="h-[calc(100vh-4rem)] relative">
                    {/* Hero Map - 70% viewport */}
                    <div className="h-[70vh] w-full relative">
                        <MapView
                            hospitals={HOSPITALS}
                            shipments={activeShipments}
                            center={[47.6205, -122.3321]}
                            selectedHospital={selectedHospital}
                            selectedShipment={selectedShipment}
                        />

                        {/* Live Clock Overlay */}
                        <LiveClock />

                        {/* Life-Cost Card Overlay */}
                        {criticalShipment && (
                            <div className="life-cost-card">
                                <LifeCostCard
                                    time={parseInt(criticalShipment.estArrival)}
                                    weather={weather.impactFactor}
                                    traffic={traffic.congestionLevel}
                                    severity={criticalShipment.severity}
                                />
                            </div>
                        )}

                        {/* AI Advisor Overlay */}
                        {criticalShipment && (
                            <div className="ai-advisor">
                                <AIAdvisor
                                    shipment={criticalShipment}
                                    weatherImpact={weather.impactFactor}
                                    congestionLevel={traffic.congestionLevel}
                                />
                            </div>
                        )}
                    </div>

                    {/* Data Dashboard - 30% viewport */}
                    <div className="h-[30vh] bg-[#0a0a0a] border-t border-white/10 overflow-y-auto">
                        {/* Impact Metrics */}
                        <div className="impact-metrics">
                            <ImpactMetrics shipments={ACTIVE_SHIPMENTS} />
                        </div>

                        {/* Stats Row */}
                        <div className="px-6 py-4 border-b border-white/10">
                            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
                                {/* Weather Card */}
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center gap-3">
                                    <Cloud className="w-8 h-8 text-[#00f5ff] flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-mono text-[8px] uppercase tracking-widest text-white/60">
                                            Weather
                                        </p>
                                        <p className="text-lg font-black text-white truncate">
                                            {(weather.impactFactor * 100).toFixed(0)}%
                                        </p>
                                    </div>
                                </div>

                                {/* Traffic Card */}
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center gap-3">
                                    <Navigation className="w-8 h-8 text-[#ff3131] flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-mono text-[8px] uppercase tracking-widest text-white/60">
                                            Traffic
                                        </p>
                                        <p className="text-lg font-black text-white truncate">
                                            {(traffic.congestionLevel * 100).toFixed(0)}%
                                        </p>
                                    </div>
                                </div>

                                {/* Active Shipments Card */}
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center gap-3">
                                    <Activity className="w-8 h-8 text-[#00f5ff] flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-mono text-[8px] uppercase tracking-widest text-white/60">
                                            In Transit
                                        </p>
                                        <p className="text-lg font-black text-white truncate">
                                            {activeShipments.length}
                                        </p>
                                    </div>
                                </div>

                                {/* Hospitals Card */}
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center gap-3">
                                    <Building2 className="w-8 h-8 text-[#00f5ff] flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-mono text-[8px] uppercase tracking-widest text-white/60">
                                            Hospitals
                                        </p>
                                        <p className="text-lg font-black text-white truncate">
                                            {HOSPITALS.length}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Shipments List */}
                        <div className="px-6 py-4">
                            <div className="max-w-7xl mx-auto">
                                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                                    <Package className="w-4 h-4 text-[#00f5ff]" />
                                    Active Shipments
                                </h3>

                                <div className="space-y-2">
                                    {ACTIVE_SHIPMENTS.map((shipment) => (
                                        <div
                                            key={shipment.id}
                                            onClick={() => handleSelectShipment(shipment)}
                                            className={`bg-white/5 border rounded-xl p-3 hover:border-[#00f5ff]/30 transition-colors cursor-pointer ${selectedShipment === shipment.id
                                                ? 'border-[#00f5ff]/50'
                                                : 'border-white/10'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-xs font-mono text-white/40">{shipment.id}</span>
                                                        <span
                                                            className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-mono ${shipment.status === 'in-transit'
                                                                ? 'bg-[#00f5ff]/10 text-[#00f5ff]'
                                                                : 'bg-white/5 text-white/50'
                                                                }`}
                                                        >
                                                            {shipment.status}
                                                        </span>
                                                        <span
                                                            className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-mono ${shipment.cargo.priority === 'critical'
                                                                ? 'bg-[#ff3131]/10 text-[#ff3131]'
                                                                : shipment.cargo.priority === 'high'
                                                                    ? 'bg-[#00f5ff]/10 text-[#00f5ff]'
                                                                    : 'bg-white/5 text-white/50'
                                                                }`}
                                                        >
                                                            {shipment.cargo.priority}
                                                        </span>
                                                    </div>

                                                    <p className="text-sm font-semibold text-white mb-1">
                                                        {shipment.cargo.description} ({shipment.cargo.quantity} {shipment.cargo.unit})
                                                    </p>

                                                    <p className="text-xs text-white/60">
                                                        {shipment.origin.name} → {shipment.destination.name}
                                                    </p>
                                                </div>

                                                <div className="text-right">
                                                    <p className="text-xs font-mono text-white/40 mb-1">
                                                        {shipment.vehicleType}
                                                    </p>
                                                    <p className="text-sm font-bold text-white">
                                                        ETA: {shipment.estArrival}
                                                    </p>
                                                    <p className="text-xs text-[#ff3131]">
                                                        Severity: {shipment.severity.toFixed(1)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Onboarding Tour */}
                <Onboarding />
            </main>
        </>
    );
}
