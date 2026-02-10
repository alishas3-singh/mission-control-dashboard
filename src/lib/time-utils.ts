// utils/time.ts - Time-based utilities

export function isDaytime(): boolean {
    const hour = new Date().getHours();
    // Daytime is between 6 AM and 6 PM
    return hour >= 6 && hour < 18;
}

export function getMapTileUrl(): string {
    // Always use light CartoDB Voyager tiles for a white background (better visibility)
    return 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
}

export function getMapAttribution(): string {
    return '&copy; <a href="https://carto.com/">CartoDB</a>';
}
