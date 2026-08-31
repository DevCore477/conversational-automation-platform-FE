
"use client";

import { useState, useEffect } from "react";
import SelectorIcon from '@/assets/Product/Post Call Analysis/SelectorIcon.png';
import { AlignLeft, Hash, Sliders } from 'lucide-react';

const PostCallAnalysis = () => {
    const [showGif, setShowGif] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowGif(true), 100);
        return () => clearTimeout(timer);
    }, []);
    const features = [
        {
            icon: <div className=" font-bold text-xl">B</div>,
            title: "Boolean",
            description: "Simple yes/no determinations. Example: Whether the customer is a first-time caller"
        },
        {
            icon: <AlignLeft className="w-5 h-5" />,
            title: "Text",
            description: "Detailed textual information. Example: Call summaries, action items, or key discussion points"
        },
        {
            icon: <Hash className="w-5 h-5" />,
            title: "Number",
            description: "Quantitative measurements. Example: Transaction amounts, call duration, or satisfaction."
        },
        {
            icon: <img src={SelectorIcon.src} alt="Selector" className="size-5 object-contain" />,
            title: "Selector",
            description: "Categorization from a fixed list. Example: Issue types, product categories, or resolution status"
        }
    ];

    return (
        <section className="relative py-10 lg:py-20 overflow-hidden bg-white">
            {/* Background GIF */}
            {showGif && (
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-[0.4]"
                >
                    <source src="/videos/Product/Verified Phone Numbers/VerifiedFeature.webm" type="video/webm" />
                </video>
            )}
            {/* Lightening Overlay */}
            <div className="absolute inset-0 bg-white/50 pointer-events-none" />

            <div className="font-dm-sans relative z-10  w-full max-w-7xl mx-auto px-6 md:px-16">
                <div className="mb-16 max-w-4xl">
                    <h2 className="text-xl lg:text-2xl xl:text-3xl 4xl:text-4xl font-semibold text-dark-gray mb-1">
                        What is post call analysis?
                    </h2>
                    <p className="font-light text-slate-gray text-base leading-relaxed mt-2">
                        Post-call analysis is a powerful feature that automatically analyzes customer conversations after they have ended, helping you derive valuable insights from your calls. We provide several built-in analysis categories, and you can create custom categories to match your specific business needs.
                    </p>
                </div>

                {/* Bottom: Feature Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className="bg-website-background backdrop-blur-sm px-6 py-8 rounded-xl shadow-md transition-all duration-300 flex flex-col h-full"
                        >
                            <div className="size-10 lg:size-12 bg-white text-dark-gray rounded-lg flex items-center justify-center mb-4 shadow-md ">
                                {feature.icon}
                            </div>
                            <h4 className="2xl:text-lg 4xl:text-2xl font-medium  text-dark-gray mb-2">
                                {feature.title}
                            </h4>
                            <p className="text-slate-gray text-xs 2xl:text-sm leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PostCallAnalysis;
