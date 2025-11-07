import { Rocket } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#070a10] border-t border-cyan-500/10">
      <div className="mx-auto max-w-6xl px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-cyan-100/80">
          <Rocket className="text-cyan-400" size={18} />
          <span className="text-sm">Futuristic Web Game Prompt — HTML5 Canvas</span>
        </div>
        <p className="text-xs text-cyan-100/60">
          Estetika neon, smooth motion, dan performa responsif.
        </p>
      </div>
    </footer>
  );
}
