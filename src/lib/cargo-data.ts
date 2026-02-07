// cargo-data.ts - Sample data for emergency medical shipments

export interface Hospital {
    id: string;
    name: string;
    position: [number, number]; // [lat, lng]
    capacity: number; // Available beds
    specialties: string[];
}

export interface Cargo {
    id: string;
    type: 'blood' | 'organs' | 'equipment' | 'medication';
    description: string;
    priority: 'critical' | 'high' | 'medium';
    quantity: number;
    unit: string;
}

export interface Shipment {
    id: string;
    cargo: Cargo;
    origin: Hospital;
    destination: Hospital;
    status: 'in-transit' | 'delivered' | 'pending';
    estArrival: string; // Time in minutes
    severity: number; // Medical severity score 0-10
    vehicleType: 'ambulance' | 'helicopter' | 'drone';
}

// Seattle area hospitals
export const HOSPITALS: Hospital[] = [
    {
        id: 'H001',
        name: 'Harborview Medical Center',
        position: [47.6048, -122.3206],
        capacity: 25,
        specialties: ['Trauma', 'Emergency', 'Surgery'],
    },
    {
        id: 'H002',
        name: 'Swedish Medical Center',
        position: [47.6232, -122.3206],
        capacity: 40,
        specialties: ['Cardiology', 'Neurology', 'Oncology'],
    },
    {
        id: 'H003',
        name: 'UW Medical Center',
        position: [47.6505, -122.3055],
        capacity: 35,
        specialties: ['Transplant', 'Pediatrics', 'Research'],
    },
    {
        id: 'H004',
        name: 'Virginia Mason Medical Center',
        position: [47.6113, -122.3295],
        capacity: 30,
        specialties: ['General', 'Orthopedics', 'Gastroenterology'],
    },
    {
        id: 'H005',
        name: 'Seattle Children\'s Hospital',
        position: [47.6545, -122.3030],
        capacity: 20,
        specialties: ['Pediatrics', 'NICU', 'Pediatric Surgery'],
    },
];

// Active shipments
export const ACTIVE_SHIPMENTS: Shipment[] = [
    {
        id: 'S001',
        cargo: {
            id: 'C001',
            type: 'blood',
            description: 'O-Negative Blood Units',
            priority: 'critical',
            quantity: 6,
            unit: 'units',
        },
        origin: HOSPITALS[1], // Swedish Medical Center
        destination: HOSPITALS[0], // Harborview Medical Center
        status: 'in-transit',
        estArrival: '12 min',
        severity: 9.2,
        vehicleType: 'ambulance',
    },
    {
        id: 'S002',
        cargo: {
            id: 'C002',
            type: 'organs',
            description: 'Donor Heart for Transplant',
            priority: 'critical',
            quantity: 1,
            unit: 'organ',
        },
        origin: HOSPITALS[3], // Virginia Mason
        destination: HOSPITALS[2], // UW Medical Center
        status: 'in-transit',
        estArrival: '8 min',
        severity: 10,
        vehicleType: 'helicopter',
    },
    {
        id: 'S003',
        cargo: {
            id: 'C003',
            type: 'medication',
            description: 'Emergency Antivenom',
            priority: 'high',
            quantity: 3,
            unit: 'vials',
        },
        origin: HOSPITALS[1], // Swedish
        destination: HOSPITALS[4], // Seattle Children's
        status: 'in-transit',
        estArrival: '15 min',
        severity: 7.5,
        vehicleType: 'ambulance',
    },
    {
        id: 'S004',
        cargo: {
            id: 'C004',
            type: 'equipment',
            description: 'Portable Ventilator',
            priority: 'high',
            quantity: 1,
            unit: 'unit',
        },
        origin: HOSPITALS[2], // UW Medical
        destination: HOSPITALS[0], // Harborview
        status: 'pending',
        estArrival: '20 min',
        severity: 8.0,
        vehicleType: 'ambulance',
    },
    {
        id: 'S005',
        cargo: {
            id: 'C005',
            type: 'blood',
            description: 'AB-Positive Platelets',
            priority: 'medium',
            quantity: 4,
            unit: 'units',
        },
        origin: HOSPITALS[0], // Harborview
        destination: HOSPITALS[3], // Virginia Mason
        status: 'pending',
        estArrival: '25 min',
        severity: 6.5,
        vehicleType: 'drone',
    },
];

// Get color for cargo type
export function getCargoColor(type: Cargo['type']): string {
    switch (type) {
        case 'blood':
            return '#ff3131'; // Red
        case 'organs':
            return '#ff006e'; // Magenta
        case 'equipment':
            return '#00f5ff'; // Cyan
        case 'medication':
            return '#7209b7'; // Purple
        default:
            return '#00f5ff';
    }
}

// Get icon for vehicle type
export function getVehicleIcon(type: Shipment['vehicleType']): string {
    switch (type) {
        case 'ambulance':
            return '🚑';
        case 'helicopter':
            return '🚁';
        case 'drone':
            return '🛸';
        default:
            return '🚑';
    }
}
