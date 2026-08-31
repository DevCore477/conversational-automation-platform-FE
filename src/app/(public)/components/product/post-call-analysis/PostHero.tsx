'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import CallHistoryImg from '@/assets/Product/Post Call Analysis/Call History.png';
import NavigateBadge from '@/assets/Product/Post Call Analysis/navigate.png';
import Button from '../../Button';
import { HexaRGBLogo } from '@/assets';
import Link from 'next/link';

const PostHero = () => {
    const [step, setStep] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isBadgeHovered, setIsBadgeHovered] = useState(false);

    useEffect(() => {
        const timings = [1500, 800, 600, 800, 3000];

        const timeout = setTimeout(() => {
            setStep((prev) => (prev + 1) % 5);
        }, timings[step]);

        return () => clearTimeout(timeout);
    }, [step]);

    return (
        <section className="relative w-full overflow-hidden bg-white py-10 lg:py-20 4xl:py-32">
            {/* Background Decorative Gradient */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[40%] bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(153,131,191,0.06)_100%)]" aria-hidden />

            <div className="relative  w-full max-w-7xl mx-auto px-6 md:px-16">
                <div className="grid grid-cols-1 items-stretch gap-12 lg:grid-cols-2 2xl:gap-20">

                    {/* Left Side: Content */}
                    <div className="font-dm-sans order-1 flex flex-col justify-start">
                        <span className="mb-4 hidden lg:block font-dm-sans text-xs font-light uppercase tracking-[0.2em] text-slate-gray 2xl:text-sm">
                            BUILD
                        </span>
                        <Link href="/" className="lg:hidden cursor-pointer mb-3 mx-auto">
                            <Image src={HexaRGBLogo} width={60} height={40} alt="hexa-icon" />
                        </Link>
                        <h1
                            className={`text-center lg:text-start text-3xl 2xl:text-4xl 3xl:text-[44px] 4xl:text-[48px] lg:leading-10 2xl:leading-11 4xl:leading-14 font-medium text-dark-gray`}
                        >                            Turn Every Call Into <br />
                            Actionable Insights{' '}
                            <span className="bg-linear-to-r from-cyan-blue to-neon-pink bg-clip-text text-transparent">
                                Post Call Analysis
                            </span>
                        </h1>
                        <p
                            className={`text-center lg:text-start w-full 2xl:max-w-lg mt-4 text-sm lg:text-base 4xl:text-xl font-light text-slate-gray leading-snug 2xl:w-[450px]`}
                        >                            Unlock the power of your customer conversations with Hexa AI&apos;s Post-Call Analysis feature. Automatically analyze calls to uncover valuable insights, optimize performance, and make data-driven decisions.
                        </p>

                    </div>

                    {/* Right Side: Visual Mockup */}
                    <div className="relative order-2 flex justify-center">
                        <div className="relative flex h-[400px] w-full items-center justify-center overflow-hidden rounded-[32px] bg-[#F9F9FB] lg:h-full lg:min-h-[400px] 2xl:min-h-[500px] shadow-[0px_20px_50px_rgba(14,165,233,0.05)] border border-white">

                            <video
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="absolute inset-0 w-full h-full object-cover opacity-60"
                            >
                                <source src="/videos/Product/Post Call Analysis/PostHero.webm" type="video/webm" />
                            </video>

                            {/* Widgets Container */}
                            <div className="relative z-10 flex w-full max-w-[450px] items-center justify-center">
                                <div
                                    className="relative cursor-pointer"
                                    onMouseEnter={() => setIsHovered(true)}
                                    onMouseLeave={() => setIsHovered(false)}
                                    style={{
                                        transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                        transform: (isHovered || step >= 1) ? 'scale(0.7)' : 'scale(0.3)',
                                    }}
                                >
                                    {/* Main Widget: Call History */}
                                    <Image
                                        src={CallHistoryImg}
                                        alt="Call History"
                                        priority
                                        width={400}
                                        height={300}
                                        className="h-auto w-[280px] sm:w-[400px] drop-shadow-2xl"
                                    />

                                    {/* Secondary Widget: Navigate - appears after delay */}
                                    <div
                                        className="absolute bottom-[-20%] right-[-10%] w-[58%] z-20 cursor-pointer transition-transform duration-300 origin-top-left"
                                        onMouseEnter={() => setIsBadgeHovered(true)}
                                        onMouseLeave={() => setIsBadgeHovered(false)}
                                        style={{
                                            transition: 'opacity 0.8s ease-out, transform 0.3s ease-out',
                                            transitionDelay: (isHovered || step >= 1) ? '0.4s' : '0s',
                                            opacity: (isHovered || step >= 2) ? 1 : 0,
                                            transform: (isBadgeHovered || step >= 3) ? 'scale(1.5)' : 'scale(0.9)',
                                        }}
                                    >
                                        <Image
                                            src={NavigateBadge}
                                            alt="Analysis Results"
                                            width={200}
                                            height={150}
                                            className="h-auto w-full drop-shadow-2xl"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default PostHero;
