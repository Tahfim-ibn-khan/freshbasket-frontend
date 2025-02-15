'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const Home = () => {
  const [role, setRole] = useState<'admin' | 'customer' | null>(null);

  const handleLogout = () => {
    setRole(null);
  };

  return (
<div>
  <div
    className="hero min-h-screen"
    style={{
      backgroundImage: "url(https://source.unsplash.com/1600x900/?fresh,vegetables)",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}>
    <div className="hero-overlay bg-black bg-opacity-50"></div>
    <div className="hero-content text-center text-neutral-content">
      <div className="max-w-lg">
        <h1 className="mb-5 text-5xl font-extrabold text-green-400 drop-shadow-lg">
          Fresh, Organic & Healthy!
        </h1>
        <p className="mb-5 text-lg text-gray-200">
          Enjoy the <b>freshest</b> and <b>organic</b> <b>vegetables</b> delivered straight from the farm to your doorstep.  
          Eat healthy, live better! 🌱  
        </p>
        <Link href="/products" className="btn btn-primary text-white text-lg px-8 py-3 rounded-lg transition-all duration-300 hover:bg-green-600 hover:scale-105">
          Shop Now
        </Link>
      </div>
    </div>
  </div>
</div>
  );
};

export default Home;
