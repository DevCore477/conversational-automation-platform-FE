import ReceptionistImg from "@/assets/Product/Book Appointment/Receptionist.png";
import SettlerImg from "@/assets/Product/Book Appointment/Settler.webp";
import AutomatedImg from "@/assets/Product/Book Appointment/Automated.png";
import DemoImg from "@/assets/Product/Book Appointment/Demo.png";
import VisitsImg from "@/assets/Product/Book Appointment/Visits.png";
import HealthcareImg from "@/assets/Product/Book Appointment/Healtcare.webp"; // Using the filename provided (has a typo)

const cards = [
  {
    category: "Virtual Front Desk",
    title: "Receptionist",
    description:
      "Handling initial queries, directing calls to appropriate departments, and scheduling appointments for visitors or clients.",
    image: ReceptionistImg,
    bgColor: "bg-blue-50",
  },
  {
    category: "Marketing",
    title: "Appointment Settler",
    description:
      "Ask a few questions to ensure the lead meets specific criteria. Then setting up consultations or demo appointments for sales representatives.",
    image: SettlerImg,
    bgColor: "bg-purple-50",
  },
  {
    category: "Operation",
    title: "Automated Follow-Ups",
    description:
      "Contacting clients to confirm upcoming appointments and reschedule if needed, or handling rescheduling for missed appointments.",
    image: AutomatedImg,
    bgColor: "bg-amber-50",
  },
  {
    category: "Sales",
    title: "Demo & Discovery Booking",
    description:
      "Handling initial queries, directing calls to appropriate departments, and scheduling appointments for visitors or clients.",
    image: DemoImg,
    bgColor: "bg-green-50",
  },
  {
    category: "Field Services",
    title: "On-Site Visits",
    description:
      "From HVAC to repairs, offer real-time availability, book technician windows, and trigger reminders and reschedules automatically.",
    image: VisitsImg,
    bgColor: "bg-pink-50",
  },
  {
    category: "Operation",
    title: "Healthcare & Wellness",
    description:
      "Intake essentials, check eligibility/availability, and book or reschedule visits securely with an AI appointment scheduler that reduces no-shows.",
    image: HealthcareImg,
    bgColor: "bg-cyan-50",
  },
];

const UseAIAppointment = () => {
  return (
    <section className="py-10 lg:py-20 bg-[#FAFAFA]">
      <div className="font-dm-sans w-full max-w-7xl mx-auto px-6 md:px-16">
        <h2 className="text-xl lg:text-2xl xl:text-3xl 4xl:text-4xl font-semibold text-dark-gray mb-8 lg:mb-12 tracking-tight text-center lg:text-left">
          When to use AI appointment booking?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-5 lg:p-6 shadow-md shadow-cyan-blue/10 border border-gray-100 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col items-start group"
            >
              <div
                className={`w-full h-48 md:h-40 lg:h-48 rounded-2xl mb-6 flex items-center justify-center overflow-hidden ${card.bgColor} relative`}
              >
                <img
                  src={card.image.src}
                  alt={card.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                {/* Overlay gradient for premium feel */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
              </div>

              <span className="text-slate-gray text-[9px] lg:text-[11px] uppercase tracking-wider mb-2">
                {card.category}
              </span>

              <h3 className="text-lg lg:text-xl 4xl:text-2xl text-dark-gray mb-2 tracking-tight">
                {card.title}
              </h3>

              <p className="text-slate-gray text-xs lg:text-sm leading-tight font-light">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseAIAppointment;
