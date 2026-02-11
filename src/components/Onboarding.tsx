'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, ArrowRight } from 'lucide-react';

interface OnboardingStep {
    title: string;
    description: string;
    target: string;
    placement?: 'top' | 'bottom' | 'left' | 'right';
}

const steps: OnboardingStep[] = [
    {
        title: 'Welcome to Mission Control',
        description: 'This is your command center for emergency medical logistics. We\'ll show you the key features that save lives.',
        target: 'body',
        placement: 'bottom',
    },
    {
        title: 'Life-Cost Index',
        description: 'This prioritizes shipments based on urgency, weather impact, and delivery time. Higher values mean more critical deliveries that need immediate attention.',
        target: '.life-cost-card',
        placement: 'left',
    },
    {
        title: 'AI Route Explanations',
        description: 'Our AI explains WHY each route was chosen, considering weather, traffic, and medical urgency. Full transparency in every decision.',
        target: '.ai-advisor',
        placement: 'left',
    },
    {
        title: 'Measurable Impact',
        description: 'See the real-world difference: lives saved, time saved, and delivery success rates. Every minute matters, and we track every improvement.',
        target: '.impact-metrics',
        placement: 'top',
    },
];

const TOOLTIP_WIDTH = 400;
const TOOLTIP_HEIGHT = 220;
const VIEWPORT_PADDING = 16;

export default function Onboarding() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

    useEffect(() => {
        // Use sessionStorage so tour shows once per session (not permanently hidden)
        const hasSeenTour = sessionStorage.getItem('mission-control-tour-complete');
        if (!hasSeenTour) {
            // Longer delay to ensure all page elements (map, cards, etc.) have rendered
            const timer = setTimeout(() => setIsVisible(true), 2500);
            return () => clearTimeout(timer);
        }
    }, []);

    // Clamp position to keep tooltip within viewport
    const clampPosition = useCallback((top: number, left: number) => {
        const maxLeft = window.innerWidth - TOOLTIP_WIDTH - VIEWPORT_PADDING;
        const maxTop = window.innerHeight - TOOLTIP_HEIGHT - VIEWPORT_PADDING;
        return {
            top: Math.max(VIEWPORT_PADDING, Math.min(top, maxTop)),
            left: Math.max(VIEWPORT_PADDING, Math.min(left, maxLeft)),
        };
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        let retryTimer: NodeJS.Timeout | null = null;

        const updatePosition = () => {
            const step = steps[currentStep];
            if (step.target === 'body') {
                setTooltipPosition(clampPosition(
                    window.innerHeight / 2 - TOOLTIP_HEIGHT / 2,
                    window.innerWidth / 2 - TOOLTIP_WIDTH / 2,
                ));
                return;
            }

            const element = document.querySelector(step.target);
            if (!element) {
                // Element not found yet — retry after a short delay
                retryTimer = setTimeout(updatePosition, 500);
                return;
            }

            const rect = element.getBoundingClientRect();
            const placement = step.placement || 'bottom';

            let top = 0;
            let left = 0;

            switch (placement) {
                case 'top':
                    top = rect.top - TOOLTIP_HEIGHT - 20;
                    left = rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2;
                    break;
                case 'bottom':
                    top = rect.bottom + 20;
                    left = rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2;
                    break;
                case 'left':
                    top = rect.top + rect.height / 2 - TOOLTIP_HEIGHT / 2;
                    left = rect.left - TOOLTIP_WIDTH - 20;
                    break;
                case 'right':
                    top = rect.top + rect.height / 2 - TOOLTIP_HEIGHT / 2;
                    left = rect.right + 20;
                    break;
            }

            setTooltipPosition(clampPosition(top, left));
        };

        updatePosition();
        window.addEventListener('resize', updatePosition);
        return () => {
            window.removeEventListener('resize', updatePosition);
            if (retryTimer) clearTimeout(retryTimer);
        };
    }, [currentStep, isVisible, clampPosition]);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleComplete();
        }
    };

    const handleSkip = () => {
        handleComplete();
    };

    const handleComplete = () => {
        sessionStorage.setItem('mission-control-tour-complete', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    const step = steps[currentStep];

    return (
        <>
            {/* Dark overlay — clickable to dismiss */}
            <div
                className="fixed inset-0 bg-black/70 z-[9998]"
                onClick={handleSkip}
            />

            {/* Tooltip */}
            <div
                className="fixed z-[9999] w-[400px] bg-[#1a1a1a] border border-[#00f5ff]/30 rounded-2xl p-6 shadow-2xl shadow-[#00f5ff]/20 transition-all duration-300 ease-out"
                style={{
                    top: `${tooltipPosition.top}px`,
                    left: `${tooltipPosition.left}px`,
                }}
            >
                {/* Close button */}
                <button
                    onClick={handleSkip}
                    className="absolute top-4 right-4 text-white/40 hover:text-white/80 transition-colors"
                    aria-label="Skip tour"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Content */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="text-xs font-mono uppercase tracking-widest text-[#00f5ff]">
                            Step {currentStep + 1} of {steps.length}
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                    <p className="text-sm text-white/70 leading-relaxed">{step.description}</p>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={handleSkip}
                        className="text-sm text-white/50 hover:text-white/80 transition-colors font-medium"
                    >
                        Skip Tour
                    </button>
                    <button
                        onClick={handleNext}
                        className="px-6 py-2 bg-[#00f5ff] text-[#0a0a0a] font-bold rounded-xl hover:bg-[#00f5ff]/90 transition-all flex items-center gap-2"
                    >
                        {currentStep < steps.length - 1 ? 'Next' : 'Get Started'}
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                {/* Progress dots */}
                <div className="flex items-center justify-center gap-2 mt-4">
                    {steps.map((_, index) => (
                        <div
                            key={index}
                            className={`h-1.5 rounded-full transition-all ${index === currentStep
                                ? 'w-6 bg-[#00f5ff]'
                                : index < currentStep
                                    ? 'w-1.5 bg-[#00f5ff]/50'
                                    : 'w-1.5 bg-white/20'
                                }`}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}
