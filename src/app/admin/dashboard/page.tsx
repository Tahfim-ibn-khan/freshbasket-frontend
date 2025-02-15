"use client";
import React, { useEffect, useState } from "react";
import api from "../../utils/axios";
import dynamic from "next/dynamic";

const BarChart = dynamic(() => import("../../components/BarChart"), { ssr: false });

const AdminDashboard = () => {
  const [productStats, setProductStats] = useState({ totalProducts: 0, totalQuantity: 0 });
  const [sales, setSales] = useState(0);
  const [users, setUsers] = useState({ totalUsers: 0, customers: 0, deliveryAgents: 0, storeManagers: 0 });
  const [timePeriod, setTimePeriod] = useState("month");

  useEffect(() => {
    fetchProductStats();
    fetchSales(timePeriod);
    fetchUserStats();
  }, [timePeriod]);

  const fetchProductStats = async () => {
    try {
      const res = await api.get("/admin/products");
      setProductStats(res.data || { totalProducts: 0, totalQuantity: 0 });
    } catch (error: any) {
      console.warn("Warning: Error fetching product stats. Defaulting to 0.");
      setProductStats({ totalProducts: 0, totalQuantity: 0 });
    }
  };

  const fetchSales = async (time: string) => {
    try {
      const res = await api.get(`/admin/sales?timePeriod=${time}`);
      setSales(res.data || 0);
    } catch (error: any) {
      console.warn("Warning: Error fetching sales data. Defaulting to 0.");
      setSales(0);
    }
  };

  const fetchUserStats = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data || { totalUsers: 0, customers: 0, deliveryAgents: 0, storeManagers: 0 });
    } catch (error: any) {
      console.warn("Warning: Error fetching user stats. Defaulting to 0.");
      setUsers({ totalUsers: 0, customers: 0, deliveryAgents: 0, storeManagers: 0 });
    }
  };

  return (
    <div className="container mx-auto p-6">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all">
          <h3 className="text-lg font-semibold">Total Products</h3>
          <p className="text-4xl font-bold">{productStats.totalProducts}</p>
        </div>

        <div className="bg-green-500 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all">
          <h3 className="text-lg font-semibold">Total Quantity</h3>
          <p className="text-4xl font-bold">{productStats.totalQuantity}</p>
        </div>

        <div className="bg-purple-500 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all">
          <h3 className="text-lg font-semibold">Total Users</h3>
          <p className="text-4xl font-bold">{users.totalUsers}</p>
        </div>
      </div>

      <div className="bg-white p-6 mt-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700">Total Sales</h3>
        <div className="flex items-center gap-4 mt-4">
          <select
            className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
          >
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
          </select>
          <p className="text-4xl font-bold text-green-600">Tk. {sales}</p>
        </div>
      </div>

      <div className="bg-white p-6 mt-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700">User Distribution</h3>
        <div className="mt-4">
          <BarChart users={users} />
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
