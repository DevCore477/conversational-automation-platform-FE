"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import MobileImg from '@/assets/Product/Verified Phone Numbers/Mobile.png';
import SpamBadge from '@/assets/Product/Verified Phone Numbers/Spam Tag.png';
import TrustBadge from '@/assets/Product/Verified Phone Numbers/Improve Trust.png';
import Button from '../../Button';
import { HexaRGBLogo } from '@/assets';
import Link from 'next/link';

const VerifiedHero = () => {
    const [step, setStep] = useState(0);

    useEffect(() => {
        const timings = [800, 1000, 1200, 3000];
        let currentStep = 0;

        const advance = () => {
            currentStep++;
            if (currentStep > 3) {
                currentStep = 0;
                setStep(0);
            } else {
                setStep(currentStep);
            }
            timeout = setTimeout(advance, timings[currentStep] || 1000);
        };

        let timeout = setTimeout(advance, timings[0]);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <section className="relative w-full overflow-hidden bg-white py-10 lg:py-20 4xl:py-32">
            {/* Background Decorative Gradient */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[40%] bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(153,131,191,0.06)_100%)]" aria-hidden />

            <div className="relative  w-full max-w-7xl mx-auto px-6 md:px-16">
                <div className="grid grid-cols-1 items-stretch gap-12 lg:grid-cols-2 4xl:gap-16">

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
                        >                             Ensure Your Calls Get{' '}
                            <br />
                            Answered with{' '}
                            <span className="bg-linear-to-r from-cyan-blue to-neon-pink bg-clip-text text-transparent">
                                Verified Phone Numbers
                            </span>
                        </h1>
                        <p
                            className={`text-center lg:text-start w-full 2xl:max-w-lg mt-4 text-sm lg:text-base 4xl:text-xl font-light text-slate-gray leading-snug`}
                        >                             Boost trust and credibility in your call campaigns with Hexa AI&apos;s Verified Phone Numbers. Reduce the chances of your calls being flagged as spam and improve answer rates to make every outreach effort count.
                        </p>

                    </div>

                    {/* Right Side: Visual Mockup */}
                    <div className="relative order-2 flex justify-center">
                        <div className="relative flex h-[400px] 2xl:max-h-[470px] w-full items-center justify-center overflow-hidden rounded-[32px] bg-[#F9F9FB] 2xl:h-full shadow-[0px_20px_50px_rgba(14,165,233,0.05)] border border-white">

                            <video
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="absolute inset-0 w-full h-full object-cover opacity-60"
                            >
                                <source src="/videos/Product/Verified Phone Numbers/VerifiedHero.webm" type="video/webm" />
                            </video>

                            {/* Floating Badge: Spam Tag (Top Left) */}
                            <div
                                className="absolute top-[30%] left-[5%] sm:left-[8%] z-20"
                                style={{
                                    opacity: step >= 3 ? 1 : 0,
                                    transform: step >= 3 ? 'translateX(0)' : 'translateX(-30px)',
                                    transition: 'opacity 0.6s ease, transform 0.6s ease',
                                }}
                            >
                                <Image
                                    src={SpamBadge}
                                    alt="Remove Spam Tag"
                                    width={192}
                                    height={100}
                                    className="h-auto w-40 sm:w-48 drop-shadow-lg"
                                />
                            </div>

                            {/* Floating Badge: Improve Trust (Bottom Right) */}
                            <div
                                className="absolute bottom-[12%] right-[5%] sm:right-[8%] z-20"
                                style={{
                                    opacity: step >= 3 ? 1 : 0,
                                    transform: step >= 3 ? 'translateX(0)' : 'translateX(30px)',
                                    transition: 'opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s',
                                }}
                            >
                                <Image
                                    src={TrustBadge}
                                    alt="Improve Trust"
                                    width={192}
                                    height={100}
                                    className="h-auto w-40 sm:w-48 drop-shadow-lg"
                                />
                            </div>

                            {/* Phone with Caller Screen */}
                            <div className="relative z-10 flex justify-center items-end w-full h-full pt-8 sm:pt-12">
                                <div className="relative">
                                    <Image
                                        src={MobileImg}
                                        alt="Phone showing Spam Likely caller"
                                        priority
                                        width={300}
                                        height={500}
                                        className="h-auto w-[250px] sm:w-[300px] drop-shadow-[0_25px_50px_rgba(0,0,0,0.25)]"
                                        style={{ transform: 'translateY(35%)' }}
                                    />
                                    {/* On-screen content */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ top: '10%' }}>
                                        {/* Spam Likely - appears at step 1 blurred, clears at step 3 */}
                                        <h2
                                            className="text-white text-2xl sm:text-3xl font-bold tracking-tight"
                                            style={{
                                                textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                                                opacity: step >= 1 ? 1 : 0,
                                                filter: step >= 3 ? 'blur(0px)' : 'blur(6px)',
                                                transition: 'opacity 0.5s ease, filter 0.8s ease',
                                            }}
                                        >
                                            Spam Likely
                                        </h2>
                                        {/* California, USA - appears at step 2, always clear */}
                                        <p
                                            className="text-gray-300 text-sm sm:text-base mt-1"
                                            style={{
                                                textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                                                opacity: step >= 2 ? 1 : 0,
                                                transition: 'opacity 0.5s ease',
                                            }}
                                        >
                                            California, USA
                                        </p>
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

export default VerifiedHero;
