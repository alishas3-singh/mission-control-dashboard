'use client';

import { useState } from 'react';
import { Settings as SettingsIcon, Key, CheckCircle, AlertCircle } from 'lucide-react';

export default function SettingsPage() {
    const [tomtomKey, setTomtomKey] = useState('');
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        localStorage.setItem('tomtom_api_key', tomtomKey);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const handleTest = async () => {
        if (!tomtomKey) {
            alert('Please enter a TomTom API key first');
            return;
        }

        try {
            const response = await fetch(
                `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?point=47.6062,-122.3321&key=${tomtomKey}`
            );

            if (response.ok) {
                alert('✅ TomTom API Key is valid!');
            } else {
                alert('❌ Invalid API key or request failed');
            }
        } catch (error) {
            alert('❌ Failed to test API key');
        }
    };

    return (
        <main className="min-h-screen bg-[#0a0a0a] pt-16 p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <header className="border-b border-white/10 pb-6">
                    <div className="flex items-center gap-4 mb-3">
                        <SettingsIcon className="w-10 h-10 text-[#00f5ff]" />
                        <h1 className="text-4xl font-black italic text-white">
                            Settings
                        </h1>
                    </div>
                    <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/60">
                        API Configuration // Service Integration
                    </p>
                </header>

                {/* TomTom API Configuration */}
                <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 space-y-6">
                    <div className="flex items-start gap-4">
                        <Key className="w-6 h-6 text-[#00f5ff] flex-shrink-0 mt-1" />
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-white mb-2">
                                TomTom API Key
                            </h3>
                            <p className="text-sm text-white/60 mb-4">
                                Configure your TomTom API key for real-time traffic data integration.
                            </p>

                            <div className="space-y-4">
                                <div>
                                    <label className="block font-mono text-[10px] uppercase tracking-wider text-white/70 mb-2">
                                        API Key
                                    </label>
                                    <input
                                        type="password"
                                        value={tomtomKey}
                                        onChange={(e) => setTomtomKey(e.target.value)}
                                        placeholder="Enter your TomTom API key"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#00f5ff]/50 transition-colors"
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={handleSave}
                                        className="px-6 py-3 bg-[#00f5ff] text-black font-bold rounded-xl hover:bg-[#00f5ff]/80 transition-colors"
                                    >
                                        Save Configuration
                                    </button>
                                    <button
                                        onClick={handleTest}
                                        className="px-6 py-3 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:border-[#00f5ff]/50 transition-colors"
                                    >
                                        Test Connection
                                    </button>
                                </div>

                                {saved && (
                                    <div className="flex items-center gap-2 text-[#00f5ff]">
                                        <CheckCircle size={16} />
                                        <span className="text-sm font-medium">Configuration saved</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Environment Variable Instructions */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                    <div className="flex items-start gap-4">
                        <AlertCircle className="w-6 h-6 text-[#00f5ff] flex-shrink-0 mt-1" />
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-white mb-2">
                                Environment Variable Setup
                            </h3>
                            <p className="text-sm text-white/70 mb-4">
                                To use TomTom traffic data, you need to configure the API key as an environment variable.
                            </p>

                            <div className="bg-[#0a0a0a] rounded-xl p-4 font-mono text-xs text-white/80 mb-4">
                                <p className="text-white/50 mb-1"># .env.local</p>
                                <p>NEXT_PUBLIC_TOMTOM_KEY=your_tomtom_api_key_here</p>
                            </div>

                            <div className="space-y-2 text-sm text-white/60">
                                <p><strong className="text-white">Step 1:</strong> Get your API key from{' '}
                                    <a
                                        href="https://developer.tomtom.com/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#00f5ff] hover:underline"
                                    >
                                        TomTom Developer Portal
                                    </a>
                                </p>
                                <p><strong className="text-white">Step 2:</strong> Create <code className="px-2 py-0.5 bg-white/10 rounded">.env.local</code> in project root</p>
                                <p><strong className="text-white">Step 3:</strong> Add the variable and restart dev server</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Vercel Deployment Instructions */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                    <h3 className="text-lg font-bold text-white mb-3">
                        Deployment on Vercel
                    </h3>
                    <ol className="space-y-2 text-sm text-white/70 list-decimal list-inside">
                        <li>Go to your Vercel Dashboard → Project Settings</li>
                        <li>Navigate to Environment Variables section</li>
                        <li>Add new variable: <code className="px-2 py-0.5 bg-white/10 rounded text-white">NEXT_PUBLIC_TOMTOM_KEY</code></li>
                        <li>Paste your TomTom API key as the value</li>
                        <li>Redeploy your application</li>
                    </ol>
                </div>
            </div>
        </main>
    );
}
