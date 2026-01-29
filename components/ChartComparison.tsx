
import React, { useState } from 'react';
import { GraphAnalysis } from '../types';

interface ChartComparisonProps {
  analysis: GraphAnalysis;
  originalImage: string;
  fixedImage: string;
}

const ChartComparison: React.FC<ChartComparisonProps> = ({ analysis, originalImage, fixedImage }) => {
  const [showDataTable, setShowDataTable] = useState(false);

  const downloadFixedChart = () => {
    const link = document.createElement('a');
    link.download = `truthaxis-fixed-${analysis.title.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.href = fixedImage;
    link.click();
  };

  return (
    <div className="space-y-8">
      {/* Deception Index Banner */}
      <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row">
          <div className="p-8 md:w-2/3 border-b md:border-b-0 md:border-r border-slate-800">
            <h2 className="text-white text-xl font-bold mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Forensic Audit Report
            </h2>
            <p className="text-slate-400 text-sm italic leading-relaxed mb-6">
              "{analysis.reasoning}"
            </p>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                 <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Detected Baseline</div>
                 <div className="text-white font-mono">{analysis.detectedYAxisStart} units</div>
               </div>
               <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                 <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Visual Exaggeration</div>
                 <div className="text-white font-mono">
                   {analysis.isMisleading ? `${(analysis.detectedYAxisEnd / (analysis.detectedYAxisEnd - analysis.detectedYAxisStart)).toFixed(1)}x` : '1.0x'}
                 </div>
               </div>
            </div>
          </div>
          
          <div className="p-8 md:w-1/3 flex flex-col items-center justify-center bg-slate-800/20">
            <div className="text-[10px] text-slate-500 uppercase font-bold mb-2">Deception Index</div>
            <div className={`text-5xl font-black mb-1 ${analysis.deceptionScore > 50 ? 'text-rose-500' : 'text-emerald-500'}`}>
              {analysis.deceptionScore}
            </div>
            <div className="text-xs text-slate-400 font-medium">Out of 100</div>
            <div className="w-full h-1.5 bg-slate-700 rounded-full mt-4 overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${analysis.deceptionScore > 50 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                style={{ width: `${analysis.deceptionScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Side by Side Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Original */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Original Visual Bias</h3>
          </div>
          <div className="aspect-square relative rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm group">
            <img 
              src={originalImage} 
              alt="Original Chart" 
              className="w-full h-full object-contain p-4"
            />
            <div className="absolute top-4 right-4 bg-rose-100 text-rose-600 text-[10px] font-bold px-2 py-1 rounded border border-rose-200 uppercase tracking-wide">
              Misleading Axis
            </div>
          </div>
        </div>

        {/* Fixed Reality */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-500">Fixed Reality (AI Generated)</h3>
            <button 
              onClick={downloadFixedChart}
              className="text-[10px] font-bold px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors uppercase tracking-wide"
            >
              Download PNG
            </button>
          </div>
          <div className="aspect-square relative rounded-2xl overflow-hidden bg-white border-2 border-indigo-100 shadow-lg shadow-indigo-100 group">
             <img 
              src={fixedImage} 
              alt="Fixed Chart" 
              className="w-full h-full object-contain p-4"
            />
            <div className="absolute top-4 right-4 bg-indigo-100 text-indigo-600 text-[10px] font-bold px-2 py-1 rounded border border-indigo-200 uppercase tracking-wide">
              Zero Baseline
            </div>
          </div>
        </div>
      </div>

      {/* Data Transparency Toggle */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <button 
          onClick={() => setShowDataTable(!showDataTable)}
          className="w-full px-6 py-4 flex items-center justify-between text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
        >
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Extracted Raw Data Points
          </span>
          <svg className={`w-4 h-4 transition-transform ${showDataTable ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {showDataTable && (
          <div className="p-6 border-t border-slate-100 animate-in slide-in-from-top-2 duration-300">
            <table className="w-full text-sm text-left">
              <thead className="text-slate-500 uppercase text-[10px] font-bold">
                <tr>
                  <th className="pb-3 px-2">Label</th>
                  <th className="pb-3 px-2">Value</th>
                  <th className="pb-3 px-2">Relative Weight</th>
                </tr>
              </thead>
              <tbody className="text-slate-700 font-mono">
                {analysis.data.map((item, idx) => {
                  const maxVal = Math.max(...analysis.data.map(d => d.value));
                  const percent = (item.value / maxVal) * 100;
                  return (
                    <tr key={idx} className="border-t border-slate-50">
                      <td className="py-3 px-2 font-medium">{item.label}</td>
                      <td className="py-3 px-2">{item.value}</td>
                      <td className="py-3 px-2">
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500" style={{ width: `${percent}%` }} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartComparison;
