
import ScamImg from '@/assets/Product/Verified Phone Numbers/Scam.webp';
import IncomingIcon from '@/assets/Product/Verified Phone Numbers/Incoming call.png';
import OutgoingIcon from '@/assets/Product/Verified Phone Numbers/Outgoing.png';
import DocumentIcon from '@/assets/Product/Verified Phone Numbers/Document.png';

const What = () => {
    const features = [
        {
            icon: <img src={OutgoingIcon.src} alt="Outgoing" className="w-5 h-5 object-contain" />,
            title: "Trusted Caller ID",
            description: "Build credibility with recipients by displaying a verified number."
        },
        {
            icon: <img src={IncomingIcon.src} alt="Incoming" className="w-5 h-5 object-contain" />,
            title: "Higher Answer Rates",
            description: "Avoid spam filters and increase the likelihood of your calls being answered.",
            isHighlighted: true
        },
        {
            icon: <img src={DocumentIcon.src} alt="Document" className="w-5 h-5 object-contain" />,
            title: "Enhance Campaign Success",
            description: "Ensure your outreach efforts connect with more customers."
        }
    ];

    return (
        <section className="relative py-10 lg:py-20 overflow-hidden bg-white">
            <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
            >
                <source src="/videos/Product/Verified Phone Numbers/VerifiedFeature.webm" type="video/webm" />
            </video>
            <div className="absolute inset-0 bg-white/70 pointer-events-none" />

            <div className="font-dm-sans relative z-10  w-full max-w-7xl mx-auto px-6 md:px-16">
                <h2 className="text-3xl md:text-[40px] font-medium text-[#111827] mb-20">
                    What are verified phone numbers?
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
                    {/* Left: Image */}
                    <div className="relative group max-w-[400px]  mx-auto lg:mx-0">
                        <div className="rounded-[20px]  h-[450px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
                            <img
                                src={ScamImg.src}
                                alt="Phone displaying Scam Likely"
                                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                                style={{ objectPosition: '40% center' }}
                            />
                        </div>
                    </div>

                    {/* Right: Content */}
                    <div className="space-y-8 mb-20  lg:-ml-40  ">
                        <div>
                            <h3 className="text-xl  text-[#111827] mb-6">
                                Prevent &quot;Scam Likely&quot; or &quot;Unknown&quot; Tag
                            </h3>
                            <div className="space-y-6">
                                <p className="text-[#6B7280] text-base leading-relaxed">
                                    Verified Phone Numbers are phone numbers that have been authenticated and approved by major carriers like T-Mobile, AT&amp;T, and Verizon. This ensures your calls are recognized as legitimate and prevent your phone numbers being flagged as &quot;Spam Likely,&quot; or &quot;Unknown&quot;.
                                </p>
                                <p className="text-[#6B7280] text-base leading-relaxed">
                                    Verified Phone Numbers are an essential tool for businesses looking to improve call efficiency and maintain a professional image.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom: Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className={`p-10 rounded-[1rem] bg-gray-50 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-2 border-transparent`}
                        >
                            {feature.icon}
                            <h4 className="text-xl font-bold text-[#111827] mb-4">
                                {feature.title}
                            </h4>
                            <p className="text-[#6B7280] leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default What;
