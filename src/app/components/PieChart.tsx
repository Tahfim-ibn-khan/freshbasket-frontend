"use client";

import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register required Chart.js elements
ChartJS.register(ArcElement, Tooltip, Legend);

// Define interface for orders data
interface OrdersData {
  pending: number;
  paid: number;
  delivered: number;
}

// Define props type
interface PieChartProps {
  orders: OrdersData;
}

const PieChart: React.FC<PieChartProps> = ({ orders }) => {
  const data = {
    labels: ["Pending", "Paid", "Delivered"],
    datasets: [
      {
        label: "Orders",
        data: [orders.pending, orders.paid, orders.delivered],
        backgroundColor: ["#FF9800", "#4CAF50", "#2196F3"],
      },
    ],
  };

  return <Pie data={data} />;
};

export default PieChart;
