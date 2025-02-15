"use client";
import React, { useEffect, useState } from "react";
import api from "../../utils/axios";
import Link from "next/link";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); 
  
  const [error, setError] = useState(null); 

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products/getall");
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/products/delete/${id}`); 
      setProducts(products.filter((product) => product.id !== id));
      alert("Product deleted successfully.");
    } catch (err) {
      console.error("Failed to delete product:", err);
      alert("Failed to delete the product. Please try again.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">


      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Manage Products</h2>

      <div className="flex justify-center mb-6">
        <Link
          href="/admin/products/create"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          Add New Product
        </Link>
      </div>

      {loading && <p className="text-center text-gray-600">Loading products...</p>}

      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product.id}
                className="bg-white p-4 shadow-md rounded-lg transition duration-300 hover:shadow-xl"
              >
                <img
                  src={product.img_url || "https://via.placeholder.com/150"}
                  alt={product.title}
                  className="h-40 w-full object-cover rounded-lg"
                />

                <h3 className="text-lg font-semibold text-gray-900 mt-3">{product.title}</h3>

                <p
                  className="text-gray-600 text-sm mt-1"
                  title={product.description}
                >
                  {product.description.length > 50
                    ? `${product.description.substring(0, 50)}...`
                    : product.description}
                </p>

                <p className="text-blue-600 font-bold mt-2">Tk. {product.price}</p>

                <div className="flex justify-between mt-3">
                  <Link
                    href={`/admin/products/update/${product.id}`}
                    className="text-blue-500 font-medium hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-500 font-medium hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center col-span-full text-gray-600">
              No products found.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
