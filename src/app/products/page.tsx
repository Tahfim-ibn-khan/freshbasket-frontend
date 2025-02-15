"use client";
import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import api from "../utils/axios";

const Products = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    if (typeof window === "undefined") return; // ✅ Prevent SSR hydration issues

    const fetchProducts = async () => {
      try {
        const res = await api.get("/products/getall") || {};
        setProducts(res.data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p className="text-center text-gray-600">Loading products...</p>;

  // ✅ Ensure products is always an array
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✅ Ensure pagination logic works correctly
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold mb-6 text-green-700 text-center">
        🥦 Fresh & Organic Products
      </h2>

      {/* ✅ Search & Filter Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        {/* 🔍 Search Bar */}
        <div className="w-full md:w-1/2 flex items-center border border-gray-300 rounded-lg overflow-hidden">
          <input
            type="text"
            placeholder="Search for fresh vegetables..."
            className="w-full px-4 py-2 outline-none focus:ring-2 focus:ring-green-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="px-3 py-2 bg-green-500 text-white hover:bg-green-600 transition">
            🔍
          </button>
        </div>

        {/* 📌 Category Filter */}
        <div className="w-full md:w-1/3">
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-400"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {["All", "Vegetables", "Fruits", "Organic", "Dairy"].map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ✅ No Products Found */}
      {paginatedProducts.length === 0 ? (
        <p className="text-center text-red-500 font-semibold">No products found.</p>
      ) : (
        <>
          {/* ✅ Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* ✅ Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <button
                className={`px-4 py-2 mx-2 rounded-lg transition duration-300 ${
                  currentPage === 1
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-green-500 text-white hover:bg-green-600"
                }`}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                ⬅ Previous
              </button>
              <span className="px-4 py-2 text-lg font-semibold text-green-700">
                Page {currentPage} / {totalPages}
              </span>
              <button
                className={`px-4 py-2 mx-2 rounded-lg transition duration-300 ${
                  currentPage === totalPages
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-green-500 text-white hover:bg-green-600"
                }`}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next ➡
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Products;
