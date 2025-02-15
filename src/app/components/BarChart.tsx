"use client";
import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ users }) => {
  const data = {
    labels: ["Customers", "Delivery Agents", "Store Managers"],
    datasets: [
      {
        label: "User Count",
        data: [users.customers, users.deliveryAgents, users.storeManagers],
        backgroundColor: ["#4CAF50", "#FF9800", "#2196F3"],
      },
    ],
  };

  return <Bar data={data} />;
};

export default BarChart;
