import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Upload, AlertCircle, CheckCircle2, Download, FileSpreadsheet } from 'lucide-react';
import { parseStudentsCsv, CsvImportResult } from '../../utils/csvHelper';
import { useApp } from '../../context/AppContext';

interface CsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CsvImportModal: React.FC<CsvImportModalProps> = ({ isOpen, onClose }) => {
  const { students, addStudent, showToast } = useApp();
  const [csvContent, setCsvContent] = useState('');
  const [parsedResult, setParsedResult] = useState<CsvImportResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const sampleCsv = `Student ID,Full Name,Course,Semester,Attendance %,Average Score %,Performance Trend,Advisor,Email
WF-2026-109,Kavita Sen,B.Tech Computer Science,4,84.5,72.0,stable,Dr. Sarah Jenkins,kavita.sen@wildfire.edu
WF-2026-110,Dev Patel,B.Tech Data Science,4,66.0,51.0,declining,Dr. Robert Miller,dev.patel@wildfire.edu
WF-2026-111,Lucas Silva,B.Tech Artificial Intelligence,4,95.0,89.5,improving,Prof. Alan Vance,lucas.silva@wildfire.edu`;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvContent(text);
      validate(text);
    };
    reader.readAsText(file);
  };

  const validate = (text: string) => {
    const existingIds = new Set(students.map((s) => s.id));
    const result = parseStudentsCsv(text, existingIds);
    setParsedResult(result);
  };

  const downloadSample = () => {
    const blob = new Blob([sampleCsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'wildfire_student_import_sample.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = async () => {
    if (!parsedResult || parsedResult.validStudents.length === 0) return;

    setIsProcessing(true);
    let importedCount = 0;
    try {
      for (const s of parsedResult.validStudents) {
        await addStudent(s);
        importedCount++;
      }
      showToast('success', 'Import Completed', `Successfully imported ${importedCount} student records.`);
      onClose();
      setParsedResult(null);
      setCsvContent('');
    } catch (err: any) {
      showToast('error', 'Import Interrupted', err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Import Student Records via CSV"
      subtitle="Strict schema validation with immediate row-level error reporting"
      maxWidth="2xl"
    >
      <div className="space-y-4 text-xs font-sans">
        {/* Sample Download Bar */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-2 text-slate-300">
            <FileSpreadsheet className="w-4 h-4 text-wildfire-blue" />
            <span>Need the official CSV format schema?</span>
          </div>
          <button
            onClick={downloadSample}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-wildfire-blue border border-wildfire-blue/30 font-mono text-[11px] transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Template</span>
          </button>
        </div>

        {/* Upload Drop Area */}
        <label className="border-2 border-dashed border-slate-700 hover:border-wildfire-blue/60 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-900/40">
          <Upload className="w-8 h-8 text-wildfire-blue mb-2" />
          <span className="font-semibold text-slate-200">Click or Drag & Drop .CSV File Here</span>
          <span className="text-[11px] text-slate-500 mt-0.5">UTF-8 encoded standard CSV with headers</span>
          <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
        </label>

        {/* Paste raw text alternative */}
        <div>
          <label className="block text-slate-400 font-mono text-[11px] mb-1">
            Or paste CSV text directly:
          </label>
          <textarea
            rows={4}
            value={csvContent}
            onChange={(e) => {
              setCsvContent(e.target.value);
              validate(e.target.value);
            }}
            placeholder={sampleCsv}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 font-mono text-[11px] text-slate-200 focus:outline-none focus:border-wildfire-blue"
          />
        </div>

        {/* Validation Results Display */}
        {parsedResult && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>{parsedResult.validStudents.length} Valid Records Ready</span>
              </div>
              {parsedResult.errors.length > 0 && (
                <div className="flex items-center gap-1.5 text-red-400 font-bold">
                  <AlertCircle className="w-4 h-4" />
                  <span>{parsedResult.errors.length} Rows With Errors (Discarded)</span>
                </div>
              )}
            </div>

            {/* Error table */}
            {parsedResult.errors.length > 0 && (
              <div className="max-h-36 overflow-y-auto rounded-xl border border-red-500/30 bg-red-950/20 p-2.5">
                <div className="text-[11px] font-bold text-red-300 mb-1">Errors Detail:</div>
                <ul className="space-y-1 text-[11px] text-red-400 font-mono">
                  {parsedResult.errors.map((err, idx) => (
                    <li key={idx}>
                      Row {err.row} (ID: {err.studentId}): {err.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Modal Actions */}
        <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleImport}
            disabled={!parsedResult || parsedResult.validStudents.length === 0 || isProcessing}
            className="px-5 py-2 rounded-xl bg-wildfire-blue text-slate-950 font-bold hover:bg-wildfire-blue-hover shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all disabled:opacity-40"
          >
            {isProcessing ? 'Importing Records...' : `Import ${parsedResult?.validStudents.length || 0} Students`}
          </button>
        </div>
      </div>
    </Modal>
  );
};
