'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Activity, Gauge, HardDrive, Eye, RefreshCw, Layers } from 'lucide-react';

export default function AdminTrafficPage() {
  const [trafficData, setTrafficData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchTraffic = async () => {
    try {
      const res = await fetch('/api/traffic').then((r) => r.json());
      setTrafficData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTraffic();
    let interval: any = null;
    if (autoRefresh) {
      interval = setInterval(fetchTraffic, 3000); // Live poll every 3s
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  return (
    <div className="flex min-h-screen bg-stone-950 text-stone-100 font-sans">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 space-y-6 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-900/30 pb-4">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-amber-100 flex items-center gap-2">
              <Activity className="w-7 h-7 text-emerald-400 animate-pulse" /> Live Traffic Data Analysis
            </h1>
            <p className="text-xs text-stone-400 mt-1">Real-time HTTP network traffic, response latency, payload bandwidth & active requests.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 border ${
                autoRefresh ? 'bg-emerald-950 text-emerald-300 border-emerald-700/50' : 'bg-stone-900 text-stone-400 border-stone-800'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${autoRefresh ? 'animate-spin' : ''}`} />
              <span>{autoRefresh ? 'Live Auto-Polling On' : 'Polling Paused'}</span>
            </button>
            <button
              onClick={fetchTraffic}
              className="bg-amber-800 hover:bg-amber-700 text-amber-100 px-3 py-1.5 rounded-lg text-xs font-bold transition"
            >
              Refresh Now
            </button>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 bg-stone-900/80 border border-amber-900/30 rounded-2xl space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-amber-400">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">Total HTTP Requests</span>
              <Eye className="w-5 h-5 text-amber-400" />
            </div>
            <p className="font-serif text-3xl font-bold text-amber-200 font-mono">
              {trafficData ? trafficData.total_requests : 0}
            </p>
            <p className="text-[11px] text-stone-500">Total active hits logged</p>
          </div>

          <div className="p-6 bg-stone-900/80 border border-amber-900/30 rounded-2xl space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-amber-400">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">Avg Response Latency</span>
              <Gauge className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="font-serif text-3xl font-bold text-emerald-300 font-mono">
              {trafficData ? `${trafficData.avg_response_time_ms} ms` : '18 ms'}
            </p>
            <p className="text-[11px] text-stone-500">Optimal server rendering speed</p>
          </div>

          <div className="p-6 bg-stone-900/80 border border-amber-900/30 rounded-2xl space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-amber-400">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">Total Data Bandwidth</span>
              <HardDrive className="w-5 h-5 text-amber-400" />
            </div>
            <p className="font-serif text-3xl font-bold text-amber-200 font-mono">
              {trafficData ? `${(trafficData.total_bandwidth_bytes / 1024).toFixed(1)} KB` : '0 KB'}
            </p>
            <p className="text-[11px] text-stone-500">Transferred HTTP payload size</p>
          </div>
        </div>

        {/* Top Visited Pages & Recent Traffic Log */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Visited Pages */}
          <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="font-serif font-bold text-amber-200 text-base border-b border-stone-800 pb-3">
              Most Visited Storefront Routes
            </h3>
            <div className="space-y-3">
              {trafficData?.top_pages?.map((p: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center text-xs p-3 bg-stone-950 rounded-xl border border-stone-800">
                  <div>
                    <span className="font-mono text-amber-300 font-bold block">{p.path}</span>
                    <span className="text-[10px] text-stone-500">Payload: {(p.total_bytes / 1024).toFixed(1)} KB</span>
                  </div>
                  <span className="bg-amber-950 text-amber-200 border border-amber-800 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono">
                    {p.views} views
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Live Recent Traffic Logs */}
          <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="font-serif font-bold text-amber-200 text-base border-b border-stone-800 pb-3 flex items-center justify-between">
              <span>Real-Time Request Stream</span>
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" /> Streaming
              </span>
            </h3>
            <div className="space-y-2 max-h-80 overflow-y-auto font-mono text-[11px]">
              {trafficData?.recent_logs?.map((log: any) => (
                <div key={log.id} className="p-2 bg-stone-950 rounded border border-stone-800 flex justify-between items-center">
                  <div className="truncate max-w-[220px]">
                    <span className="text-emerald-400 font-bold mr-2">{log.method}</span>
                    <span className="text-stone-300">{log.path}</span>
                  </div>
                  <div className="text-stone-500 text-[10px] shrink-0">
                    {log.response_time_ms}ms • {log.payload_bytes}B
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
