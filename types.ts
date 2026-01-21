
export interface ChartDataItem {
  label: string;
  value: number;
}

export interface ChartStyle {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  gridColor: string;
  fontFamily: 'sans-serif' | 'serif' | 'mono';
}

export interface GraphAnalysis {
  title: string;
  chartType: 'bar' | 'line' | 'area';
  data: ChartDataItem[];
  isMisleading: boolean;
  reasoning: string;
  detectedYAxisStart: number;
  detectedYAxisEnd: number;
  xAxisLabel: string;
  yAxisLabel: string;
  style: ChartStyle;
  deceptionScore: number; // 0 to 100
}

export enum AppStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
