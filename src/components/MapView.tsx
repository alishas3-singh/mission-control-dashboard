'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Polyline, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Hospital, Shipment } from '@/lib/cargo-data';
import { getCargoColor, getVehicleIcon } from '@/lib/cargo-data';
import { getMapTileUrl, getMapAttribution, isDaytime } from '@/lib/time-utils';

// Fix Leaflet default marker icon issue with Next.js
const hospitalIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00f5ff" stroke-width="2">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
    </svg>
  `),
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

const shipmentIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="#ff3131" stroke="white" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
    </svg>
  `),
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
});

// Component to fix map rendering
function MapFix() {
    const map = useMap();
    useEffect(() => {
        const timer = setTimeout(() => {
            map.invalidateSize();
            console.log('[EMLR-DEBUG]: Map Grid Initialized');
        }, 250);
        return () => clearTimeout(timer);
    }, [map]);
    return null;
}

// Component to show LIVE GRID status
function LiveGridIndicator() {
    return (
        <div className="absolute top-4 left-4 z-[1000] bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-2 flex items-center gap-2">
            <div className="w-2 h-2 bg-[#00f5ff] rounded-full animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#00f5ff]">
                Live Grid
            </span>
        </div>
    );
}

// Component to show color legend
function MapLegend() {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div className="absolute bottom-4 right-4 z-[1000]">
            {/* Legend popup */}
            {isOpen && (
                <div className="mb-2 bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 min-w-[200px]">
                    <h4 className="text-xs font-bold text-white mb-3 uppercase tracking-wider">Shipment Types</h4>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ff3131' }} />
                            <span className="text-xs text-white/80">Blood</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#22c55e' }} />
                            <span className="text-xs text-white/80">Organs</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#00f5ff' }} />
                            <span className="text-xs text-white/80">Equipment</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#7209b7' }} />
                            <span className="text-xs text-white/80">Medication</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Info button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 rounded-full w-10 h-10 flex items-center justify-center hover:border-[#00f5ff]/50 transition-all hover:scale-110"
                aria-label="Show legend"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-[#00f5ff]"
                >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4" />
                    <path d="M12 8h.01" />
                </svg>
            </button>
        </div>
    );
}

interface MapViewProps {
    hospitals: Hospital[];
    shipments: Shipment[];
    center: [number, number];
    selectedHospital?: string | null;
    selectedShipment?: string | null;
}

const MapView = React.memo(function MapView({
    hospitals,
    shipments,
    center,
    selectedHospital,
    selectedShipment
}: MapViewProps) {
    const [mounted, setMounted] = useState(false);
    const [mapTileUrl, setMapTileUrl] = useState(getMapTileUrl());

    useEffect(() => {
        setMounted(true);

        // Update map tiles every minute to check for day/night transition
        const interval = setInterval(() => {
            setMapTileUrl(getMapTileUrl());
        }, 60000); // Check every minute

        return () => clearInterval(interval);
    }, []);

    // Memoize hospital markers to prevent recreation on every render
    const hospitalMarkers = useMemo(() => {
        return hospitals.map((hospital) => {
            const isSelected = selectedHospital === hospital.id;
            const pathOptions = {
                fillColor: '#00f5ff',
                fillOpacity: isSelected ? 0.6 : 0.3,
                color: '#00f5ff',
                weight: isSelected ? 3 : 2,
            };

            return (
                <CircleMarker
                    key={hospital.id}
                    center={hospital.position}
                    radius={isSelected ? 16 : 12}
                    pathOptions={pathOptions}
                >
                    <Popup>
                        <div className="p-2">
                            <p className="font-mono text-[10px] text-gray-500 mb-1">{hospital.id}</p>
                            <p className="font-bold text-sm mb-1">{hospital.name}</p>
                            <p className="text-xs text-gray-600 mb-1">
                                Capacity: {hospital.capacity} beds
                            </p>
                            <p className="text-xs text-gray-600">
                                {hospital.specialties.join(', ')}
                            </p>
                        </div>
                    </Popup>
                </CircleMarker>
            );
        });
    }, [hospitals, selectedHospital]);

    // Memoize shipment routes and markers to prevent recreation on every render
    const shipmentMarkers = useMemo(() => {
        return shipments.map((shipment) => {
            const color = getCargoColor(shipment.cargo.type);
            const isSelected = selectedShipment === shipment.id;

            // Memoize path options
            const polylineOptions = {
                color: color,
                weight: isSelected ? 4 : 3,
                opacity: isSelected ? 0.9 : 0.6,
                dashArray: '10, 10',
            };

            const originOptions = {
                fillColor: color,
                fillOpacity: 0.8,
                color: 'white',
                weight: isSelected ? 3 : 2,
            };

            const destinationOptions = {
                fillColor: 'white',
                fillOpacity: 0.9,
                color: color,
                weight: isSelected ? 4 : 3,
            };

            // Memoize midpoint calculation
            const midpoint: [number, number] = [
                (shipment.origin.position[0] + shipment.destination.position[0]) / 2,
                (shipment.origin.position[1] + shipment.destination.position[1]) / 2,
            ];

            return (
                <div key={shipment.id}>
                    {/* Route line */}
                    <Polyline
                        positions={[shipment.origin.position, shipment.destination.position]}
                        pathOptions={polylineOptions}
                    />

                    {/* Origin marker */}
                    <CircleMarker
                        center={shipment.origin.position}
                        radius={isSelected ? 10 : 8}
                        pathOptions={originOptions}
                    >
                        <Popup>
                            <div className="p-2">
                                <p className="text-xs font-mono text-gray-600 mb-1">Origin</p>
                                <p className="font-bold text-sm">{shipment.origin.name}</p>
                            </div>
                        </Popup>
                    </CircleMarker>

                    {/* Destination marker - Pin to show where route is heading */}
                    <Marker
                        position={shipment.destination.position}
                        icon={new L.Icon({
                            iconUrl: 'data:image/svg+xml;base64,' + btoa(`
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 24 30">
                                    <path d="M12 0C7.589 0 4 3.589 4 8c0 6 8 14 8 14s8-8 8-14c0-4.411-3.589-8-8-8z" 
                                          fill="${color}" stroke="white" stroke-width="1.5"/>
                                    <circle cx="12" cy="8" r="3" fill="white"/>
                                </svg>
                            `),
                            iconSize: [32, 40],
                            iconAnchor: [16, 40],
                            popupAnchor: [0, -40],
                        })}
                    >
                        <Popup>
                            <div className="p-2">
                                <p className="text-xs font-mono text-gray-600 mb-1">Destination</p>
                                <p className="font-bold text-sm">{shipment.destination.name}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {shipment.cargo.description}
                                </p>
                            </div>
                        </Popup>
                    </Marker>

                    {/* Shipment info marker (midpoint) */}
                    <Marker position={midpoint} icon={shipmentIcon}>
                        <Popup>
                            <div className="p-2 min-w-[200px]">
                                <p className="font-mono text-[10px] text-gray-500 mb-1">{shipment.id}</p>
                                <p className="font-bold text-sm mb-2">{shipment.cargo.description}</p>
                                <div className="space-y-1 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Type:</span>
                                        <span className="font-semibold capitalize">{shipment.cargo.type}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Priority:</span>
                                        <span className={`font-semibold uppercase ${shipment.cargo.priority === 'critical' ? 'text-red-600' :
                                            shipment.cargo.priority === 'high' ? 'text-orange-600' :
                                                'text-blue-600'
                                            }`}>
                                            {shipment.cargo.priority}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">ETA:</span>
                                        <span className="font-semibold">{shipment.estArrival}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Vehicle:</span>
                                        <span className="font-semibold capitalize">{shipment.vehicleType}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Severity:</span>
                                        <span className="font-semibold text-red-600">{shipment.severity.toFixed(1)}/10</span>
                                    </div>
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                </div>
            );
        });
    }, [shipments, selectedShipment]);

    if (!mounted) {
        return (
            <div className="h-full w-full bg-[#0a0a0a] flex items-center justify-center">
                <span className="font-mono text-white/50 text-xs uppercase tracking-widest">
                    Loading map...
                </span>
            </div>
        );
    }

    return (
        <div className="h-full w-full relative">
            <MapContainer
                center={center}
                zoom={13}
                style={{ height: '100%', width: '100%', background: '#f8f8f8' }}
                zoomControl={false}
                scrollWheelZoom={true}
                dragging={true}
                doubleClickZoom={true}
                touchZoom={true}
                zoomSnap={0.5}
                zoomDelta={0.5}
                wheelDebounceTime={80}
                wheelPxPerZoomLevel={120}
                zoomAnimation={true}
                fadeAnimation={true}
                markerZoomAnimation={true}
                inertia={true}
                inertiaDeceleration={3000}
                inertiaMaxSpeed={1500}
                easeLinearity={0.25}
            >
                <MapFix />

                {/* Add zoom control on the left side */}
                <ZoomControl position="topleft" />

                {/* Light tiles */}
                <TileLayer
                    attribution={getMapAttribution()}
                    url={mapTileUrl}
                    key={mapTileUrl}
                    maxZoom={19}
                    keepBuffer={5}
                    updateWhenZooming={false}
                    updateWhenIdle={true}
                />

                {/* Hospital Markers */}
                {hospitalMarkers}

                {/* Shipment Routes and Markers */}
                {shipmentMarkers}
            </MapContainer>

            <LiveGridIndicator />
            <MapLegend />
        </div>
    );
});

export default MapView;
