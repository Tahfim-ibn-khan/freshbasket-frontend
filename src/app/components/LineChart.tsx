"use client";

import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from "chart.js";

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

// Define type for each sales data entry
interface SalesEntry {
  date: string;
  sales: number;
}

// Define props type
interface LineChartProps {
  salesData: SalesEntry[];
}

const LineChart: React.FC<LineChartProps> = ({ salesData }) => {
  const data = {
    labels: salesData.map((s) => s.date),
    datasets: [
      {
        label: "Sales ($)",
        data: salesData.map((s) => s.sales),
        borderColor: "#4CAF50",
        fill: false,
      },
    ],
  };

  return <Line data={data} />;
};

export default LineChart;
