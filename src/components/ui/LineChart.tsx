
import React from 'react';
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface LineChartProps {
  data: any;
  index: string;
  categories: string[];
  colors: string[];
  valueFormatter?: (value: number) => string;
  showLegend?: boolean;
  yAxisWidth?: number;
  startAtZero?: boolean;
}

export function LineChart({ 
  data, 
  index, 
  categories, 
  colors,
  valueFormatter = (value) => String(value),
  showLegend = true,
  yAxisWidth = 40,
  startAtZero = true
}: LineChartProps) {
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
      <RechartsLineChart
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
        <YAxis width={yAxisWidth} domain={startAtZero ? [0, 'auto'] : undefined} />
        <Tooltip formatter={valueFormatter} />
        {showLegend && <Legend />}
        {data.datasets.map((dataset: any, index: number) => (
          <Line
            key={index}
            type="monotone"
            dataKey={dataset.label}
            stroke={colors?.[index % colors.length] ? 
                   `rgb(${colors[index % colors.length]})` : 
                   dataset.borderColor || '#8884d8'}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            fill={dataset.backgroundColor || 'transparent'}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
