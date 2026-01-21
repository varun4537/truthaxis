
import React, { useState } from 'react';
import { analyzeGraphImage } from './services/geminiService';
import { GraphAnalysis, AppStatus } from './types';
import ChartComparison from './components/ChartComparison';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [analysis, setAnalysis] = useState<GraphAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    setStatus(AppStatus.PROCESSING);
    setError(null);

    try {
      const base64 = await toBase64(file);
      const result = await analyzeGraphImage(base64);
      setAnalysis(result);
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      setError(err.message || 'Analysis failed. The image might be too low resolution or not a chart.');
      setStatus(AppStatus.ERROR);
    }
  };

  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const reset = () => {
    setStatus(AppStatus.IDLE);
    setAnalysis(null);
    setPreview(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100">
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

      <nav className="relative bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-slate-900 w-9 h-9 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <span className="text-lg font-black text-slate-900 tracking-tighter uppercase">TruthAxis</span>
              <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100">V2.0</span>
            </div>
          </div>
          <button 
            onClick={reset}
            className="text-xs font-bold text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors"
          >
            Clear Session
          </button>
        </div>
      </nav>

      <main className="relative max-w-7xl mx-auto px-4 py-12">
        {status === AppStatus.IDLE && (
          <div className="max-w-4xl mx-auto text-center py-12">
            <div className="inline-block px-4 py-1.5 bg-white rounded-full text-indigo-600 text-xs font-bold border border-indigo-50 shadow-sm mb-6 uppercase tracking-widest">
              Detecting Statistical Deception
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.9]">
              FIX THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">NARRATIVE.</span>
            </h1>
            <p className="text-xl text-slate-500 mb-12 max-w-2xl mx-auto font-medium">
              We extract visual DNA from misleading charts and rebuild them with honest baselines. Don't let cropped axes fool you.
            </p>

            <div className="relative group max-w-xl mx-auto">
              <label className="flex flex-col items-center justify-center w-full h-80 border-2 border-dashed border-slate-200 rounded-[2rem] cursor-pointer bg-white hover:bg-slate-50/50 transition-all hover:border-indigo-400 hover:shadow-2xl hover:shadow-indigo-100 overflow-hidden">
                <div className="flex flex-col items-center justify-center p-10 text-center">
                  <div className="w-20 h-20 bg-slate-50 text-slate-400 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-lg font-bold text-slate-900">Upload Forensic Sample</p>
                  <p className="text-sm text-slate-400 mt-2 font-medium">Click to browse or drag & drop chart image</p>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
              </label>
            </div>
          </div>
        )}

        {status === AppStatus.PROCESSING && (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-24 h-24 relative mb-8">
              <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-indigo-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Extracting Visual Truth</h3>
            <p className="text-slate-500 mt-2 font-medium animate-pulse">Running pixel-to-data mapping...</p>
          </div>
        )}

        {status === AppStatus.SUCCESS && analysis && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <ChartComparison analysis={analysis} />
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Source Evidence</h3>
                <div className="aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 group relative">
                  <img src={preview!} alt="Source" className="w-full h-full object-contain p-4" />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs font-bold px-3 py-1 bg-black/50 backdrop-blur rounded-full">Original Captured Graph</span>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-600 p-8 rounded-3xl text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
                <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                <div className="relative">
                  <h3 className="text-xl font-bold mb-4">Why we corrected this</h3>
                  <p className="text-indigo-100 text-sm leading-relaxed mb-8">
                    Data visualization is often weaponized by hiding the 0-baseline. When the Y-axis starts near the minimum data point, tiny fluctuations appear as massive trends. By restoring the baseline, we return the data to its proper context.
                  </p>
                  <div className="flex space-x-4">
                    <button 
                      onClick={() => setStatus(AppStatus.IDLE)}
                      className="bg-white text-indigo-600 px-6 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-indigo-900/20 hover:scale-105 transition-transform"
                    >
                      Audit Another Chart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {status === AppStatus.ERROR && (
          <div className="max-w-md mx-auto bg-white p-10 rounded-[2.5rem] border border-rose-100 shadow-2xl text-center">
            <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Audit Blocked</h2>
            <p className="text-slate-500 mb-8 font-medium">{error}</p>
            <button onClick={reset} className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-colors">
              Restart Forensic Probe
            </button>
          </div>
        )}
      </main>

      <footer className="max-w-7xl mx-auto px-4 py-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-widest">
        <div>TruthAxis &copy; 2024 / Built with Gemini Flash</div>
        <div className="mt-4 md:mt-0">Always verify raw data before sharing. Values estimated via CV.</div>
      </footer>
    </div>
  );
};

export default App;
