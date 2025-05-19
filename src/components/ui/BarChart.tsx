
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

interface BarChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
    }[];
  };
}

export function BarChart({ data }: BarChartProps) {
  // Convert the data format to what Recharts expects
  const formattedData = data.labels.map((label, index) => {
    const dataPoint: Record<string, any> = { name: label };
    
    data.datasets.forEach((dataset) => {
      dataPoint[dataset.label] = dataset.data[index];
    });
    
    return dataPoint;
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart
        data={formattedData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {data.datasets.map((dataset, index) => (
          <Bar
            key={index}
            dataKey={dataset.label}
            fill={dataset.backgroundColor}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
