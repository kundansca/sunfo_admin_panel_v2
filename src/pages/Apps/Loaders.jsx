import React, { useState, useEffect } from "react";
import "./Loader.css"; // Loader ke liye CSS file import karein

const Loaders = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for 3 seconds
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {loading && <Loader />}
      {!loading && <h1>Page Content Here</h1>}
    </div>
  );
};

const Loader = () => {
  return (
    <div className="loader-overlay">
      <div className="spinner"></div>
    </div>
  );
};

export default Loaders;
