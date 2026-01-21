
import React, { useRef, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area 
} from 'recharts';
import { toPng } from 'html-to-image';
import { GraphAnalysis } from '../types';

interface ChartComparisonProps {
  analysis: GraphAnalysis;
}

const ChartComparison: React.FC<ChartComparisonProps> = ({ analysis }) => {
  const fixedChartRef = useRef<HTMLDivElement>(null);
  const [showDataTable, setShowDataTable] = useState(false);

  const downloadFixedChart = async () => {
    if (fixedChartRef.current === null) return;
    try {
      const dataUrl = await toPng(fixedChartRef.current, { cacheBust: true, backgroundColor: '#ffffff' });
      const link = document.createElement('a');
      link.download = `truthaxis-fixed-${analysis.title.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download failed', err);
    }
  };

  const getFontFamily = (font: string) => {
    switch (font) {
      case 'serif': return "'Times New Roman', serif";
      case 'mono': return "'JetBrains Mono', monospace";
      default: return "'Inter', sans-serif";
    }
  };

  const renderChart = (isFixed: boolean) => {
    const yDomain = isFixed ? [0, 'auto'] : [analysis.detectedYAxisStart, analysis.detectedYAxisEnd];
    const data = analysis.data;
    const title = isFixed ? "Fixed Reality" : "Original Visual Bias";
    const ChartComponent = analysis.chartType === 'bar' ? BarChart : 
                         analysis.chartType === 'line' ? LineChart : AreaChart;

    return (
      <div 
        ref={isFixed ? fixedChartRef : null}
        className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex-1 min-w-[300px]"
        style={{ fontFamily: getFontFamily(analysis.style.fontFamily) }}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-xs font-bold uppercase tracking-widest ${isFixed ? 'text-indigo-600' : 'text-slate-400'}`}>
            {title}
          </h3>
          {isFixed && (
            <button 
              onClick={downloadFixedChart}
              className="text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded transition-colors"
            >
              DOWNLOAD PNG
            </button>
          )}
        </div>

        <div className="h-[300px] w-full" style={{ backgroundColor: analysis.style.backgroundColor }}>
          <ResponsiveContainer width="100%" height="100%">
            <ChartComponent data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={analysis.style.gridColor || "#f1f5f9"} />
              <XAxis 
                dataKey="label" 
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 11 }} 
              />
              <YAxis 
                domain={yDomain} 
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 11 }} 
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: '1px solid #e2e8f0', 
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  fontSize: '12px'
                }}
              />
              {analysis.chartType === 'bar' && (
                <Bar dataKey="value" fill={analysis.style.primaryColor} radius={[2, 2, 0, 0]} />
              )}
              {analysis.chartType === 'line' && (
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={analysis.style.primaryColor} 
                  strokeWidth={2.5} 
                  dot={{ r: 4, fill: analysis.style.primaryColor, strokeWidth: 2, stroke: '#fff' }} 
                />
              )}
              {analysis.chartType === 'area' && (
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke={analysis.style.primaryColor} 
                  fill={analysis.style.primaryColor} 
                  fillOpacity={0.2}
                />
              )}
            </ChartComponent>
          </ResponsiveContainer>
        </div>
      </div>
    );
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
                 <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Visual Multiplier</div>
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

      <div className="flex flex-col lg:flex-row gap-6">
        {renderChart(false)}
        {renderChart(true)}
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
