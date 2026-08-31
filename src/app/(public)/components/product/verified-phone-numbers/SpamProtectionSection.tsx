import React from 'react'
import Image from "next/image";
import { CallINIcn, CallOutIcn, TextFileIcn } from '@/assets/icons/Icons';
import SpamLikely from '@/assets/Product/Verified Phone Numbers/Spam-Likely.png';


const SpamProtectionSection = () => {

  const features = [
    {
      icon: <CallOutIcn className="size-5"/>,
      title: "Trusted Caller ID",
      description: "Build credibility with recipients by displaying a verified number."
    },
    {
      icon: <CallINIcn className="size-5"/>,
      title: "Higher Answer Rates",
      description: "Avoid spam filters and increase the likelihood of your calls being answered."
    },
    {
      icon: <TextFileIcn className="size-5"/>,
      title: "Enhance Campaign Success",
      description: "Ensure your outreach efforts connect with more customers."
    },
  ];

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
      <div className="absolute inset-0 bg-white/75"></div>
      {/* Main Content */}
      <div className="font-dm-sans w-full max-w-7xl mx-auto px-6 md:px-16 relative z-10">
        <h2 className="text-xl lg:text-2xl xl:text-3xl 4xl:text-4xl font-semibold text-dark-gray  tracking-tight">
          What are verified phone numbers?
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mt-3 lg:mt-16">
          <div className="lg:col-span-2 order-2 md:order-1">
            <Image
              src={SpamLikely}
              alt="Spam Likely Warning"
              className="w-full max-w-[400px] h-full max-h-[500px] rounded-xl"
            />
          </div>
          <div className="lg:col-span-3 order-1 md:order-2">
            <h3 className="text-lg lg:text-xl xl:text-2xl 4xl:text-3xl font-medium text-dark-gray mb-4 lg:mt-12">
              Prevent "Scam Likely" or "Unknown" Tag
            </h3>

            <p className="font-light text-slate-gray text-sm xl:text-base leading-relaxed">
              Verified Phone Numbers are phone numbers that have been authenticated
              and approved by major carriers like T-Mobile, AT&amp;T, and Verizon.
              This ensures your calls are recognized as legitimate and prevent your
              phone numbers being flagged as "Spam Likely" or "Unknown".
            </p>

            <p className="font-light text-slate-gray text-sm xl:text-base leading-relaxed mt-4">
              Verified Phone Numbers are an essential tool for businesses looking
              to improve call efficiency and maintain a professional image.
            </p>
          </div> 
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 2xl:gap-7 mt-8 lg:mt-24">
          {features.map((feature, idx) => (
            <div key={idx}
              className="bg-website-background backdrop-blur-sm px-6 py-8 rounded-xl shadow-md transition-all duration-300 flex flex-col h-full"
            >
              <div className="size-10 lg:size-12 bg-white rounded-lg flex items-center justify-center mb-6 shadow-md">
                {feature.icon}
              </div>
              <h4 className=" 2xl:text-lg 4xl:text-2xl font-medium text-dark-gray mb-3">{feature.title}</h4>
              <p className="text-slate-gray text-xs 2xl:text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SpamProtectionSection