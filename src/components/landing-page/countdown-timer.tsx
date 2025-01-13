/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { IconFlame } from "@tabler/icons-react";
import React, { useState, useEffect } from "react";

const CountdownTimer = () => {
  const promoEndDate = new Date("2025-01-20T23:59:59");
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const timeDifference = promoEndDate.getTime() - now.getTime();

      if (timeDifference > 0) {
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
        const seconds = Math.floor((timeDifference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        // If timeDifference <= 0, the promo has ended
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    // Update the countdown every second
    const timer = setInterval(updateCountdown, 1000);

    // Clear interval when component unmounts
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="py-5 px-10 flex justify-between text-white items-center mt-10 rounded-lg bg-green-900 w-full">
      <div className="flex items-center gap-1">
        <IconFlame size={30} />
        <p className="text-xl font-semibold">Ends In:</p>
      </div>

      <div className="flex gap-3 items-center">
        <div className="flex items-center justify-center flex-col">
          <p className="font-semibold text-2xl">{timeLeft.days}</p>
          <p className="text-sm">Days</p>
        </div>
        <p className="mx-3 font-bold text-2xl">:</p>
        <div className="flex items-center justify-center flex-col">
          <p className="font-semibold text-2xl">{timeLeft.hours}</p>
          <p className="text-sm">Hours</p>
        </div>
        <p className="mx-3 font-bold text-2xl">:</p>
        <div className="flex items-center justify-center flex-col">
          <p className="font-semibold text-2xl">{timeLeft.minutes}</p>
          <p className="text-sm">Mins</p>
        </div>
        <p className="mx-3 font-bold text-2xl">:</p>
        <div className="flex items-center justify-center flex-col">
          <p className="font-semibold text-2xl">{timeLeft.seconds}</p>
          <p className="text-sm">Sec</p>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
