'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight, Zap } from 'lucide-react';

interface TreeNode {
    id: string;
    question: string;
    liveValue?: string;
    threshold?: number;
    feature?: string;
    yesNode?: TreeNode;
    noNode?: TreeNode;
    outcome?: string;
    priority?: 'high' | 'medium' | 'low';
    isActivePath?: boolean;
    conditionMet?: boolean;
}

interface DecisionTreeProps {
    weatherImpact?: number;
    trafficCongestion?: number;
    severity?: number;
}

// Build a dynamic decision tree based on live data
function buildDecisionTree(weather: number, traffic: number, severity: number): TreeNode {
    const severityMet = severity >= 7;
    const trafficLow = traffic < 0.4;
    const weatherGood = weather < 0.5;
    const trafficVeryHigh = traffic >= 0.7;
    const weatherSevere = weather >= 0.7;

    return {
        id: '1',
        question: 'Medical Severity ≥ 7?',
        feature: 'severity',
        threshold: 7,
        liveValue: `Current: ${severity.toFixed(1)}`,
        isActivePath: true,
        conditionMet: severityMet,
        yesNode: {
            id: '2',
            question: 'Traffic Congestion < 40%?',
            feature: 'traffic',
            threshold: 40,
            liveValue: `Current: ${(traffic * 100).toFixed(0)}%`,
            isActivePath: severityMet,
            conditionMet: trafficLow,
            yesNode: {
                id: '4',
                question: 'Weather Impact < 50%?',
                feature: 'weather',
                threshold: 50,
                liveValue: `Current: ${(weather * 100).toFixed(0)}%`,
                isActivePath: severityMet && trafficLow,
                conditionMet: weatherGood,
                yesNode: {
                    id: '8',
                    question: '',
                    outcome: '🚗 Highway Express — I-5 Direct Route',
                    priority: 'high',
                    isActivePath: severityMet && trafficLow && weatherGood,
                },
                noNode: {
                    id: '9',
                    question: '',
                    outcome: '🚑 Sheltered Arterial — Weather-Protected Road',
                    priority: 'high',
                    isActivePath: severityMet && trafficLow && !weatherGood,
                },
            },
            noNode: {
                id: '5',
                question: 'Traffic ≥ 70% (Gridlock)?',
                feature: 'traffic',
                threshold: 70,
                liveValue: `Current: ${(traffic * 100).toFixed(0)}%`,
                isActivePath: severityMet && !trafficLow,
                conditionMet: trafficVeryHigh,
                yesNode: {
                    id: '10',
                    question: '',
                    outcome: '🚗 Emergency Lane — Clear-Path Protocol',
                    priority: 'high',
                    isActivePath: severityMet && !trafficLow && trafficVeryHigh,
                },
                noNode: {
                    id: '11',
                    question: '',
                    outcome: '🚑 Highway Bypass — SR-99 Alternate Route',
                    priority: 'high',
                    isActivePath: severityMet && !trafficLow && !trafficVeryHigh,
                },
            },
        },
        noNode: {
            id: '3',
            question: 'Weather Impact < 50%?',
            feature: 'weather',
            threshold: 50,
            liveValue: `Current: ${(weather * 100).toFixed(0)}%`,
            isActivePath: !severityMet,
            conditionMet: weatherGood,
            yesNode: {
                id: '6',
                question: 'Traffic Congestion < 40%?',
                feature: 'traffic',
                threshold: 40,
                liveValue: `Current: ${(traffic * 100).toFixed(0)}%`,
                isActivePath: !severityMet && weatherGood,
                conditionMet: trafficLow,
                yesNode: {
                    id: '12',
                    question: '',
                    outcome: '🚗 Standard Road — Primary Arterial Route',
                    priority: 'medium',
                    isActivePath: !severityMet && weatherGood && trafficLow,
                },
                noNode: {
                    id: '13',
                    question: '',
                    outcome: '🚑 Congestion Bypass — Side Street Reroute',
                    priority: 'medium',
                    isActivePath: !severityMet && weatherGood && !trafficLow,
                },
            },
            noNode: {
                id: '7',
                question: 'Weather ≥ 70% (Severe)?',
                feature: 'weather',
                threshold: 70,
                liveValue: `Current: ${(weather * 100).toFixed(0)}%`,
                isActivePath: !severityMet && !weatherGood,
                conditionMet: weatherSevere,
                yesNode: {
                    id: '14',
                    question: '',
                    outcome: '🚑 Weather-Safe — Low-Speed Urban Route',
                    priority: 'low',
                    isActivePath: !severityMet && !weatherGood && weatherSevere,
                },
                noNode: {
                    id: '15',
                    question: '',
                    outcome: '🚑 Standard Road — Moderate Conditions Route',
                    priority: 'medium',
                    isActivePath: !severityMet && !weatherGood && !weatherSevere,
                },
            },
        },
    };
}

