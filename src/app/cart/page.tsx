"use client";
import React, { useState, useEffect } from "react";
import api from "../utils/axios";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

const CartPage = () => {
  const { user, updateCartCount } = useAuth();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    if (user?.id) {
      fetchCart();
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      if (!user?.id) return; // ✅ Ensure user is logged in before fetching
  
      const res = await api.get(`/cart/${user.id}`);
      
      setCartItems(res.data);
      updateCartCount(res.data.length || 0);
  
      const total = res.data.reduce(
        (sum: number, item: any) => sum + item.product.price * item.quantity,
        0
      );
      setTotalAmount(total);
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.warn("Cart is empty, setting default values.");
        setCartItems([]); // ✅ Set cart items to an empty array
        setTotalAmount(0);
        updateCartCount(0);
      } else {
        console.error("Error fetching cart items:", error.response?.data || error);
      }
    } finally {
      setLoading(false);
    }
  };
  

  const updateQuantity = async (orderId: number, newQuantity: number) => {
    try {
      await api.patch(`/cart/update/${orderId}`, {
        userId: user.id,
        quantity: newQuantity,
      });
      fetchCart();
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const removeItem = async (orderId: number) => {
    try {
      await api.delete(`/cart/remove/${orderId}`, {
        data: { userId: user.id },
      });
      fetchCart(); 
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const proceedToOrder = () => {
    router.push("/order/place");
  };

  return (
<div className="container mx-auto p-6">
  <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">🛒 Your Shopping Cart</h2>

  {loading ? (
    <p className="text-center text-gray-600">Loading cart...</p>
  ) : cartItems.length === 0 ? (
    <p className="text-center text-gray-600">Your cart is empty.</p>
  ) : (
    <>
      <div className="space-y-4">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 bg-white shadow-lg rounded-lg transition-all duration-300 hover:shadow-2xl">
            <div className="flex items-center">
              <img
                className="w-16 h-16 rounded-lg object-cover"
                src={item.product.img_url || "https://via.placeholder.com/50"}
                alt={item.product.title}
              />
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">{item.product.title}</h3>
                <p className="text-gray-600 text-sm">Tk. {item.product.price}</p>
              </div>
            </div>

            <div className="flex items-center bg-gray-100 px-2 py-1 rounded-lg">
              <button
                className="bg-gray-300 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-400 transition"
                onClick={() => updateQuantity(item.id, Math.max(item.quantity - 1, 1))}
              >
                −
              </button>
              <span className="mx-3 text-lg font-semibold">{item.quantity}</span>
              <button
                className="bg-gray-300 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-400 transition"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              >
                +
              </button>
            </div>

            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-1 hover:bg-red-600 transition duration-200"
              onClick={() => removeItem(item.id)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-md text-center">
        <h3 className="text-xl font-semibold text-gray-900">
          Total Amount: <span className="text-green-600">Tk. {totalAmount.toFixed(2)}</span>
        </h3>
      </div>

      <div className="mt-6 flex justify-center">
        <button
          className="bg-green-500 text-white text-lg font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-green-600 hover:scale-105 transition-all duration-300"
          onClick={proceedToOrder}
        >
          ✅ Proceed to Checkout
        </button>
      </div>
    </>
  )}
</div>

  );
};

export default CartPage;
