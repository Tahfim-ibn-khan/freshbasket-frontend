"use client";
import React, { useState, useEffect } from "react";
import api from "../utils/axios";

const OrderHistory = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (!user?.id) return;

        const res = await api.get(`/order/history/${user.id}`);
        setOrders(res.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p className="text-center text-gray-600">Loading order history...</p>;

  return (
<div className="container mx-auto p-6 max-w-4xl">
  <h2 className="text-3xl font-bold text-green-700 text-center mb-6">📜 Your Order History</h2>

  {orders.length === 0 ? (
    <p className="text-gray-500 text-center">No past orders found.</p>
  ) : (
    <div className="space-y-6">
      {orders.map((order) => (
        <div
          key={order.id}
          className="border p-6 rounded-lg shadow-lg bg-white transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xl font-semibold text-gray-800">Order #{order.id}</h3>
            <span
              className={`px-3 py-1 text-sm font-semibold rounded-lg ${
                order.status === "paid"
                  ? "bg-green-500 text-white"
                  : "bg-yellow-500 text-black"
              }`}
            >
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>

          <div className="text-gray-700 space-y-1">
            <p><strong>📅 Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
            <p><strong>💳 Payment Method:</strong> {order.paymentMethod}</p>
            <p><strong>📍 Delivery Address:</strong> {order.deliveryAddress}</p>
            <p><strong>📞 Phone Number:</strong> {order.phoneNumber}</p>
            <p><strong>📝 Delivery Instructions:</strong> {order.deliveryInstructions || "None"}</p>
          </div>

          <div className="mt-4">
            <h4 className="text-lg font-semibold text-gray-800">🛍 Ordered Products</h4>
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse mt-2 shadow-sm">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="p-3 text-left">Product</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Unit Price</th>
                    <th className="p-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.products.map((product) => (
                    <tr key={product.productId} className="border-b hover:bg-gray-50">
                      <td className="p-3">{product.productName}</td>
                      <td className="p-3 text-center">{product.quantity}</td>
                      <td className="p-3 text-right">Tk. {product.unitPrice}</td>
                      <td className="p-3 text-right font-semibold text-green-600">
                        Tk. {product.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <h3 className="text-xl font-bold text-gray-900">
              Total: <span className="text-green-600">Tk. {order.totalPrice}</span>
            </h3>
          </div>
        </div>
      ))}
    </div>
  )}
</div>
  );
};

export default OrderHistory;
