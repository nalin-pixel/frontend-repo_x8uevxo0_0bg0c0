import Spline from '@splinetool/react-spline';

export default function Hero() {
  return (
    <section className="relative w-full min-h-[80vh] overflow-hidden bg-[#0a0b10]">
      <div className="absolute inset-0">
        <Spline
          scene="https://prod.spline.design/fcD-iW8YZHyBp1qq/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
        {/* subtle gradient glow overlay (non-blocking for interaction) */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_70%_20%,rgba(0,255,255,0.15),rgba(0,0,0,0))]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="max-w-2xl backdrop-blur-sm/0">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-[0_0_24px_rgba(0,255,255,0.25)]">
            Web Indie Game Prompt Studio
          </h1>
          <p className="mt-4 text-lg md:text-xl text-cyan-100/90">
            Rancang konsep, loop gameplay, dan struktur teknis HTML5 Canvas yang
            futuristik dan super smooth — siap dimainkan di browser.
          </p>
        </div>
      </div>
    </section>
  );
}
