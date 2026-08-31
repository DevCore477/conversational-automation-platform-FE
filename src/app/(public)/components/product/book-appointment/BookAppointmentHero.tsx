"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import BookOnCalendarImg from "@/assets/Product/Book Appointment/Book-On-Calendar.png";
import Button from "../../Button";
import { HexaRGBLogo } from "@/assets";
import Link from "next/link";
const CalendarWidget = () => {
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const blanks = 1;
  const totalDays = 30;
  const today = 19;

  return (
    <div className="bg-white rounded-xl shadow-2xl border border-[#0EA5E9]/10 p-4 w-[180px] 2xl:w-[220px]">
      <div className="flex items-center justify-between mb-3">
        <button className="text-gray-300 hover:text-[#0EA5E9] transition-colors">
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <span className="text-[10px] 2xl:text-xs font-semibold text-dark-gray tracking-wide font-dm-sans">
          September 2025
        </span>
        <button className="text-gray-300 hover:text-[#0EA5E9] transition-colors">
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-0 mb-1">
        {days.map((day) => (
          <div
            key={day}
            className="text-center text-[6px] 2xl:text-[7px] font-bold text-gray-400 py-1 font-dm-sans"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0">
        {Array.from({ length: blanks }).map((_, i) => (
          <div key={`blank-${i}`} className="py-1" />
        ))}
        {Array.from({ length: totalDays }).map((_, i) => {
          const day = i + 1;
          const isToday = day === today;
          return (
            <div
              key={day}
              className={`text-center py-1 text-[8px] 2xl:text-[9px] font-medium rounded-full font-dm-sans
                                ${isToday ? "bg-[#0EA5E9] text-white" : "text-dark-gray"}`}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const BookAppointmentHero = () => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setIsAnimating((prev) => !prev), 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-white py-10 lg:py-20 4xl:py-32">
      {/* Background Decorative Gradient */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[40%] bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(153,131,191,0.06)_100%)]"
        aria-hidden
      />

      <div className="font-dm-sans relative  w-full max-w-7xl mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 items-stretch gap-12 lg:grid-cols-2 4xl:gap-16">
          {/* Left Side: Content */}
          <div className="order-1 flex flex-col lg:justify-start">
            <span className="mb-4 hidden  lg:block font-dm-sans text-xs font-light uppercase tracking-[0.2em] text-slate-gray 2xl:text-sm">
              BUILD
            </span>
            <Link href="/" className="lg:hidden cursor-pointer mb-3 mx-auto">
              <Image src={HexaRGBLogo} width={60} height={40} alt="hexa-icon" />
            </Link>
            
            <h1
              className="text-center lg:text-start text-3xl  2xl:text-4xl 3xl:text-[44px] 4xl:text-[48px] lg:leading-10 2xl:leading-11 4xl:leading-14 font-medium text-dark-gray"
            >
              {" "}
              AI Appointment <br />
              Scheduling for <br />
              <span className="bg-linear-to-r from-cyan-blue to-neon-pink bg-clip-text text-transparent">
                Instant Booking
              </span>
            </h1>
            <p
              className={`text-center lg:text-start w-full 2xl:max-w-md 4xl:max-w-lg mt-4 text-sm lg:text-base 4xl:text-xl font-light text-slate-gray leading-snug`}
            >
              {" "}
              Automate scheduling and booking with Hexa AI. Our AI appointment
              scheduling checks availability, confirms slots, and keeps every
              interaction seamless.
            </p>
          </div>

          {/* Right Side: Visual Mockup */}
          <div className="relative order-2 flex justify-center">
            <div className="relative flex h-[350px] md:h-[350px] lg:h-[400px] 2xl:h-[500px] w-full items-center justify-center overflow-hidden rounded-xl bg-[#F9F9FB]  shadow-[0px_20px_50px_rgba(14,165,233,0.05)] border border-white">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-60"
              >
                <source src="/videos/Product/Book Appointment/AppointmentHero.webm" type="video/webm" />
              </video>

              {/* Floating UI Elements */}
              <div className="relative z-10 flex w-full max-w-[450px] items-center justify-center">
                {/* Calendar Phone Mockup */}
                <div
                  className={`transition-all duration-1000 ease-out ${isAnimating ? "scale-100 opacity-100" : "scale-90 opacity-80"}`}
                >
                  <Image
                    src={BookOnCalendarImg}
                    alt="Phone Mockup"
                    priority
                    width={280}
                    height={560}
                    className="h-auto w-[220px] 2xl:w-[280px] drop-shadow-2xl"
                  />
                </div>

                {/* Floating Calendar Widget */}
                <div
                  className={`absolute -right-4 top-10 transition-all duration-1000 delay-300 ease-out 2xl:-right-10
                                    ${isAnimating ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"}`}
                >
                  <CalendarWidget />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookAppointmentHero;
