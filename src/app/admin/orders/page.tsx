"use client";
import React, { useEffect, useState } from "react";
import api from "../../utils/axios";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User not authenticated.");
        return;
      }

      const res = await api.get("/order/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to fetch orders. Please check the API.");
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const token = localStorage.getItem("token");

      await api.patch(
        `/order/update-status/${orderId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert(`Order #${orderId} updated to ${newStatus}`);
      fetchOrders(); // ✅ Refresh orders after update
    } catch (err) {
      console.error("Error updating order status:", err);
      alert("Failed to update order status.");
    }
  };

  const generateAndDownloadInvoice = async (orderId: number) => {
    try {
      const res = await api.get(`/invoice/generate/${orderId}`);

      if (res.data?.invoiceUrl) {
        alert(`Invoice for Order #${orderId} generated. Downloading...`);
        window.open(res.data.invoiceUrl, "_blank"); // ✅ Opens the Cloudinary PDF URL
      } else {
        throw new Error("Invoice generation failed.");
      }
    } catch (err) {
      console.error("Error generating invoice:", err);
      alert("Failed to generate invoice.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
        Order Management
      </h2>

      {error && (
        <p className="text-center text-red-600 bg-red-100 p-3 rounded-md border border-red-300">
          {error}
        </p>
      )}

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="border p-4 text-left">Order ID</th>
              <th className="border p-4 text-left">Customer</th>
              <th className="border p-4 text-right">Total</th>
              <th className="border p-4 text-center">Status</th>
              <th className="border p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="text-gray-700 bg-white hover:bg-gray-50 transition"
              >
                <td className="border p-4 font-semibold text-gray-900">
                  #{order.id}
                </td>
                <td className="border p-4">{order.user?.name || "N/A"}</td>
                <td className="border p-4 text-green-600 font-bold text-right">
                  Tk. {order.totalPrice}
                </td>

                <td className="border p-4 text-center">
                  <select
                    className="border px-3 py-2 rounded-lg bg-gray-100 text-gray-900 focus:ring-2 focus:ring-blue-400 outline-none"
                    value={order.status}
                    onChange={(e) =>
                      updateOrderStatus(order.id, e.target.value)
                    }
                  >
                    <option value="pending" className="text-yellow-500">
                      Pending
                    </option>
                    <option value="paid" className="text-green-600">
                      Paid
                    </option>
                    <option value="delivered" className="text-blue-500">
                      Delivered
                    </option>
                  </select>
                </td>

                <td className="border p-4 text-center">
                  <button
                    onClick={() => generateAndDownloadInvoice(order.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300"
                  >
                    Download Invoice
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
