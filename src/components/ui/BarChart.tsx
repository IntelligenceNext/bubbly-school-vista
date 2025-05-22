
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
  // Check if we have valid data before proceeding
  if (!data) {
    console.error("No data provided to BarChart");
    return <div>No data available</div>;
  }
  
  // Determine if we're using the format provided directly or need to process it
  const processedData = Array.isArray(data) 
    ? data 
    : (data.datasets && data.labels)
      ? data.labels.map((label: string, i: number) => {
          const item: Record<string, any> = { name: label };
          data.datasets.forEach((dataset: any, datasetIndex: number) => {
            item[dataset.label] = dataset.data[i];
          });
          return item;
        })
      : data;

  // Check if categories array is valid before mapping  
  if (!categories || !Array.isArray(categories)) {
    console.error("Invalid categories array provided to BarChart");
    return <div>Invalid chart configuration</div>;
  }

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
        <XAxis dataKey={index || "name"} />
        {showYAxis && <YAxis width={yAxisWidth} domain={startAtZero ? [0, 'auto'] : undefined} />}
        <Tooltip formatter={valueFormatter} />
        {showLegend && <Legend />}
        {categories.map((category, idx) => (
          <Bar
            key={idx}
            dataKey={category}
            fill={colors?.[idx % colors.length] ? 
                  `rgb(${colors[idx % colors.length]})` : 
                  `#${Math.floor(Math.random()*16777215).toString(16)}`}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
