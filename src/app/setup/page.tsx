'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Monitor, HardDrive, CheckCircle2, ShieldCheck, ArrowRight, Play, Disc } from 'lucide-react';

export default function WindowsSetupWizardPage() {
  const [step, setStep] = useState<number>(1);
  const [acceptedLicense, setAcceptedLicense] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentTask, setCurrentTask] = useState<string>('Initializing Setup...');
  const [installationFinished, setInstallationFinished] = useState<boolean>(false);

  const installationTasks = [
    'Checking Windows system & Node.js environment...',
    'Extracting SQLite Database Engine (better-sqlite3)...',
    'Creating database tables (products, categories, orders, coupons)...',
    'Seeding initial categories (Canvas Paintings, Lippan Art, Candles, Resin, MDF)...',
    'Populating 15 handmade Indian art products with INR pricing...',
    'Generating admin account credentials (admin@kalakritiarts.in)...',
    'Configuring UPI QR & Razorpay test gateway endpoints...',
    'Generating desktop shortcuts & Windows registry entries...',
    'Finalizing Setup Wizard installation...'
  ];

  const handleStartInstallation = () => {
    setStep(4);
    setProgress(0);

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < installationTasks.length) {
        setCurrentTask(installationTasks[currentStep]);
        setProgress(Math.round(((currentStep + 1) / installationTasks.length) * 100));
      } else {
        clearInterval(interval);
        setProgress(100);
        setCurrentTask('Installation Complete!');
        setTimeout(() => {
          setInstallationFinished(true);
          setStep(5);
        }, 800);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#008080] flex items-center justify-center p-4 font-mono select-none">
      {/* CLASSIC WINDOWS 95/98/XP SETUP DIALOG WINDOW */}
      <div className="w-full max-w-2xl bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-black border-r-black shadow-2xl overflow-hidden rounded-xs text-black">
        {/* TITLE BAR */}
        <div className="bg-gradient-to-r from-[#000080] to-[#1084d0] px-3 py-1.5 flex items-center justify-between text-white font-bold text-xs">
          <div className="flex items-center gap-2">
            <Disc className="w-4 h-4 text-amber-300 animate-spin" />
            <span>Kalakriti Arts Studio Setup v1.0 — Windows Game Setup Wizard</span>
          </div>
          <div className="flex items-center gap-1">
            <button className="w-4 h-4 bg-[#c0c0c0] text-black text-[10px] font-bold border border-t-white border-l-white border-b-black border-r-black flex items-center justify-center leading-none">
              _
            </button>
            <button className="w-4 h-4 bg-[#c0c0c0] text-black text-[10px] font-bold border border-t-white border-l-white border-b-black border-r-black flex items-center justify-center leading-none">
              □
            </button>
            <button className="w-4 h-4 bg-[#c0c0c0] text-black text-[10px] font-bold border border-t-white border-l-white border-b-black border-r-black flex items-center justify-center leading-none">
              ✕
            </button>
          </div>
        </div>

        {/* DIALOG BODY CONTENT */}
        <div className="p-6 bg-[#c0c0c0] space-y-6">
          {/* STEP 1: WELCOME */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex gap-4 items-start bg-white p-4 border-2 border-b-white border-r-white border-t-stone-800 border-l-stone-800">
                <div className="p-3 bg-amber-100 border border-amber-400 rounded-sm">
                  <Monitor className="w-10 h-10 text-amber-900" />
                </div>
                <div className="space-y-2">
                  <h2 className="font-bold text-sm text-[#000080] uppercase tracking-wide">
                    Welcome to the Kalakriti Arts Studio Setup Program
                  </h2>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    This setup program will install Kalakriti Arts Studio E-Commerce Boutique on your computer.
                  </p>
                  <p className="text-xs text-stone-600">
                    It is strongly recommended that you exit all other Windows programs before continuing.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-[#e0e0e0] border border-stone-400 text-[11px] text-stone-800 space-y-1">
                <p><strong>Package Name:</strong> Kalakriti Arts Studio v1.0</p>
                <p><strong>Target Platform:</strong> India Handmade Crafts Boutique</p>
                <p><strong>Publisher:</strong> Kalakriti Arts Studio Jaipur</p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-stone-400">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-1.5 bg-[#c0c0c0] text-xs font-bold text-black border-2 border-t-white border-l-white border-b-black border-r-black active:border-t-black active:border-l-black active:border-b-white active:border-r-white flex items-center gap-1 shadow-xs"
                >
                  Next &gt;
                </button>
                <Link
                  href="/"
                  className="px-6 py-1.5 bg-[#c0c0c0] text-xs font-bold text-black border-2 border-t-white border-l-white border-b-black border-r-black flex items-center justify-center"
                >
                  Cancel
                </Link>
              </div>
            </div>
          )}

          {/* STEP 2: LICENSE AGREEMENT */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-bold text-xs text-[#000080]">Software License Agreement</h2>
              <p className="text-xs text-stone-700">Please read the following license agreement carefully:</p>

              <div className="h-40 overflow-y-scroll bg-white p-3 border-2 border-b-white border-r-white border-t-stone-800 border-l-stone-800 text-[11px] font-mono leading-relaxed space-y-2">
                <p className="font-bold text-black">KALAKRITI ARTS STUDIO E-COMMERCE END USER LICENSE AGREEMENT</p>
                <p>1. GRANT OF LICENSE: You are granted a non-exclusive license to operate 1 single artisan e-commerce store in India.</p>
                <p>2. NO MULTI-VENDOR: This software is engineered specifically for single store owners. Vendor functionality is prohibited.</p>
                <p>3. PAYMENTS & TAX: Built for Razorpay UPI, Netbanking, Cards, and Indian GST rules.</p>
                <p>4. DATA PRIVACY: Customer addresses and payment metadata are protected and encrypted.</p>
              </div>

              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedLicense}
                  onChange={(e) => setAcceptedLicense(e.target.checked)}
                  className="w-4 h-4 accent-amber-800"
                />
                <span className="font-bold">I accept all terms of the preceding License Agreement</span>
              </label>

              <div className="flex justify-between items-center pt-2 border-t border-stone-400">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-1.5 bg-[#c0c0c0] text-xs font-bold text-black border-2 border-t-white border-l-white border-b-black border-r-black"
                >
                  &lt; Back
                </button>
                <button
                  disabled={!acceptedLicense}
                  onClick={() => setStep(3)}
                  className={`px-6 py-1.5 text-xs font-bold border-2 border-t-white border-l-white border-b-black border-r-black ${
                    acceptedLicense ? 'bg-[#c0c0c0] text-black' : 'bg-[#a0a0a0] text-stone-500 cursor-not-allowed'
                  }`}
                >
                  Next &gt;
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: DESTINATION FOLDER */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="font-bold text-xs text-[#000080]">Choose Destination Directory</h2>
              <p className="text-xs text-stone-700">Setup will install Kalakriti Arts Studio in the following directory:</p>

              <div className="flex items-center gap-2 bg-white p-2 border-2 border-b-white border-r-white border-t-stone-800 border-l-stone-800 font-mono text-xs">
                <HardDrive className="w-5 h-5 text-stone-700" />
                <span>C:\Mangesh\Jules\GayatriPortal\store.db</span>
              </div>

              <div className="p-3 bg-stone-200 border border-stone-400 text-[11px] space-y-1">
                <p>Space Required on Drive C: <strong>45 MB</strong></p>
                <p>Space Available on Drive C: <strong>120 GB</strong></p>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-stone-400">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-1.5 bg-[#c0c0c0] text-xs font-bold text-black border-2 border-t-white border-l-white border-b-black border-r-black"
                >
                  &lt; Back
                </button>
                <button
                  onClick={handleStartInstallation}
                  className="px-6 py-1.5 bg-amber-800 text-white text-xs font-bold border-2 border-t-amber-300 border-l-amber-300 border-b-black border-r-black flex items-center gap-1"
                >
                  Install Now &gt;
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: INSTALLATION PROGRESS BAR */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="font-bold text-xs text-[#000080]">Installing Kalakriti Arts Studio...</h2>
                <p className="text-xs text-stone-700 truncate">{currentTask}</p>
              </div>

              {/* RETRO PROGRESS BAR */}
              <div className="space-y-2">
                <div className="w-full bg-white h-6 p-1 border-2 border-b-white border-r-white border-t-stone-800 border-l-stone-800 flex items-center gap-1 overflow-hidden">
                  {[...Array(Math.floor(progress / 5))].map((_, i) => (
                    <div key={i} className="bg-[#000080] h-full w-3 flex-shrink-0" />
                  ))}
                </div>
                <div className="flex justify-between text-xs font-mono">
                  <span>Progress:</span>
                  <span>{progress}%</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-300 text-[11px] text-amber-900 space-y-1">
                <p className="font-bold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-amber-700" /> Initializing SQLite Database & Artwork Catalogue...
                </p>
                <p className="text-stone-600">Please do not turn off your workstation or interrupt installation.</p>
              </div>
            </div>
          )}

          {/* STEP 5: SETUP COMPLETE */}
          {step === 5 && (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 bg-emerald-100 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-700">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h2 className="font-bold text-lg text-[#000080]">Setup Complete!</h2>
                <p className="text-xs text-stone-700 max-w-md mx-auto">
                  Kalakriti Arts Studio has been successfully installed on your computer system.
                </p>
              </div>

              <div className="p-4 bg-white border-2 border-b-white border-r-white border-t-stone-800 border-l-stone-800 text-left text-xs font-mono space-y-1">
                <p><strong>Storefront URL:</strong> <a href="/" className="text-blue-700 underline">http://localhost:3000</a></p>
                <p><strong>Admin Dashboard:</strong> <a href="/admin/login" className="text-blue-700 underline">http://localhost:3000/admin</a></p>
                <p><strong>Admin Login:</strong> admin@kalakritiarts.in / admin123</p>
              </div>

              <div className="flex justify-center gap-4 pt-4 border-t border-stone-400">
                <Link
                  href="/admin/login"
                  className="px-6 py-2 bg-amber-800 text-white font-bold text-xs border-2 border-t-amber-300 border-l-amber-300 border-b-black border-r-black flex items-center gap-2 shadow-md hover:bg-amber-700"
                >
                  <Play className="w-4 h-4 fill-white" /> Launch Admin Dashboard
                </Link>
                <Link
                  href="/"
                  className="px-6 py-2 bg-[#c0c0c0] text-black font-bold text-xs border-2 border-t-white border-l-white border-b-black border-r-black flex items-center gap-2"
                >
                  Launch Customer Storefront &gt;
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* STATUS BAR */}
        <div className="bg-[#c0c0c0] border-t border-stone-400 px-3 py-1 flex justify-between text-[10px] text-stone-700 font-mono">
          <span>Status: Ready</span>
          <span>Setup Type: Full Installation</span>
        </div>
      </div>
    </div>
  );
}
