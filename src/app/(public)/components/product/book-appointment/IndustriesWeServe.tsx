// Import Assets
import Healthcare2 from "@/assets/Product/Book Appointment/Healthcare2.webp";
import Financial from "@/assets/Product/Book Appointment/Financial.webp";
import Insurance from "@/assets/Product/Book Appointment/Insurance.png";
import Logistics from "@/assets/Product/Book Appointment/Logistics.webp";
import Home from "@/assets/Product/Book Appointment/Home.png";
import Debt from "@/assets/Product/Book Appointment/Debt.webp";
import Retail from "@/assets/Product/Book Appointment/Retail.png";
import Travel from "@/assets/Product/Book Appointment/Travel.png";

const industryData = [
  // Row 1: Large Cards (Col span 2)
  {
    title: "Healthcare",
    desc: "Automate patient service, reminders, and front-desk tasks.",
    img: Healthcare2.src,
    size: "large",
  },
  {
    title: "Financial Services",
    desc: "Handle account inquiries, transfers, and support with accuracy.",
    img: Financial.src,
    size: "large",
  },
  // Row 2: Small Cards (Col span 1)
  {
    title: "Insurance",
    desc: "Streamline claims, quotes and policy update via voice.",
    img: Insurance.src,
    size: "small",
  },
  {
    title: "Logistics",
    desc: "Confirm deliveries, reroute shipments and notify customers.",
    img: Logistics.src,
    size: "small",
  },
  {
    title: "Home Services",
    desc: "Answer bookings, route calls and manage appointments 24/7.",
    img: Home.src,
    size: "small",
  },
  {
    title: "Debt Collection",
    desc: "Automate payments reminders and follow-ups with care.",
    img: Debt.src,
    size: "small",
  },
  // Row 3: Large Cards (Col span 2)
  {
    title: "Retail & Consumer",
    desc: "Support orders, returns and FAQs with instant voice agents.",
    img: Retail.src,
    size: "large",
  },
  {
    title: "Travel & Hospitality",
    desc: "Manage reservations, cancellations, and guest requests efficiently.",
    img: Travel.src,
    size: "large",
  },
];

const IndustriesWeServe = () => {
  return (
    <section className="py-10 lg:py-20 bg-[#F8FAFC]/50">
      <div className="font-dm-sans w-full max-w-7xl mx-auto px-6 md:px-16">
        <h2 className="text-center md:text-start text-xl lg:text-2xl xl:text-3xl 4xl:text-4xl font-semibold text-dark-gray mb-8 lg:mb-12 tracking-tight">
          Industries We Serve
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {industryData.map((item, index) => (
            <div
              key={index}
              className={`
              bg-white rounded-lg p-6 shadow-md hover:shadow-md shadow-cyan-blue/10 transition-all duration-300
                flex flex-col group
                ${item.size === "large" ? "md:col-span-2 md:flex-row gap-6 items-center h-auto " : "md:col-span-1 h-auto "}
              `}
            >
              {/* Image Container */}
              <div
                className={`
                  shrink-0 overflow-hidden rounded-lg
                  ${item.size === "large" ? " md:size-[120px] lg:size-[140px]" : "w-full h-[180px] md:h-[110px] lg:h-[140px] mb-6"}
                `}
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Text Content */}
              <div className="flex flex-col justify-center">
                <h3 className="font-medium text-lg 2xl:text-xl 4xl:text-2xl text-dark-gray mb-2 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-sm 2xl:text-lg 4xl:text-xl text-slate-gray leading-">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IndustriesWeServe;
