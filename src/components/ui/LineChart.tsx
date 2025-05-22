
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
  // Check if we have valid data before proceeding
  if (!data) {
    console.error("No data provided to LineChart");
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
        <XAxis dataKey={index || "name"} />
        <YAxis width={yAxisWidth} domain={startAtZero ? [0, 'auto'] : undefined} />
        <Tooltip formatter={valueFormatter} />
        {showLegend && <Legend />}
        {categories.map((category, idx) => (
          <Line
            key={idx}
            type="monotone"
            dataKey={category}
            stroke={colors?.[idx % colors.length] ? 
                  `rgb(${colors[idx % colors.length]})` : 
                  `#${Math.floor(Math.random()*16777215).toString(16)}`}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
