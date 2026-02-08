'use client';

import Link from 'next/link';
import { Heart, Search, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import type { Hospital, Shipment } from '@/lib/cargo-data';

interface NavbarProps {
    onSearch?: (query: string) => void;
    searchResults?: {
        hospitals: Hospital[];
        shipments: Shipment[];
    };
    onSelectHospital?: (hospital: Hospital) => void;
    onSelectShipment?: (shipment: Shipment) => void;
}

export default function Navbar({
    onSearch,
    searchResults,
    onSelectHospital,
    onSelectShipment
}: NavbarProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        if (onSearch) {
            onSearch(value);
        }
        setShowResults(value.length > 0);
    };

    const clearSearch = () => {
        setSearchQuery('');
        setShowResults(false);
        if (onSearch) {
            onSearch('');
        }
    };

    const hasResults = searchResults && (
        searchResults.hospitals.length > 0 ||
        searchResults.shipments.length > 0
    );

    return (
        <nav className="fixed top-0 left-0 right-0 w-full h-16 bg-black/80 backdrop-blur-xl border-b border-white/5 z-[2000] px-10 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-[#ff3131]" />
                <span className="font-black text-sm tracking-wider uppercase italic text-white">
                    Life is On
                </span>
            </Link>

            <div className="flex items-center gap-8">
                <Link
                    href="/dispatch"
                    className="font-mono text-[11px] tracking-[0.2em] uppercase text-white/70 hover:text-[#00f5ff] transition-colors"
                >
                    Dispatch
                </Link>
                <Link
                    href="/audit"
                    className="font-mono text-[11px] tracking-[0.2em] uppercase text-white/70 hover:text-[#00f5ff] transition-colors"
                >
                    Audit
                </Link>
            </div>

            <div className="flex items-center gap-3 relative z-[2100]" ref={searchRef}>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                        type="text"
                        placeholder="Search hospitals, shipments..."
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        onFocus={() => searchQuery.length > 0 && setShowResults(true)}
                        className="w-72 h-9 pl-10 pr-9 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-[#00f5ff]/50 transition-colors"
                    />
                    {searchQuery && (
                        <button
                            onClick={clearSearch}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}

                    {/* Search Results Dropdown */}
                    {showResults && searchResults && (
                        <div className="absolute top-full mt-2 w-full bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl max-h-96 overflow-y-auto z-[2200]">
                            {!hasResults && searchQuery.length > 0 && (
                                <div className="p-4 text-center text-white/50 text-sm">
                                    No results found
                                </div>
                            )}

                            {/* Hospitals Section */}
                            {searchResults.hospitals.length > 0 && (
                                <div className="border-b border-white/10">
                                    <div className="px-3 py-2 bg-white/5">
                                        <p className="font-mono text-[10px] uppercase tracking-wider text-[#00f5ff]">
                                            Hospitals ({searchResults.hospitals.length})
                                        </p>
                                    </div>
                                    {searchResults.hospitals.map((hospital) => (
                                        <button
                                            key={hospital.id}
                                            onClick={() => {
                                                if (onSelectHospital) onSelectHospital(hospital);
                                                setShowResults(false);
                                            }}
                                            className="w-full px-3 py-2 hover:bg-white/5 transition-colors text-left"
                                        >
                                            <p className="text-sm font-semibold text-white mb-1">
                                                {hospital.name}
                                            </p>
                                            <p className="text-xs text-white/60">
                                                {hospital.capacity} beds • {hospital.specialties.slice(0, 2).join(', ')}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Shipments Section */}
                            {searchResults.shipments.length > 0 && (
                                <div>
                                    <div className="px-3 py-2 bg-white/5">
                                        <p className="font-mono text-[10px] uppercase tracking-wider text-[#00f5ff]">
                                            Shipments ({searchResults.shipments.length})
                                        </p>
                                    </div>
                                    {searchResults.shipments.map((shipment) => (
                                        <button
                                            key={shipment.id}
                                            onClick={() => {
                                                if (onSelectShipment) onSelectShipment(shipment);
                                                setShowResults(false);
                                            }}
                                            className="w-full px-3 py-2 hover:bg-white/5 transition-colors text-left"
                                        >
                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                <p className="text-sm font-semibold text-white">
                                                    {shipment.cargo.description}
                                                </p>
                                                <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full ${shipment.cargo.priority === 'critical'
                                                    ? 'bg-[#ff3131]/10 text-[#ff3131]'
                                                    : shipment.cargo.priority === 'high'
                                                        ? 'bg-[#00f5ff]/10 text-[#00f5ff]'
                                                        : 'bg-white/5 text-white/50'
                                                    }`}>
                                                    {shipment.cargo.priority}
                                                </span>
                                            </div>
                                            <p className="text-xs text-white/60">
                                                {shipment.id} • {shipment.origin.name} → {shipment.destination.name}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
