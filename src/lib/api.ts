// API utility functions for weather and traffic data

interface WeatherData {
    temperature: number;
    weathercode: number;
    impactFactor: number;
}

interface TrafficData {
    currentSpeed: number;
    freeFlowSpeed: number;
    congestionLevel: number;
}

/**
 * Fetch current weather data from Open-Meteo API
 * Location: Seattle, WA (47.6062, -122.3321)
 */
export async function fetchWeather(): Promise<WeatherData> {
    // Check if mock data mode is enabled (for offline demos)
    const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

    if (useMockData) {
        console.log('[DEMO MODE] Using mock weather data');
        return {
            temperature: 15,
            weathercode: 61, // Rain
            impactFactor: 0.8, // High impact from precipitation
        };
    }

    try {
        const response = await fetch(
            'https://api.open-meteo.com/v1/forecast?latitude=47.6062&longitude=-122.3321&current=temperature_2m,weathercode'
        );

        if (!response.ok) {
            throw new Error(`Weather API error: ${response.status}`);
        }

        const data = await response.json();
        const weathercode = data.current.weathercode;

        // Calculate weather impact factor (0-1 scale)
        // Higher values = worse conditions
        let impactFactor = 0.3; // Default moderate

        // 0: Clear sky, 1-3: Mainly clear, 45-48: Fog, 51-99: Precipitation/Storms
        if (weathercode === 0 || weathercode <= 3) {
            impactFactor = 0.1; // Minimal impact
        } else if (weathercode >= 45 && weathercode <= 48) {
            impactFactor = 0.6; // Fog - significant impact
        } else if (weathercode >= 51) {
            impactFactor = 0.8; // Rain/snow/storms - high impact
        }

        return {
            temperature: data.current.temperature_2m,
            weathercode,
            impactFactor,
        };
    } catch (error) {
        console.error('Failed to fetch weather data:', error);
        return {
            temperature: 15,
            weathercode: 0,
            impactFactor: 0.3,
        };
    }
}

/**
 * Fetch traffic data from TomTom API
 * Requires NEXT_PUBLIC_TOMTOM_KEY in environment
 */
export async function fetchTraffic(lat: number = 47.6062, lon: number = -122.3321): Promise<TrafficData> {
    const apiKey = process.env.NEXT_PUBLIC_TOMTOM_KEY;
    const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

    // Mock data mode for offline demos
    if (useMockData) {
        console.log('[DEMO MODE] Using mock traffic data');
        return {
            currentSpeed: 45,
            freeFlowSpeed: 60,
            congestionLevel: 0.25, // Moderate traffic
        };
    }

    if (!apiKey || apiKey === 'your_tomtom_api_key_here' || apiKey === 'demo_mode') {
        console.warn('TomTom API key not configured, using mock data');
        return {
            currentSpeed: 45,
            freeFlowSpeed: 60,
            congestionLevel: 0.25,
        };
    }

    try {
        const response = await fetch(
            `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?point=${lat},${lon}&key=${apiKey}`
        );

        if (!response.ok) {
            throw new Error(`TomTom API error: ${response.status}`);
        }

        const data = await response.json();
        const currentSpeed = data.flowSegmentData?.currentSpeed || 50;
        const freeFlowSpeed = data.flowSegmentData?.freeFlowSpeed || 60;
        const congestionLevel = 1 - (currentSpeed / freeFlowSpeed);

        return {
            currentSpeed,
            freeFlowSpeed,
            congestionLevel: Math.max(0, Math.min(1, congestionLevel)),
        };
    } catch (error) {
        console.error('Failed to fetch traffic data:', error);
        return {
            currentSpeed: 45,
            freeFlowSpeed: 60,
            congestionLevel: 0.25,
        };
    }
}

/**
 * Calculate Life-Cost Index
 * Formula: LC = (Time × Weather) + Severity
 */
export function calculateLifeCost(
    time: number,
    weatherImpact: number,
    severity: number
): number {
    return (time * weatherImpact) + severity;
}

/**
 * Get weather description from weathercode
 */
export function getWeatherDescription(code: number): string {
    if (code === 0) return 'Clear sky';
    if (code <= 3) return 'Partly cloudy';
    if (code >= 45 && code <= 48) return 'Foggy';
    if (code >= 51 && code <= 55) return 'Drizzle';
    if (code >= 61 && code <= 65) return 'Rain';
    if (code >= 71 && code <= 77) return 'Snow';
    if (code >= 80) return 'Rain showers';
    if (code >= 95) return 'Thunderstorm';
    return 'Unknown';
}