interface NodeComponentProps {
    node: TreeNode;
    depth: number;
}

function NodeComponent({ node, depth }: NodeComponentProps) {
    const [expanded, setExpanded] = useState(depth < 3);

    const isLeaf = !!node.outcome;
    const hasChildren = node.yesNode || node.noNode;
    const isActive = node.isActivePath;

    const getPriorityColor = (priority?: string) => {
        if (priority === 'high') return 'text-[#ff3131]';
        if (priority === 'medium') return 'text-[#00f5ff]';
        return 'text-white/60';
    };

    const activeBorder = isActive
        ? 'border-[#00f5ff]/60 shadow-[0_0_15px_rgba(0,245,255,0.15)]'
        : 'border-white/10';

    const activeLeafBorder = isActive
        ? 'border-[#00f5ff] shadow-[0_0_20px_rgba(0,245,255,0.25)] bg-gradient-to-r from-[#00f5ff]/10 to-[#00f5ff]/5'
        : 'border-white/20 bg-gradient-to-r from-white/5 to-white/10';

    return (
        <div className="space-y-4">
            {/* Current Node */}
            <div
                className={`relative ${isLeaf
                    ? `${activeLeafBorder} border-2`
                    : `bg-[#0a0a0a] border ${activeBorder}`
                    } rounded-2xl p-4 transition-all hover:border-[#00f5ff]/50`}
            >
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        {isLeaf ? (
                            <>
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="font-mono text-[9px] uppercase tracking-widest text-white/40">
                                        Decision Outcome
                                    </p>
                                    {isActive && (
                                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#00f5ff]/10 text-[#00f5ff] font-mono text-[8px] uppercase tracking-wider animate-pulse">
                                            <Zap size={8} /> Active
                                        </span>
                                    )}
                                </div>
                                <p className={`text-sm font-bold ${isActive ? 'text-[#00f5ff]' : getPriorityColor(node.priority)}`}>
                                    {node.outcome}
                                </p>
                                {node.priority && (
                                    <span
                                        className={`inline-block mt-2 px-3 py-1 rounded-full font-mono text-[9px] uppercase tracking-wider ${node.priority === 'high'
                                            ? 'bg-[#ff3131]/10 text-[#ff3131]'
                                            : node.priority === 'medium'
                                                ? 'bg-[#00f5ff]/10 text-[#00f5ff]'
                                                : 'bg-white/5 text-white/60'
                                            }`}
                                    >
                                        {node.priority} Priority
                                    </span>
                                )}
                            </>
                        ) : (
                            <>
                                <p className="font-mono text-[9px] uppercase tracking-widest text-[#00f5ff] mb-1">
                                    Decision Rule
                                </p>
                                <p className="text-sm font-semibold text-white">{node.question}</p>
                                {node.liveValue && (
                                    <p className={`font-mono text-[10px] mt-1 ${isActive ? 'text-[#00f5ff]' : 'text-white/40'
                                        }`}>
                                        ⚡ {node.liveValue}
                                    </p>
                                )}
                            </>
                        )}
                    </div>

                    {hasChildren && (
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="flex-shrink-0 text-white/40 hover:text-[#00f5ff] transition-colors"
                        >
                            {expanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                        </button>
                    )}
                </div>
            </div>

            {/* Children */}
            {expanded && hasChildren && (
                <div className="ml-6 pl-6 border-l-2 border-white/10 space-y-6">
                    {node.yesNode && (
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className={`w-2 h-2 rounded-full ${node.conditionMet && isActive ? 'bg-[#00f5ff] animate-pulse' : 'bg-[#00f5ff]/40'}`} />
                                <span className={`font-mono text-[10px] uppercase tracking-wider ${node.conditionMet && isActive ? 'text-[#00f5ff]' : 'text-[#00f5ff]/40'}`}>
                                    Yes {node.conditionMet && isActive ? '←' : ''}
                                </span>
                            </div>
                            <NodeComponent node={node.yesNode} depth={depth + 1} />
                        </div>
                    )}

                    {node.noNode && (
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className={`w-2 h-2 rounded-full ${!node.conditionMet && isActive ? 'bg-[#ff3131] animate-pulse' : 'bg-[#ff3131]/40'}`} />
                                <span className={`font-mono text-[10px] uppercase tracking-wider ${!node.conditionMet && isActive ? 'text-[#ff3131]' : 'text-[#ff3131]/40'}`}>
                                    No {!node.conditionMet && isActive ? '←' : ''}
                                </span>
                            </div>
                            <NodeComponent node={node.noNode} depth={depth + 1} />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default function DecisionTree({ weatherImpact = 0.3, trafficCongestion = 0.25, severity = 8.5 }: DecisionTreeProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const tree = buildDecisionTree(weatherImpact, trafficCongestion, severity);

    return (
        <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8">
            <div className="mb-6">
                <h3 className="text-2xl font-black italic text-white mb-2">
                    Decision Tree Logic
                </h3>
                <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/60">
                    Live Rule-Based Routing Decisions
                </p>
                <div className="flex items-center gap-2 mt-2">
                    <div className="w-2 h-2 bg-[#00f5ff] rounded-full animate-pulse" />
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#00f5ff]">
                        Evaluating Live Data
                    </span>
                </div>
            </div>

            {/* Live Data Summary */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-white/5 rounded-xl p-3 text-center">
                    <p className="font-mono text-[8px] uppercase tracking-wider text-white/50 mb-1">Severity</p>
                    <p className={`text-lg font-black ${severity >= 7 ? 'text-[#ff3131]' : 'text-white'}`}>
                        {severity.toFixed(1)}
                    </p>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-center">
                    <p className="font-mono text-[8px] uppercase tracking-wider text-white/50 mb-1">Traffic</p>
                    <p className={`text-lg font-black ${trafficCongestion >= 0.6 ? 'text-[#ff3131]' : trafficCongestion >= 0.3 ? 'text-orange-400' : 'text-[#22c55e]'}`}>
                        {(trafficCongestion * 100).toFixed(0)}%
                    </p>
                </div>
                <div className="bg-white/5 rounded-xl p-3 text-center">
                    <p className="font-mono text-[8px] uppercase tracking-wider text-white/50 mb-1">Weather</p>
                    <p className={`text-lg font-black ${weatherImpact >= 0.6 ? 'text-[#ff3131]' : weatherImpact >= 0.3 ? 'text-orange-400' : 'text-[#22c55e]'}`}>
                        {(weatherImpact * 100).toFixed(0)}%
                    </p>
                </div>
            </div>

            <NodeComponent node={tree} depth={0} />

            {/* Info footer */}
            <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-xs text-white/50 leading-relaxed">
                    This decision tree evaluates live weather, traffic, and severity data to determine
                    the optimal routing strategy. The highlighted path shows the current active decision
                    based on real-time conditions. Nodes update automatically as conditions change.
                </p>
            </div>
        </div>
    );
}
