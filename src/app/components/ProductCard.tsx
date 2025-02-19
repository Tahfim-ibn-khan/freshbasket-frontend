"use client";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "../utils/axios";

const ProductCard = ({ product }: { product: any }) => {
  const [quantity, setQuantity] = useState(1);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
    }
  }, []);

  const handleAddToCart = async () => {
    if (!user?.id) {
      alert("Please log in to add items to the cart.");
      router.push("/auth/login");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Authentication required. Please log in.");
      router.push("/auth/login");
      return;
    }

    try {
      await api.post(
        "/cart/add",
        {
          userId: user.id,
          productId: product.id,
          quantity,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Item added to cart successfully!");
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  return (
    <div className="mx-auto mt-11 w-80 transform overflow-hidden rounded-lg bg-white dark:bg-slate-800 shadow-md duration-300 hover:scale-105 hover:shadow-2xl">
      <div className="relative overflow-hidden">
        <img
          className="h-48 w-full object-cover object-center transition-transform duration-300 hover:scale-110"
          src={product.img_url || "https://via.placeholder.com/150"}
          alt={product.title || "Product Image"}
        />
      </div>

      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h2 className="mb-2 text-lg font-semibold dark:text-white text-gray-900 hover:text-green-600 transition-colors duration-200 cursor-pointer">
            {product.title || "Unnamed Product"}
          </h2>
        </Link>

        <p className="mb-2 text-sm dark:text-gray-300 text-gray-700">
          {product.description?.length > 100
            ? `${product.description.substring(0, 100)}...`
            : product.description || "No description available."}
        </p>

        <div className="flex items-center">
          <p className="mr-2 text-lg font-semibold text-gray-900 dark:text-white">
            Tk.{product.price || "0.00"}
          </p>
          {product.discount > 0 && (
            <>
              <p className="text-base font-medium text-gray-500 line-through dark:text-gray-300">
                Tk.{(parseFloat(product.price) + parseFloat(product.discount)).toFixed(2)}
              </p>
              <p className="ml-auto text-sm font-medium text-green-500 bg-green-100 px-2 py-1 rounded-full">
                {((parseFloat(product.discount) / (parseFloat(product.price) + parseFloat(product.discount))) * 100).toFixed(0)}% off
              </p>
            </>
          )}
        </div>

        <div className="flex items-center mt-4 space-x-2">
          <button
            className="bg-gray-300 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-400 transition"
            onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}
          >
            −
          </button>
          <span className="text-lg font-medium">{quantity}</span>
          <button
            className="bg-gray-300 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-400 transition"
            onClick={() => setQuantity((prev) => prev + 1)}
          >
            +
          </button>

          <button
            className="ml-auto bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition duration-200 transform hover:scale-105"
            onClick={handleAddToCart}
          >
            🛒 Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
