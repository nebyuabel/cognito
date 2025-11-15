"use client";

import { useState, useEffect } from "react";

export default function CountupTimer() {
  const [days, setDays] = useState(0);

  useEffect(() => {
    const calculateDays = () => {
      const birthDate = new Date("2008-11-16");
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - birthDate.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      setDays(diffDays);
    };

    calculateDays();
    const interval = setInterval(calculateDays, 1000 * 60 * 60); // Update every hour

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center">
      <h3 className="text-lg font-semibold text-black mb-2">Time Lived</h3>
      <div className="text-3xl md:text-4xl font-bold text-primary">
        {days.toLocaleString()} days
      </div>
      <p className="text-black/60 text-sm mt-2">Since November 16, 2008</p>
    </div>
  );
}
