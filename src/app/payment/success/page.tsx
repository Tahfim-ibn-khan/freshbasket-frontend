"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "../../utils/axios";

const PaymentSuccess = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        if (!orderId) {
          setMessage("Invalid order ID.");
          return;
        }
        await api.post(`/payment/success/${orderId}`);
        setMessage("Payment successful! Your order is now confirmed.");
      } catch (error) {
        setMessage("Payment verification failed.");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [orderId]);

  return (
    <div className="container mx-auto p-6 text-center">
      <h2 className="text-3xl font-semibold mb-4">Payment Status</h2>
      {loading ? <p>Processing payment...</p> : <p>{message}</p>}
      <button
        onClick={() => router.push("/orders")}
        className="mt-4 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition duration-200"
      >
        View Orders
      </button>
    </div>
  );
};

export default PaymentSuccess;
