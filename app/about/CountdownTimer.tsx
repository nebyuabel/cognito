"use client";

import { useState, useEffect } from "react";

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    years: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const birthDate = new Date("2008-11-16");
      const deathDate = new Date(birthDate);
      deathDate.setFullYear(birthDate.getFullYear() + 80); // 80 years from birth

      const now = new Date();
      const difference = deathDate.getTime() - now.getTime();

      if (difference > 0) {
        const years = Math.floor(difference / (1000 * 60 * 60 * 24 * 365.25));
        const days = Math.floor(
          (difference % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24)
        );
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ years, days, hours, minutes, seconds });
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center">
      <h3 className="text-lg font-semibold text-black mb-4">Time Remaining</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-2xl mx-auto">
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold text-primary">
            {timeLeft.years}
          </div>
          <div className="text-black/60 text-sm">Years</div>
        </div>
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold text-primary">
            {timeLeft.days}
          </div>
          <div className="text-black/60 text-sm">Days</div>
        </div>
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold text-primary">
            {timeLeft.hours}
          </div>
          <div className="text-black/60 text-sm">Hours</div>
        </div>
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold text-primary">
            {timeLeft.minutes}
          </div>
          <div className="text-black/60 text-sm">Minutes</div>
        </div>
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold text-primary">
            {timeLeft.seconds}
          </div>
          <div className="text-black/60 text-sm">Seconds</div>
        </div>
      </div>
      <p className="text-grey-200/60 text-sm mt-4">
        Estimated time until 80 years from birth
      </p>
    </div>
  );
}
