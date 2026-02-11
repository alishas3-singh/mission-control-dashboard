import OpenAI from 'openai';

interface RouteExplanationInput {
    cargoDescription: string;
    severity: number;
    priority: string;
    origin: string;
    destination: string;
    vehicleType: string;
    estArrival: string;
    weatherImpact: number;
    congestionLevel: number;
    weatherDescription?: string;
}

/**
 * Determine the recommended road route strategy based on live conditions
 */
function getRouteStrategy(weather: number, traffic: number, severity: number): {
    routeName: string;
    reasoning: string;
    urgency: 'critical' | 'high' | 'moderate';
} {
    const isHighTraffic = traffic >= 0.6;
    const isModerateTraffic = traffic >= 0.3;
    const isBadWeather = weather >= 0.6;
    const isModerateWeather = weather >= 0.3;
    const isCritical = severity >= 9;
    const isHighSeverity = severity >= 7;

    // Critical severity + high traffic → Emergency lane protocol
    if (isCritical && isHighTraffic) {
        return {
            routeName: 'Emergency Lane Clear-Path Protocol via arterial roads',
            reasoning: 'Gridlock conditions detected. Activating emergency vehicle priority lanes on primary arterials to bypass congestion.',
            urgency: 'critical',
        };
    }

    // Critical severity + bad weather → Sheltered road route
    if (isCritical && isBadWeather) {
        return {
            routeName: 'Sheltered Arterial Route avoiding exposed highways',
            reasoning: 'Severe weather detected. Routing through covered/sheltered urban arterials to maintain safe transport speed.',
            urgency: 'critical',
        };
    }

    // Critical severity + clear conditions → Highway express
    if (isCritical) {
        return {
            routeName: 'Highway Express via I-5 Direct Route',
            reasoning: 'Conditions are favorable for fastest highway route. Using I-5 corridor for maximum speed.',
            urgency: 'critical',
        };
    }

    // High severity + high traffic → Highway bypass
    if (isHighSeverity && isHighTraffic) {
        return {
            routeName: 'Highway Bypass via I-5 / SR-99 alternate',
            reasoning: 'Heavy traffic on primary route. Rerouting to alternate highway corridor to reduce delivery time.',
            urgency: 'high',
        };
    }

    // High severity + moderate traffic + bad weather → Sheltered alternate
    if (isHighSeverity && isModerateTraffic && isBadWeather) {
        return {
            routeName: 'Sheltered Alternate via secondary arterials',
            reasoning: 'Moderate congestion combined with adverse weather. Using secondary arterial roads that offer better shelter and less traffic.',
            urgency: 'high',
        };
    }

    // High severity + good conditions → Direct primary road
    if (isHighSeverity) {
        return {
            routeName: 'Primary Road Direct Route',
            reasoning: 'Conditions are manageable. Taking the most direct primary road route for timely delivery.',
            urgency: 'high',
        };
    }

    // Moderate severity + high traffic → Congestion avoidance
    if (isHighTraffic) {
        return {
            routeName: 'Congestion Avoidance via side streets and arterials',
            reasoning: 'High traffic detected on main corridors. Diverting to parallel arterial roads to maintain reasonable delivery time.',
            urgency: 'moderate',
        };
    }

    // Moderate severity + bad weather → Weather-safe road
    if (isBadWeather) {
        return {
            routeName: 'Weather-Safe Route via lower-speed urban roads',
            reasoning: 'Adverse weather conditions warrant reduced-speed urban routing for safe cargo delivery.',
            urgency: 'moderate',
        };
    }

    // Moderate severity + moderate conditions → Standard with monitoring
    if (isModerateTraffic || isModerateWeather) {
        return {
            routeName: 'Standard Road Route with active monitoring',
            reasoning: 'Conditions are moderate. Using standard road route with real-time monitoring for any changes.',
            urgency: 'moderate',
        };
    }

    // All clear → Direct standard route
    return {
        routeName: 'Direct Standard Route via primary roads',
        reasoning: 'All conditions clear. Taking the most efficient direct road route.',
        urgency: 'moderate',
    };
}

/**
 * Generate AI explanation for routing decision
 * Uses OpenAI GPT to create natural language explanation
 * ROAD-ONLY: All recommendations are restricted to road-based routes
 */
export async function generateRouteExplanation(input: RouteExplanationInput): Promise<string> {
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

    // Fallback if no API key configured
    if (!apiKey || apiKey === 'your_openai_api_key_here') {
        return generateFallbackExplanation(input);
    }

    try {
        const openai = new OpenAI({
            apiKey: apiKey,
            dangerouslyAllowBrowser: true,
        });

        const strategy = getRouteStrategy(input.weatherImpact, input.congestionLevel, input.severity);
        const weatherDesc = input.weatherDescription || (input.weatherImpact > 0.6 ? 'adverse weather' : input.weatherImpact > 0.3 ? 'moderate weather' : 'clear conditions');

        const prompt = `You are an emergency medical logistics AI advisor specializing in ROAD-BASED routing only. You must NEVER suggest helicopters, drones, boats, or any non-road transportation. Only recommend alternate ROAD routes (highways, arterials, side streets, etc.).

SHIPMENT DETAILS:
- Medical cargo: ${input.cargoDescription}
- Severity: ${input.severity}/10
- Priority: ${input.priority}
- Route: ${input.origin} → ${input.destination}
- Vehicle: Ambulance (road transport)
- ETA: ${input.estArrival}

LIVE CONDITIONS:
- Weather: ${weatherDesc} (impact: ${(input.weatherImpact * 100).toFixed(0)}%)
- Traffic congestion: ${(input.congestionLevel * 100).toFixed(0)}%

RECOMMENDED STRATEGY: ${strategy.routeName}
REASONING: ${strategy.reasoning}

Based on these LIVE conditions, provide a 2-3 sentence explanation for a dispatcher. Explain WHY this specific road route was chosen over alternatives, referencing the actual weather and traffic numbers. Be concise and professional. Only mention road-based routing options.`;

        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 150,
            temperature: 0.7,
        });

        return completion.choices[0]?.message?.content || generateFallbackExplanation(input);
    } catch (error) {
        console.error('OpenAI API error:', error);
        return generateFallbackExplanation(input);
    }
}

/**
 * Fallback explanation when OpenAI is unavailable
 * Uses threshold-driven logic to produce dynamic, road-only recommendations
 */
function generateFallbackExplanation(input: RouteExplanationInput): string {
    const strategy = getRouteStrategy(input.weatherImpact, input.congestionLevel, input.severity);
    const weatherDesc = input.weatherDescription || (input.weatherImpact > 0.6 ? 'adverse weather' : input.weatherImpact > 0.3 ? 'moderate weather' : 'clear conditions');
    const trafficDesc = input.congestionLevel > 0.6 ? 'heavy traffic' : input.congestionLevel > 0.3 ? 'moderate traffic' : 'light traffic';

    return `ROUTE: ${strategy.routeName}. ${strategy.reasoning} Current conditions: ${weatherDesc} (${(input.weatherImpact * 100).toFixed(0)}% impact) and ${trafficDesc} (${(input.congestionLevel * 100).toFixed(0)}% congestion) on the ${input.origin} → ${input.destination} corridor. ETA: ${input.estArrival}.`;
}

export { getRouteStrategy };
