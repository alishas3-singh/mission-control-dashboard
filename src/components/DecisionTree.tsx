'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface TreeNode {
    id: string;
    question: string;
    threshold?: number;
    feature?: string;
    yesNode?: TreeNode;
    noNode?: TreeNode;
    outcome?: string;
    priority?: 'high' | 'medium' | 'low';
}

// Example decision tree for emergency medical routing
const decisionTree: TreeNode = {
    id: '1',
    question: 'Medical Severity ≥ 7?',
    feature: 'severity',
    threshold: 7,
    yesNode: {
        id: '2',
        question: 'Traffic Congestion < 40%?',
        feature: 'traffic',
        threshold: 40,
        yesNode: {
            id: '4',
            question: '',
            outcome: 'Route A: Direct Path (Fastest)',
            priority: 'high',
        },
        noNode: {
            id: '5',
            question: '',
            outcome: 'Route B: Highway Alternate',
            priority: 'high',
        },
    },
    noNode: {
        id: '3',
        question: 'Weather Impact < 50%?',
        feature: 'weather',
        threshold: 50,
        yesNode: {
            id: '6',
            question: '',
            outcome: 'Route C: Standard Routing',
            priority: 'medium',
        },
        noNode: {
            id: '7',
            question: '',
            outcome: 'Route D: Safe Weather Route',
            priority: 'low',
        },
    },
};

interface NodeComponentProps {
    node: TreeNode;
    depth: number;
}

function NodeComponent({ node, depth }: NodeComponentProps) {
    const [expanded, setExpanded] = useState(depth < 2);

    const isLeaf = !!node.outcome;
    const hasChildren = node.yesNode || node.noNode;

    const getPriorityColor = (priority?: string) => {
        if (priority === 'high') return 'text-[#ff3131]';
        if (priority === 'medium') return 'text-[#00f5ff]';
        return 'text-white/60';
    };

    return (
        <div className="space-y-4">
            {/* Current Node */}
            <div
                className={`relative ${isLeaf
                        ? 'bg-gradient-to-r from-white/5 to-white/10 border-2 border-white/20'
                        : 'bg-[#0a0a0a] border border-white/10'
                    } rounded-2xl p-4 transition-all hover:border-[#00f5ff]/50`}
            >
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        {isLeaf ? (
                            <>
                                <p className="font-mono text-[9px] uppercase tracking-widest text-white/40 mb-1">
                                    Decision Outcome
                                </p>
                                <p className={`text-sm font-bold ${getPriorityColor(node.priority)}`}>
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
                                <div className="w-2 h-2 bg-[#00f5ff] rounded-full" />
                                <span className="font-mono text-[10px] uppercase tracking-wider text-[#00f5ff]">
                                    Yes
                                </span>
                            </div>
                            <NodeComponent node={node.yesNode} depth={depth + 1} />
                        </div>
                    )}

                    {node.noNode && (
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 bg-[#ff3131] rounded-full" />
                                <span className="font-mono text-[10px] uppercase tracking-wider text-[#ff3131]">
                                    No
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

export default function DecisionTree() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8">
            <div className="mb-6">
                <h3 className="text-2xl font-black italic text-white mb-2">
                    Decision Tree Logic
                </h3>
                <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/60">
                    Rule-Based Routing Decisions
                </p>
            </div>

            <NodeComponent node={decisionTree} depth={0} />

            {/* Info footer */}
            <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-xs text-white/50 leading-relaxed">
                    This decision tree shows the rule-based logic paths used by the routing model.
                    Each node represents a decision point, with branches leading to optimal route
                    selections based on medical severity, traffic conditions, and weather impacts.
                </p>
            </div>
        </div>
    );
}
