"use client";
import { Suspense } from "react";
import PaymentSuccessContent from "./PaymentSuccessContent";

const PaymentSuccess = () => {
  return (
    <Suspense fallback={<p className="text-center text-gray-600">Loading payment status...</p>}>
      <PaymentSuccessContent />
    </Suspense>
  );
};

export default PaymentSuccess;
