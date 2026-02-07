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
}

/**
 * Generate AI explanation for routing decision
 * Uses OpenAI GPT to create natural language explanation
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
            dangerouslyAllowBrowser: true, // For client-side usage
        });

        const prompt = `You are an emergency medical logistics AI advisor. Analyze this critical delivery:

SHIPMENT DETAILS:
- Medical cargo: ${input.cargoDescription}
- Severity: ${input.severity}/10
- Priority: ${input.priority}
- Route: ${input.origin} → ${input.destination}
- Vehicle: ${input.vehicleType}
- ETA: ${input.estArrival}

CURRENT CONDITIONS:
- Weather impact: ${(input.weatherImpact * 100).toFixed(0)}%
- Traffic congestion: ${(input.congestionLevel * 100).toFixed(0)}%

Provide a 2-3 sentence explanation that a paramedic or dispatcher would understand. Focus on WHY this route was chosen and what factors influenced the decision. Be concise and professional.`;

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
 */
function generateFallbackExplanation(input: RouteExplanationInput): string {
    const severityLevel = input.severity >= 9 ? 'critical' : input.severity >= 7 ? 'high' : 'moderate';
    const weatherCondition = input.weatherImpact > 0.6 ? 'adverse weather conditions' : input.weatherImpact > 0.3 ? 'moderate weather' : 'clear conditions';
    const trafficCondition = input.congestionLevel > 0.5 ? 'heavy traffic' : input.congestionLevel > 0.25 ? 'moderate traffic' : 'light traffic';

    return `This ${input.priority} priority delivery requires immediate attention due to ${severityLevel} medical severity (${input.severity}/10). The ${input.vehicleType} route from ${input.origin} to ${input.destination} was selected considering current ${weatherCondition} and ${trafficCondition}, with an estimated arrival time of ${input.estArrival}. Route optimization prioritizes patient outcome while managing environmental factors.`;
}
