import { Settings, Wrench, Clock, Facebook, Instagram } from 'lucide-react';

export default function Maintenance({ message, siteName }) {
  return (
    <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-neon-cyan/20 blur-3xl rounded-full" />
        <div className="relative w-24 h-24 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center">
          <Wrench className="w-12 h-12 text-neon-cyan animate-bounce" />
        </div>
      </div>
      
      <h1 className="font-display font-black text-4xl md:text-6xl text-white mb-6">
        {siteName || "Backbencher's 19"} <br />
        <span className="neon-text">Under Maintenance</span>
      </h1>
      
      <p className="text-gray-400 text-lg max-w-lg mb-10 leading-relaxed">
        {message || "We're currently performing some scheduled updates to improve your experience. We'll be back online very soon!"}
      </p>
      
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400 text-sm">
          <Clock className="w-4 h-4 text-neon-purple" />
          Estimated downtime: <span className="text-white font-bold">~1 Hour</span>
        </div>
        
        <div className="flex gap-4">
          <a href="#" className="p-3 rounded-full bg-white/5 text-gray-500 hover:text-white hover:bg-white/10 transition-all">
            <Facebook className="w-5 h-5" />
          </a>
          <a href="#" className="p-3 rounded-full bg-white/5 text-gray-500 hover:text-white hover:bg-white/10 transition-all">
            <Instagram className="w-5 h-5" />
          </a>
        </div>
      </div>
      
      <div className="mt-20">
        <p className="text-[10px] text-gray-700 uppercase tracking-[0.3em] font-bold mb-4">Admin Access</p>
        <a href="/admin/login" className="text-xs text-gray-500 hover:text-neon-cyan transition-colors underline underline-offset-4">
          Login to Dashboard
        </a>
      </div>
    </div>
  );
}
