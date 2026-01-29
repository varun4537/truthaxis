
import React, { useState, useEffect, useCallback } from 'react';
import { analyzeGraphImage, generateFixedChart } from './services/geminiService';
import { GraphAnalysis, AppStatus, ProcessingStep } from './types';
import ChartComparison from './components/ChartComparison';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [analysis, setAnalysis] = useState<GraphAnalysis | null>(null);
  const [fixedImage, setFixedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([]);

  // Check for API Key on mount
  useEffect(() => {
    const checkApiKey = async () => {
      // Use type assertion to avoid conflict with existing global AIStudio definition
      const win = window as any;
      if (win.aistudio) {
        const hasKey = await win.aistudio.hasSelectedApiKey();
        setHasApiKey(hasKey);
      } else {
        // Fallback for dev environments without the wrapper
        setHasApiKey(true);
      }
    };
    checkApiKey();
  }, []);

  const handleSelectKey = async () => {
    const win = window as any;
    if (win.aistudio) {
      await win.aistudio.openSelectKey();
      // Assume success after closing dialog to avoid race conditions
      setHasApiKey(true);
    }
  };

  // Unified file processor
  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG, JPG, JPEG).');
      setStatus(AppStatus.ERROR);
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    setStatus(AppStatus.PROCESSING);
    setError(null);
    setAnalysis(null);
    setFixedImage(null);

    // Initialize Steps
    setProcessingSteps([
      { label: 'Analysing the graph', status: 'current' },
      { label: 'Identifying bias', status: 'waiting' },
      { label: 'Reconstructing', status: 'waiting' },
      { label: 'Finishing', status: 'waiting' },
    ]);

    try {
      const base64 = await toBase64(file);
      
      // Execute tasks
      const analysisPromise = analyzeGraphImage(base64);
      const reconstructionPromise = generateFixedChart(base64);

      // Update UI when analysis completes (usually faster)
      analysisPromise.then(() => {
        setProcessingSteps(prev => [
          { label: 'Analysing the graph', status: 'completed' },
          { label: 'Identifying bias', status: 'completed' },
          { label: 'Reconstructing', status: 'current' },
          { label: 'Finishing', status: 'waiting' },
        ]);
      });

      // Wait for both
      const [analysisResult, fixedImageResult] = await Promise.all([
        analysisPromise,
        reconstructionPromise
      ]);

      // All data ready, show finishing
      setProcessingSteps(prev => [
        { label: 'Analysing the graph', status: 'completed' },
        { label: 'Identifying bias', status: 'completed' },
        { label: 'Reconstructing', status: 'completed' },
        { label: 'Finishing', status: 'current' },
      ]);

      // Small delay for UX to let user see "Finishing"
      await new Promise(resolve => setTimeout(resolve, 800));

      setAnalysis(analysisResult);
      setFixedImage(fixedImageResult);
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      if (err.message && err.message.includes("Requested entity was not found")) {
        setHasApiKey(false);
        setError("API Key invalid or not selected. Please select a paid API key.");
      } else {
        setError(err.message || 'Analysis failed. The image might be too low resolution or not a chart.');
      }
      setStatus(AppStatus.ERROR);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) processFile(file);
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
    setFixedImage(null);
    setPreview(null);
    setError(null);
    setProcessingSteps([]);
  };

  // Paste Event Handler
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (!hasApiKey) return;
      if (status !== AppStatus.IDLE && status !== AppStatus.ERROR) return;
      
      const items = e.clipboardData?.items;
      if (items) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            const file = items[i].getAsFile();
            if (file) processFile(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [status, hasApiKey]);

  // Drag and Drop Handlers
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (hasApiKey) setIsDragging(true);
  }, [hasApiKey]);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (hasApiKey && e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [hasApiKey]);

  if (!hasApiKey) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-200 text-center">
          <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Access Required</h2>
          <p className="text-slate-500 mb-8">
            To use the advanced Nano Banana Pro model for chart reconstruction, you must select a valid paid API key.
          </p>
          <button 
            onClick={handleSelectKey}
            className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            Connect Google AI Studio
          </button>
          <p className="mt-6 text-xs text-slate-400">
            Visit <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline hover:text-indigo-500">Google AI Billing Docs</a> for more info.
          </p>
        </div>
      </div>
    );
  }

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
              <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100">V2.0 PRO</span>
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
              Powered by Nano Banana Pro
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.9]">
              FIX THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">NARRATIVE.</span>
            </h1>
            <p className="text-xl text-slate-500 mb-12 max-w-2xl mx-auto font-medium">
              We use generative AI to rebuild misleading charts with honest baselines. Don't let cropped axes fool you.
            </p>

            <div className="relative group max-w-xl mx-auto">
              <div 
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                className={`relative w-full h-80 border-2 border-dashed rounded-[2rem] transition-all duration-300 overflow-hidden ${isDragging ? 'border-indigo-500 bg-indigo-50/50 scale-105 shadow-2xl shadow-indigo-200' : 'border-slate-200 bg-white hover:bg-slate-50/50 hover:border-indigo-400 hover:shadow-2xl hover:shadow-indigo-100'}`}
              >
                <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                  <div className="flex flex-col items-center justify-center p-10 text-center">
                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 transition-all duration-500 ${isDragging ? 'bg-indigo-600 text-white scale-110' : 'bg-slate-50 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white'}`}>
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className={`text-lg font-bold transition-colors ${isDragging ? 'text-indigo-700' : 'text-slate-900'}`}>
                      {isDragging ? 'Drop Image Now' : 'Upload Forensic Sample'}
                    </p>
                    <p className="text-sm text-slate-400 mt-2 font-medium">
                      Drag & Drop, <span className="text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">Ctrl + V</span> to paste, or Click
                    </p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                </label>
              </div>
            </div>
          </div>
        )}

        {status === AppStatus.PROCESSING && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="bg-white p-8 rounded-[2rem] shadow-2xl shadow-indigo-100 border border-slate-100 w-full max-w-md">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 relative overflow-hidden">
                   <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                   </svg>
                </div>
                <div>
                   <h3 className="text-lg font-bold text-slate-900">Forensic Analysis</h3>
                   <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Processing Evidence</p>
                </div>
              </div>
              
              <div className="space-y-5">
                {processingSteps.map((step, idx) => (
                  <div key={idx} className="flex items-center">
                    <div className={`
                      w-6 h-6 rounded-full flex items-center justify-center mr-4 border-2 transition-all duration-500
                      ${step.status === 'completed' 
                        ? 'bg-emerald-500 border-emerald-500 text-white scale-110' 
                        : step.status === 'current' 
                          ? 'border-indigo-600 border-t-transparent animate-spin' 
                          : 'border-slate-100 bg-slate-50'
                      }
                    `}>
                      {step.status === 'completed' && (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-sm font-medium transition-colors duration-300 ${
                      step.status === 'waiting' ? 'text-slate-300' : 
                      step.status === 'current' ? 'text-indigo-600' : 'text-slate-700'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {status === AppStatus.SUCCESS && analysis && fixedImage && preview && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <ChartComparison 
              analysis={analysis} 
              originalImage={preview} 
              fixedImage={fixedImage} 
            />
            
            <div className="mt-12 bg-indigo-600 p-8 rounded-3xl text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
              <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
              <div className="relative">
                <h3 className="text-xl font-bold mb-4">Why we corrected this</h3>
                <p className="text-indigo-100 text-sm leading-relaxed mb-8 max-w-2xl">
                  Data visualization is often weaponized by hiding the 0-baseline. When the Y-axis starts near the minimum data point, tiny fluctuations appear as massive trends. By restoring the baseline, we return the data to its proper context.
                </p>
                <div className="flex space-x-4">
                  <button 
                    onClick={() => reset()}
                    className="bg-white text-indigo-600 px-6 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-indigo-900/20 hover:scale-105 transition-transform"
                  >
                    Audit Another Chart
                  </button>
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
            <h2 className="text-2xl font-black text-slate-900 mb-2">Error Occurred</h2>
            <p className="text-slate-500 mb-8 font-medium">{error}</p>
            <button onClick={reset} className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-colors">
              Restart
            </button>
          </div>
        )}
      </main>

      <footer className="max-w-7xl mx-auto px-4 py-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-widest">
        <div>TruthAxis &copy; 2026</div>
        <div className="mt-4 md:mt-0">Always verify raw data before sharing. Values estimated via CV.</div>
      </footer>
    </div>
  );
};

export default App;
