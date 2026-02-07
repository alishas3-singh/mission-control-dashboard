import Link from 'next/link';
import { MapPin, Brain, ArrowRight, Heart, Clock, Zap } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 pt-24">
      <div className="max-w-5xl mx-auto text-center">
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-7xl font-black italic tracking-tight text-white mb-6 leading-tight">
            Every Minute Matters.<br />
            Every Life Counts.
          </h1>
          <p className="font-mono text-xs tracking-[0.4em] uppercase text-[#00f5ff] mb-6">
            Emergency Medical Logistics Dashboard
          </p>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed mb-4">
            AI-powered emergency medical logistics that <span className="text-[#00f5ff] font-bold">reduces delivery time by 18%</span>.
          </p>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            When a hospital needs a donor heart, our system ensures it arrives in time.
          </p>
        </div>

        {/* Impact Statistics Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 max-w-3xl mx-auto">
          <div className="bg-[#00f5ff]/5 border border-[#00f5ff]/20 rounded-2xl p-4">
            <Zap className="w-6 h-6 text-[#00f5ff] mx-auto mb-2" />
            <div className="text-3xl font-black text-[#00f5ff] mb-1">18%</div>
            <div className="text-xs font-mono uppercase tracking-wider text-white/60">Faster Delivery</div>
          </div>
          <div className="bg-[#00f5ff]/5 border border-[#00f5ff]/20 rounded-2xl p-4">
            <Heart className="w-6 h-6 text-[#00f5ff] mx-auto mb-2" />
            <div className="text-3xl font-black text-[#00f5ff] mb-1">4.5</div>
            <div className="text-xs font-mono uppercase tracking-wider text-white/60">Lives Saved</div>
          </div>
          <div className="bg-[#00f5ff]/5 border border-[#00f5ff]/20 rounded-2xl p-4">
            <Brain className="w-6 h-6 text-[#00f5ff] mx-auto mb-2" />
            <div className="text-3xl font-black text-[#00f5ff] mb-1">Real-Time</div>
            <div className="text-xs font-mono uppercase tracking-wider text-white/60">AI Analysis</div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <Link
            href="/dispatch"
            className="group bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 hover:border-[#00f5ff]/50 transition-all hover:shadow-[0_0_30px_rgba(0,245,255,0.1)]"
          >
            <MapPin className="w-12 h-12 text-[#00f5ff] mb-4 mx-auto group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-bold text-white mb-3">Live Dispatch</h3>
            <p className="text-sm text-white/70 mb-2">
              Optimize routes in real-time with weather + traffic integration
            </p>
            <p className="text-xs text-[#00f5ff]/80 mb-4 flex items-center justify-center gap-2">
              <span className="text-lg">💡</span> Life-Cost Index prioritizes critical deliveries
            </p>
            <div className="flex items-center justify-center text-[#00f5ff] text-sm font-medium">
              View Live Map <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/audit"
            className="group bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 hover:border-[#00f5ff]/50 transition-all hover:shadow-[0_0_30px_rgba(0,245,255,0.1)]"
          >
            <Brain className="w-12 h-12 text-[#00f5ff] mb-4 mx-auto group-hover:scale-110 transition-transform" />
            <h3 className="text-2xl font-bold text-white mb-3">Clinical Audit</h3>
            <p className="text-sm text-white/70 mb-2">
              Understand WHY the AI chose each route
            </p>
            <p className="text-xs text-[#00f5ff]/80 mb-4 flex items-center justify-center gap-2">
              <span className="text-lg">🔍</span> Full transparency with SHAP analysis
            </p>
            <div className="flex items-center justify-center text-[#00f5ff] text-sm font-medium">
              View AI Insights <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Call-to-Action */}
        <div className="mb-8">
          <p className="text-white/70 mb-4 text-lg">Ready to see it in action?</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dispatch"
              className="px-8 py-4 bg-[#00f5ff] text-[#0a0a0a] font-bold rounded-2xl hover:bg-[#00f5ff]/90 transition-all hover:scale-105 flex items-center gap-2 shadow-lg shadow-[#00f5ff]/20"
            >
              View Live Demo <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/audit"
              className="px-8 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-2xl hover:border-[#00f5ff]/50 transition-all hover:bg-white/10 flex items-center gap-2"
            >
              Learn About Impact <Brain className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* System Status */}
        <div className="flex items-center justify-center gap-2 text-white/40 text-xs">
          <div className="w-2 h-2 bg-[#00f5ff] rounded-full animate-pulse" />
          <span className="font-mono uppercase tracking-widest">System Active</span>
        </div>
      </div>
    </main>
  );
}
