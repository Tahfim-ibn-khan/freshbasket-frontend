"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../utils/axios";

const PlaceOrder = () => {
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleOrderPlacement = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user?.id) throw new Error("User not found");

      const res = await api.post("/order/place", {
        userId: user.id,
        paymentMethod,
        deliveryAddress,
        phoneNumber,
        deliveryInstructions,
      });

      alert(res.data.message);
      const orderId = res.data.orderId;

      if (paymentMethod === "Cash on Delivery") {
        router.push("/orders"); 
      } else {
        const checkoutRes = await api.post(`/payment/checkout/${orderId}`);
        if (checkoutRes.data.paymentUrl) {
          window.location.href = checkoutRes.data.paymentUrl; 
        } else {
          throw new Error("Failed to get Stripe payment URL.");
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Order placement failed.");
    }
  };

  return (
    <div className="container mx-auto max-w-lg p-6 m-10 bg-white shadow-lg rounded-lg">

  <h2 className="text-3xl font-bold text-green-700 text-center mb-6">🚚 Place Your Order</h2>


  {error && (
    <div className="text-red-600 text-sm bg-red-100 p-3 rounded-lg border border-red-300 mb-4">
      {error}
    </div>
  )}


  <form onSubmit={handleOrderPlacement} className="space-y-5">
    <div>
      <label className="block text-gray-700 font-medium mb-1">📍 Delivery Address</label>
      <input
        type="text"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
        value={deliveryAddress}
        onChange={(e) => setDeliveryAddress(e.target.value)}
        required
        placeholder="Enter your delivery address"
      />
    </div>

    <div>
      <label className="block text-gray-700 font-medium mb-1">📞 Phone Number</label>
      <input
        type="tel"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        required
        placeholder="Enter your phone number"
      />
    </div>

    <div>
      <label className="block text-gray-700 font-medium mb-1">📝 Delivery Instructions</label>
      <textarea
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
        value={deliveryInstructions}
        onChange={(e) => setDeliveryInstructions(e.target.value)}
        placeholder="e.g., Leave at the front door"
      />
    </div>

    <div>
      <label className="block text-gray-700 font-medium mb-1">💳 Payment Method</label>
      <select
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none"
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
      >
        <option>Credit Card</option>
        <option>Cash on Delivery</option>
      </select>
    </div>

    <button
      type="submit"
      className="w-full bg-green-500 text-white text-lg font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-green-600 hover:scale-105 transition-all duration-300"
    >
      Confirm Order
    </button>
  </form>
</div>

  );
};

export default PlaceOrder;
