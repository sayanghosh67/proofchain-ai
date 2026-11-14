'use client';

import React, { useState } from 'react';
import { CheckCircle2, XCircle, ArrowRight, ShieldCheck, Terminal, AlertTriangle } from 'lucide-react';

export function BeforeAfterSlider() {
  const [sliderPos, setSliderPos] = useState(50); // percentage

  return (
    <div className="relative w-full rounded-2xl overflow-hidden glass-panel-elevated border border-slate-700/80 shadow-2xl">
      {/* Top Banner */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="text-white font-bold">RECOVERY VERIFICATION ENGINE — INTERACTIVE COMPARISON</span>
        </div>
        <span className="text-slate-400">Drag slider horizontally to inspect fix</span>
      </div>

      {/* Comparison Container */}
      <div className="relative h-96 sm:h-[420px] select-none bg-slate-950 overflow-hidden">
        {/* AFTER STATE (Repaired & Retested) - Right Layer */}
        <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-between bg-gradient-to-br from-slate-950 via-[#06201b] to-slate-950">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/40 mb-4">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              AFTER RECOVERY: VERIFIED (PASS)
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
              Documentation Route Patched & Verified
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mb-6">
              Target updated from broken 404 stub to active route <code>/fixture/docs-valid</code>. Automatic regression retest returned HTTP 200 in 11ms.
            </p>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/30 font-mono text-xs text-emerald-300 max-w-md space-y-1">
              <div>HTTP/1.1 200 OK</div>
              <div>Route: /fixture/docs-valid</div>
              <div>Response: {`{"status": "active", "docsVersion": "1.0"}`}</div>
              <div className="text-emerald-400 font-bold pt-1">Verdict: Empirical Claim Confirmed (Verified)</div>
            </div>
          </div>

          <div className="text-[11px] font-mono text-slate-500">
            Isolated Test Worker • Target: http://127.0.0.1:4319/fixture/docs
          </div>
        </div>

        {/* BEFORE STATE (Broken 404 Defect) - Left Layer (Clipped by sliderPos) */}
        <div
          className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-between bg-gradient-to-br from-slate-950 via-[#220a0d] to-slate-950 border-r border-rose-500/80"
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        >
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 font-mono text-xs font-bold border border-rose-500/40 mb-4">
              <XCircle className="w-4 h-4 text-rose-400" />
              BEFORE RECOVERY: CONTRADICTED (FAIL)
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
              False Claim: Navigation Links 100% Complete
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mb-6">
              Empirical HTTP check discovered dead navigation anchor targeting nonexistent route <code>/fixture/broken-docs-404</code>.
            </p>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-rose-500/30 font-mono text-xs text-rose-300 max-w-md space-y-1">
              <div>HTTP/1.1 404 Not Found</div>
              <div>Route: /fixture/broken-docs-404</div>
              <div>Error: Destination route missing on server</div>
              <div className="text-rose-400 font-bold pt-1">Verdict: Fake Progress Disproved by Evidence</div>
            </div>
          </div>

          <div className="text-[11px] font-mono text-slate-500">
            Detected by ProofChain Autonomous Agent • Severity: HIGH
          </div>
        </div>

        {/* Draggable Slider Divider Handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-[0_0_15px_rgba(255,255,255,0.8)]"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold shadow-xl">
            ⇄
          </div>
        </div>

        {/* Invisible Range Input for smooth touch & pointer dragging */}
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPos}
          onChange={(e) => setSliderPos(Number(e.target.value))}
          className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-30"
          aria-label="Before and After Verification Comparison Slider"
        />
      </div>

      {/* Bottom Footer Details */}
      <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
        <span className="flex items-center gap-1.5 text-rose-400">
          <AlertTriangle className="w-3.5 h-3.5" />
          Pre-Audit: Unverified Claim
        </span>
        <span className="flex items-center gap-1.5 text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          Post-Recovery: Certified Fix
        </span>
      </div>
    </div>
  );
}

