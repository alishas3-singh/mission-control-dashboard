import Link from 'next/link';
import { MapPin, Brain, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 pt-24">
      <div className="max-w-5xl mx-auto text-center">
        <div className="mb-12">
          <h1 className="text-6xl font-black italic tracking-tight text-white mb-4">
            MISSION CONTROL
          </h1>
          <p className="font-mono text-xs tracking-[0.4em] uppercase text-[#00f5ff] mb-4">
            Emergency Medical Logistics Dashboard
          </p>
          <p className="text-white/60 max-w-2xl mx-auto">
            High-fidelity command center for emergency medical routing with real-time weather,
            traffic integration, and interpretable AI decision support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            href="/dispatch"
            className="group bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 hover:border-[#00f5ff]/50 transition-all"
          >
            <MapPin className="w-12 h-12 text-[#00f5ff] mb-4 mx-auto group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold text-white mb-2">Live Dispatch</h3>
            <p className="text-sm text-white/60 mb-4">
              Interactive map with real-time weather and traffic data integration
            </p>
            <div className="flex items-center justify-center text-[#00f5ff] text-sm font-medium">
              View Map <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/audit"
            className="group bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 hover:border-[#00f5ff]/50 transition-all"
          >
            <Brain className="w-12 h-12 text-[#00f5ff] mb-4 mx-auto group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold text-white mb-2">Clinical Audit</h3>
            <p className="text-sm text-white/60 mb-4">
              Interpretable AI with SHAP analysis and decision tree visualization
            </p>
            <div className="flex items-center justify-center text-[#00f5ff] text-sm font-medium">
              View AI <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        <div className="flex items-center justify-center gap-2 text-white/40 text-xs">
          <div className="w-2 h-2 bg-[#00f5ff] rounded-full animate-pulse" />
          <span className="font-mono uppercase tracking-widest">System Active</span>
        </div>
      </div>
    </main>
  );
}
