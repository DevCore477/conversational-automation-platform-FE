"use client";
import Image from "next/image";
import { useRef, useEffect, useState, useCallback } from "react";
import { AgentVoiceBG, BlueCheckMark, HarryKane } from "@/assets";

const testimonials = [
  {
    id: 1,
    quote: "Our numbers show that 45-50% of calls are completely resolved by Hexa AI without ever touching a human.",
    name: "Harry Kane",
    role: "Senior Engineer, GiftHealth",
    image: HarryKane,
  },
  {
    id: 2,
    quote: "Our numbers show that 45-50% of calls are completely resolved by Hexa AI without ever touching a human.",
    name: "Harry Kane",
    role: "Senior Engineer, GiftHealth",
    image: HarryKane,
  },
  {
    id: 3,
    quote: "Our numbers show that 45-50% of calls are completely resolved by Hexa AI without ever touching a human.",
    name: "Harry Kane",
    role: "Senior Engineer, GiftHealth",
    image: HarryKane,
  },
];

const features = [
  {
    icon: BlueCheckMark,
    title: "More Intelligent Than IVR",
    description: "Upgrade to a smarter AI that provides a more natural and intuitive customer experience.",
  },
  {
    icon: BlueCheckMark,
    title: "Realistic, Human-Like Engagement",
    description: "Deliver conversations that are natural, engaging, and feel just like talking to a real person.",
  },
  {
    icon: BlueCheckMark,
    title: "Easy Transition to Human Assistance",
    description: "Customers can smoothly transfer to live agents whenever necessary, ensuring a frustration-free experience.",
  },
];

export default function TestimonialSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);          // tracks current scrollLeft
  const rafRef = useRef<number | undefined>(undefined);
  const isDragging = useRef(false);
  const isPaused = useRef(false);
  const dragStartX = useRef(0);

  const displayTestimonials = [...testimonials, ...testimonials, ...testimonials, ...testimonials,];
  const CARD_WIDTH = 260 + 24; // card width + gap
  const SEGMENT = testimonials.length * CARD_WIDTH; // one set width

  // ── Clamp for infinite loop ──────────────────────────────────────
  const clampInfinite = useCallback(() => {
    const el = wrapperRef.current;
    if (!el) return;
    if (el.scrollLeft >= SEGMENT * 3) {
      el.scrollLeft -= SEGMENT * 2;
      posRef.current = el.scrollLeft;
    } else if (el.scrollLeft <= 0) {
      el.scrollLeft += SEGMENT * 2;
      posRef.current = el.scrollLeft;
    }
  }, [SEGMENT]);

  // ── Auto-scroll loop ─────────────────────────────────────────────
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    // Start in middle so both directions have room
    posRef.current = SEGMENT;
    el.scrollLeft = SEGMENT;

    const tick = () => {
      if (!isPaused.current && !isDragging.current) {
        posRef.current += 0.7;
        el.scrollLeft = posRef.current;
        clampInfinite();
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [SEGMENT, clampInfinite]);

  // ── Mouse drag: BOTH directions ──────────────────────────────────
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      el.style.cursor = "grabbing";
      dragStartX.current = e.clientX;
      e.preventDefault();
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const delta = dragStartX.current - e.clientX;
      posRef.current += delta;
      el.scrollLeft = posRef.current;
      dragStartX.current = e.clientX;
      clampInfinite();
    };

    const onMouseUp = () => {
      isDragging.current = false;
      el.style.cursor = "grab";
    };

    el.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [clampInfinite]);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => {
      isDragging.current = true;
      isPaused.current = true;
      dragStartX.current = e.touches[0].clientX;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;

      const delta = dragStartX.current - e.touches[0].clientX;

      posRef.current += delta;
      el.scrollLeft = posRef.current;

      dragStartX.current = e.touches[0].clientX;

      clampInfinite();
    };

    const onTouchEnd = () => {
      isDragging.current = false;
      isPaused.current = false;
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    el.addEventListener("touchend", onTouchEnd);

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [clampInfinite]);

  // ── Wheel / trackpad: BOTH directions ───────────────────────────
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      posRef.current += e.deltaY || e.deltaX;
      el.scrollLeft = posRef.current;
      clampInfinite();
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [clampInfinite]);

  return (
    <section className="w-full lg:pl-30 xl:pl-30 2xl:pl-50 4xl:pl-70 py-10 lg:py-20 flex flex-col lg:flex-row gap-8 lg:gap-12 items-start overflow-x-hidden">

      {/* Left: Features */}
      <div className="font-dm-sans w-full lg:w-[40%] shrink-0 px-6">
        <h2 className="w-full max-w-[400px] text-xl lg:text-2xl xl:text-3xl 4xl:text-4xl font-semibold text-dark-gray leading-snug lg:max-w-2xl 4xl:max-w-4xl tracking-tight mb-8 drop-shadow-[0_4px_4px_rgba(14,165,233,0.25)]">
          See What Customers <br /> Say About Us
        </h2>
        <div className="space-y-8">
          {features.map((feature, index) => (
            <div key={index} className="flex gap-4">
            <img src={feature.icon.src} alt={feature.title} className="w-6 h-6 object-contain" />
              <div>
                <h3 className="text-base lg:text-lg font-medium text-dark-gray leading-tight mb-2">{feature.title}</h3>
                <p className="text-xs lg:text-sm text-slate-gray max-w-[350px]">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Infinite Marquee */}
      <div
        ref={wrapperRef}
        onMouseEnter={() => { isPaused.current = true; }}
        onMouseLeave={() => { isPaused.current = false; }}
        className="relative w-full overflow-x-hidden no-scrollbar pt-10 pb-6"
        style={{ cursor: "grab", scrollBehavior: "auto" }}
      >
        <div className="flex gap-6 w-max">
          {displayTestimonials.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className={`relative shrink-0 w-65 h-87.5 rounded-[20px] py-8 px-4 flex flex-col justify-between
                ${idx % testimonials.length === 0
                  ? "text-white shadow-[0_4px_4px_rgba(14,165,233,0.15)] overflow-hidden"
                  : "bg-white border border-dashed border-slate-gray text-dark-gray"
                }`}
            >
              {idx % testimonials.length === 0 && (
                <Image src={AgentVoiceBG} alt="gradient-bg" fill className="object-cover z-0" />
              )}
              <div className="relative z-10">
                <p className={`font-dm-sans text-sm md:text-base ${idx % testimonials.length === 0 ? "font-semibold" : "font-medium"}`}>
                  "{item.quote}"
                </p>
              </div>
              <div className="relative z-10 flex items-center gap-3">
                <div className={`w-[40px] h-[40px] rounded-full overflow-hidden border-2 ${idx % testimonials.length === 0 ? "border-white" : "border-transparent"}`}>
                  <img src={item.image.src} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col">
                  <span className={`font-dm-sans text-base font-medium ${idx % testimonials.length === 0 ? "text-white" : "text-dark-gray"}`}>
                    {item.name}
                  </span>
                  <span className={`font-dm-sans text-xs font-normal leading-tight whitespace-nowrap truncate ${idx % testimonials.length === 0 ? "text-white/90" : "text-slate-gray"}`}>
                    {item.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}