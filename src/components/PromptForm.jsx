import { useState } from 'react';

const defaultState = {
  name: 'Neon Drift',
  genre: 'Runner Tanpa Akhir',
  premise:
    'Pemain mengendalikan kapal data di grid neon, menghindari rintangan dinamis dan mengumpulkan fragmen kode untuk bertahan dan mempercepat.',
  controls: 'Tombol panah kiri/kanan atau swipe (mobile).',
};

export default function PromptForm({ onGenerate }) {
  const [form, setForm] = useState(defaultState);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function submit(e) {
    e.preventDefault();
    onGenerate?.(form);
  }

  return (
    <section className="relative bg-[#0b0e14] py-10 md:py-14">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white">Masukkan Konsep Game</h2>
        <p className="mt-2 text-cyan-100/80">
          Lengkapi detail berikut untuk menghasilkan struktur teknis dan gameplay loop.
        </p>

        <form onSubmit={submit} className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm text-cyan-100/80 mb-1">Nama Konsep Game</label>
            <input
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              className="w-full rounded-lg bg-[#0f1420] border border-cyan-500/30 focus:border-cyan-400 focus:ring-0 text-white px-4 py-3 outline-none"
              placeholder="Minimalist Runner"
            />
          </div>

          <div>
            <label className="block text-sm text-cyan-100/80 mb-1">Genre Game</label>
            <select
              value={form.genre}
              onChange={(e) => update('genre', e.target.value)}
              className="w-full rounded-lg bg-[#0f1420] border border-cyan-500/30 focus:border-cyan-400 focus:ring-0 text-white px-4 py-3 outline-none"
            >
              <option>Runner Tanpa Akhir</option>
              <option>Arcade Shooter</option>
              <option>Puzzle Aksi</option>
              <option>Platformer</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-cyan-100/80 mb-1">Mekanik Kontrol</label>
            <input
              value={form.controls}
              onChange={(e) => update('controls', e.target.value)}
              className="w-full rounded-lg bg-[#0f1420] border border-cyan-500/30 focus:border-cyan-400 focus:ring-0 text-white px-4 py-3 outline-none"
              placeholder="Hanya tombol panah kiri/kanan"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-cyan-100/80 mb-1">Premis Inti Game</label>
            <textarea
              value={form.premise}
              onChange={(e) => update('premise', e.target.value)}
              className="w-full rounded-lg bg-[#0f1420] border border-cyan-500/30 focus:border-cyan-400 focus:ring-0 text-white px-4 py-3 h-28 outline-none"
              placeholder="Pemain mengendalikan ..."
            />
          </div>

          <div className="md:col-span-2 flex items-center gap-3">
            <button
              type="submit"
              className="rounded-lg bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-300 text-[#0a0b10] font-semibold px-5 py-3 transition-colors"
            >
              Generate Prompt
            </button>
            <button
              type="button"
              onClick={() => setForm(defaultState)}
              className="rounded-lg border border-cyan-500/40 text-cyan-200 hover:bg-cyan-500/10 px-4 py-3"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
