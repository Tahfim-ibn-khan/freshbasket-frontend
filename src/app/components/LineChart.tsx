"use client";
import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend);

const LineChart = ({ salesData }) => {
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
