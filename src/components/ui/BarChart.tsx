
import React from 'react';
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

export interface BarChartProps {
  data: any;
  index: string;
  categories: string[];
  colors: string[];
  valueFormatter?: (value: number) => string;
  showLegend?: boolean;
  showYAxis?: boolean;
  yAxisWidth?: number;
  startAtZero?: boolean;
}

export function BarChart({ 
  data, 
  index, 
  categories, 
  colors,
  valueFormatter = (value) => String(value),
  showLegend = true,
  showYAxis = true,
  yAxisWidth = 40,
  startAtZero = true
}: BarChartProps) {
  // Process data to make it compatible with Recharts
  const processedData = data.labels?.map((label: string, i: number) => {
    const item: Record<string, any> = { name: label };
    
    // Add each dataset's data point to this item
    data.datasets.forEach((dataset: any, datasetIndex: number) => {
      item[dataset.label] = dataset.data[i];
    });
    
    return item;
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart
        data={processedData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        {showYAxis && <YAxis width={yAxisWidth} domain={startAtZero ? [0, 'auto'] : undefined} />}
        <Tooltip formatter={valueFormatter} />
        {showLegend && <Legend />}
        {data.datasets.map((dataset: any, index: number) => (
          <Bar
            key={index}
            dataKey={dataset.label}
            fill={colors?.[index % colors.length] ? 
                  `rgb(${colors[index % colors.length]})` : 
                  dataset.backgroundColor || '#8884d8'}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
