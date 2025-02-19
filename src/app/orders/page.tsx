"use client";

import React, { useState, useEffect } from "react";
import api from "../utils/axios";
import { useRouter } from "next/navigation";

// Define types for products and orders
interface Product {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Order {
  id: number;
  orderDate: string;
  paymentMethod: string;
  deliveryAddress: string;
  phoneNumber: string;
  deliveryInstructions?: string;
  status: string;
  totalPrice: number;
  products: Product[];
}

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("User not authenticated.");
      router.push("/auth/login");
      return;
    }

    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await api.get("/orders/history", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to fetch order history.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center text-gray-600">Loading order history...</p>;

  if (error)
    return (
      <p className="text-center text-red-600 bg-red-100 p-3 rounded-md border border-red-300">
        {error}
      </p>
    );

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h2 className="text-3xl font-bold text-green-700 text-center mb-6">Your Order History</h2>

      {orders.length === 0 ? (
        <p className="text-gray-500 text-center">No past orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border p-6 rounded-lg shadow-lg bg-white">
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
                <p>
                  <strong>Order Date:</strong>{" "}
                  {new Date(order.orderDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>Payment Method:</strong> {order.paymentMethod}
                </p>
                <p>
                  <strong>Delivery Address:</strong> {order.deliveryAddress}
                </p>
                <p>
                  <strong>Phone Number:</strong> {order.phoneNumber}
                </p>
                <p>
                  <strong>Delivery Instructions:</strong>{" "}
                  {order.deliveryInstructions || "None"}
                </p>
              </div>

              <div className="mt-4">
                <h4 className="text-lg font-semibold text-gray-800">Ordered Products</h4>
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
                      {order.products.map((product: Product) => (
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
