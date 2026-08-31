'use client';

const Difference = () => {
    return (
        <section className="py-10 lg:py-20 relative overflow-hidden">
            <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
            >
                <source src="/videos/gif/ProductDiff.webm" type="video/webm" />
            </video>
            {/* White overlay for better text readability */}
            <div className="absolute inset-0 bg-white/79"></div>

            <div className="font-dm-sans w-full max-w-7xl mx-auto px-6 md:px-16 relative z-10">
                <h2 className="text-center md:text-start text-xl lg:text-2xl 2xl:text-3xl 4xl:text-4xl font-semibold text-dark-gray mb-8 lg:mb-12 tracking-tight">
                    What is the Difference?
                </h2>

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Cold Transfer Card */}
                    <div className="bg-[#FAF9FA] rounded-[1rem] p-6 shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="text-lg lg:text-xl 2xl:text-xl 4xl:text-[28px] font-medium text-dark-gray mb-2">Cold Transfer</h3>
                        <p className="text-sm 4xl:text-base text-slate-gray mb-6 leading-relaxed">
                            Quick and simple—our AI transfers the call directly without interaction.
                        </p>

                        <ul className="space-y-5">
                            <li className="flex items-start gap-4">
                                <div className="mt-0.5 size-4 rounded-full bg-success flex items-center justify-center shrink-0">
                                    <svg className="size-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-xs lg:text-sm 4xl:text-base text-slate-gray">No prior context is shared.</span>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="mt-0.5 size-4 rounded-full bg-success flex items-center justify-center shrink-0">
                                    <svg className="size-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-xs lg:text-sm 4xl:text-base text-slate-gray">Agents will need to search for context.</span>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="mt-0.5 size-4 rounded-full bg-success flex items-center justify-center shrink-0">
                                    <svg className="size-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-xs lg:text-sm 4xl:text-base text-slate-gray">Low-touch, speed-focused approach</span>
                            </li>
                        </ul>
                    </div>

                    {/* Warm Transfer Card */}
                    <div className="bg-[#FAF9FA] rounded-[1rem] p-6 shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="text-lg lg:text-xl 2xl:text-xl 4xl:text-[28px] font-medium text-dark-gray mb-2">Warm Transfer</h3>
                        <p className="text-sm 4xl:text-base text-slate-gray mb-6 leading-relaxed">
                            Want to keep things personal? The AI briefs the next agent before transferring the call.
                        </p>

                        <ul className="space-y-5">
                            <li className="flex items-start gap-2">
                                <div className="mt-0.5 size-4 rounded-full bg-success flex items-center justify-center shrink-0">
                                    <svg className="size-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-xs lg:text-sm 4xl:text-base text-slate-gray">The next agent gets all the context they need.</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="mt-0.5 size-4 rounded-full bg-success flex items-center justify-center shrink-0">
                                    <svg className="size-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-xs lg:text-sm 4xl:text-base text-slate-gray">Includes agent introduction to help build trust with customers.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <div className="mt-0.5 size-4 rounded-full bg-success flex items-center justify-center shrink-0">
                                    <svg className="size-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-xs lg:text-sm 4xl:text-base text-slate-gray">Builds trust and loyalty</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Difference;
