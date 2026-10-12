import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { RiskRuleWeights } from '../../types';
import { useApp } from '../../context/AppContext';
import { Sliders, RotateCcw, Check, AlertCircle } from 'lucide-react';
import { DEFAULT_RISK_WEIGHTS } from '../../utils/riskEngine';

interface RiskRulesConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RiskRulesConfigModal: React.FC<RiskRulesConfigModalProps> = ({ isOpen, onClose }) => {
  const { riskWeights, updateRiskWeights } = useApp();

  const [attWeight, setAttWeight] = useState(Math.round(riskWeights.attendanceWeight * 100));
  const [acadWeight, setAcadWeight] = useState(Math.round(riskWeights.academicWeight * 100));
  const [trendWeight, setTrendWeight] = useState(Math.round(riskWeights.trendWeight * 100));
  const [asgWeight, setAsgWeight] = useState(Math.round(riskWeights.assignmentWeight * 100));
  const [highThreshold, setHighThreshold] = useState(riskWeights.highRiskThreshold);
  const [modThreshold, setModThreshold] = useState(riskWeights.moderateRiskThreshold);

  const totalWeight = attWeight + acadWeight + trendWeight + asgWeight;
  const isWeightValid = totalWeight === 100;

  const handleReset = () => {
    setAttWeight(Math.round(DEFAULT_RISK_WEIGHTS.attendanceWeight * 100));
    setAcadWeight(Math.round(DEFAULT_RISK_WEIGHTS.academicWeight * 100));
    setTrendWeight(Math.round(DEFAULT_RISK_WEIGHTS.trendWeight * 100));
    setAsgWeight(Math.round(DEFAULT_RISK_WEIGHTS.assignmentWeight * 100));
    setHighThreshold(DEFAULT_RISK_WEIGHTS.highRiskThreshold);
    setModThreshold(DEFAULT_RISK_WEIGHTS.moderateRiskThreshold);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isWeightValid) return;

    updateRiskWeights({
      attendanceWeight: attWeight / 100,
      academicWeight: acadWeight / 100,
      trendWeight: trendWeight / 100,
      assignmentWeight: asgWeight / 100,
      highRiskThreshold: highThreshold,
      moderateRiskThreshold: modThreshold,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Configure Risk Detection Engine Weights"
      subtitle="Adjustable institutional parameters governing the 0-100 risk scoring index"
      maxWidth="lg"
    >
      <form onSubmit={handleSave} className="space-y-5 text-xs font-sans">
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-wildfire-blue" />
            <span className="font-semibold text-slate-200">Total Indicator Weight Allocation:</span>
          </div>
          <span
            className={`font-mono font-bold text-sm px-2.5 py-0.5 rounded-lg border ${
              isWeightValid
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : 'bg-red-500/20 text-red-400 border-red-500/40'
            }`}
          >
            {totalWeight}% {isWeightValid ? '✓' : '(Must Equal 100%)'}
          </span>
        </div>

        {/* Indicator Sliders */}
        <div className="space-y-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
          <div>
            <div className="flex justify-between font-semibold text-slate-300 mb-1">
              <span>Attendance Concern Weight</span>
              <span className="font-mono text-wildfire-blue">{attWeight}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={attWeight}
              onChange={(e) => setAttWeight(parseInt(e.target.value))}
              className="w-full accent-cyan-400"
            />
          </div>

          <div>
            <div className="flex justify-between font-semibold text-slate-300 mb-1">
              <span>Academic Performance Concern Weight</span>
              <span className="font-mono text-wildfire-blue">{acadWeight}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={acadWeight}
              onChange={(e) => setAcadWeight(parseInt(e.target.value))}
              className="w-full accent-cyan-400"
            />
          </div>

          <div>
            <div className="flex justify-between font-semibold text-slate-300 mb-1">
              <span>Declining Trajectory Weight</span>
              <span className="font-mono text-wildfire-blue">{trendWeight}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={trendWeight}
              onChange={(e) => setTrendWeight(parseInt(e.target.value))}
              className="w-full accent-cyan-400"
            />
          </div>

          <div>
            <div className="flex justify-between font-semibold text-slate-300 mb-1">
              <span>Missing Assignments Weight</span>
              <span className="font-mono text-wildfire-blue">{asgWeight}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={asgWeight}
              onChange={(e) => setAsgWeight(parseInt(e.target.value))}
              className="w-full accent-cyan-400"
            />
          </div>
        </div>

        {/* Classification Thresholds */}
        <div className="grid grid-cols-2 gap-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Moderate Risk Cutoff (≥)</label>
            <input
              type="number"
              min="10"
              max="60"
              value={modThreshold}
              onChange={(e) => setModThreshold(parseInt(e.target.value) || 35)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">Default: 35/100</span>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">High Risk Cutoff (≥)</label>
            <input
              type="number"
              min="50"
              max="90"
              value={highThreshold}
              onChange={(e) => setHighThreshold(parseInt(e.target.value) || 65)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">Default: 65/100</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isWeightValid}
              className="px-5 py-2 rounded-xl bg-wildfire-blue text-slate-950 font-bold hover:bg-wildfire-blue-hover disabled:opacity-40 shadow-[0_0_15px_rgba(0,229,255,0.35)]"
            >
              Apply & Recalculate
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
