"use client";
import React, { Suspense } from "react";
import ResetPassword from "./ResetPassword"; 

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<p className="text-center text-gray-600">Loading...</p>}>
      <ResetPassword />
    </Suspense>
  );
}
