import React, { useState } from 'react';
import { GlassCard } from '../common/GlassCard';
import { useApp } from '../../context/AppContext';
import { Settings, Server, Database, Sliders, Shield, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { RiskRulesConfigModal } from '../risk/RiskRulesConfigModal';
import { wildfireApi } from '../../services/api';

export const SettingsView: React.FC = () => {
  const { isLiveMode, setLiveMode, backendStatus, refreshData, showToast } = useApp();

  const [isRiskModalOpen, setIsRiskModalOpen] = useState(false);
  const [isPinging, setIsPinging] = useState(false);
  const [pingResult, setPingResult] = useState<string | null>(null);

  const handleTestBackend = async () => {
    setIsPinging(true);
    setPingResult(null);
    try {
      const res = await wildfireApi.checkBackendHealth();
      setPingResult(`Connected to Spring Boot API: status "${res.status}"`);
      showToast('success', 'Backend Online', 'Live Spring Boot REST endpoints reached successfully.');
    } catch (err: any) {
      setPingResult(`Connection failed: ${err.message}. Check backend server on port 8080.`);
      showToast('warning', 'Connection Failed', 'Ensure Spring Boot backend is running.');
    } finally {
      setIsPinging(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-wildfire-card to-slate-900 border border-slate-800 flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-mono mb-2">
            <Settings className="w-3.5 h-3.5" />
            <span>INSTITUTIONAL PLATFORM CONFIGURATION</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">System Settings & Data Architecture</h2>
          <p className="text-xs text-slate-300 mt-1">
            Configure data sources, algorithmic risk rules, and backend connection telemetry.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Data Architecture & Mode Switch */}
        <GlassCard className="p-6 space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <Database className="w-5 h-5 text-wildfire-blue" />
            <div>
              <h4 className="text-sm font-bold text-white">Data Mode & Persistence</h4>
              <p className="text-xs text-slate-400">Switch between demo cohort and persistent Spring Boot database</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">Live Backend Mode</div>
                <div className="text-[11px] text-slate-400">
                  {isLiveMode
                    ? 'Fetching live records from Spring Boot PostgreSQL API'
                    : 'Serving demonstration dataset with internally verified metrics'}
                </div>
              </div>
              <button
                onClick={() => setLiveMode(!isLiveMode)}
                className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
                  isLiveMode
                    ? 'bg-wildfire-blue text-slate-950 shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                }`}
              >
                {isLiveMode ? 'LIVE API ACTIVE' : 'DEMO MODE ACTIVE'}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold">Backend REST Endpoint:</span>
              <span className="font-mono text-wildfire-blue">http://localhost:8080/api/v1</span>
            </div>

            <button
              onClick={handleTestBackend}
              disabled={isPinging}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin text-wildfire-blue' : ''}`} />
              <span>{isPinging ? 'Pinging Spring Boot...' : 'Test Backend Connection (/health)'}</span>
            </button>

            {pingResult && (
              <div
                className={`p-3 rounded-xl text-xs font-mono border ${
                  pingResult.includes('Connected')
                    ? 'bg-emerald-950/30 text-emerald-300 border-emerald-500/30'
                    : 'bg-amber-950/30 text-amber-300 border-amber-500/30'
                }`}
              >
                {pingResult}
              </div>
            )}
          </div>
        </GlassCard>

        {/* Risk Algorithm Model & Security */}
        <GlassCard className="p-6 space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <Sliders className="w-5 h-5 text-wildfire-cyan" />
            <div>
              <h4 className="text-sm font-bold text-white">Detection Algorithm Rules</h4>
              <p className="text-xs text-slate-400">Configure weighting matrices and risk sensitivity</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 text-xs">
            <p className="text-slate-300 leading-relaxed">
              Institutional risk scoring can be customized for specific departments or curriculum structures.
              Thresholds adapt automatically based on available student data dimensions.
            </p>

            <button
              onClick={() => setIsRiskModalOpen(true)}
              className="w-full py-2.5 rounded-xl bg-wildfire-cyan/20 border border-wildfire-cyan/40 text-wildfire-cyan hover:bg-wildfire-cyan/30 font-bold transition-all"
            >
              Adjust Risk Model & Thresholds
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-300">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Security & Secrets Architecture</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              OpenAI API keys and database credentials are kept strictly in backend environment variables (
              <code className="text-wildfire-blue">OPENAI_API_KEY</code>,{' '}
              <code className="text-wildfire-blue">SPRING_DATASOURCE_URL</code>). The browser client never touches private keys.
            </p>
          </div>
        </GlassCard>
      </div>

      <RiskRulesConfigModal isOpen={isRiskModalOpen} onClose={() => setIsRiskModalOpen(false)} />
    </div>
  );
};
