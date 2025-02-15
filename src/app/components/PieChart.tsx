"use client";
import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ orders }) => {
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
