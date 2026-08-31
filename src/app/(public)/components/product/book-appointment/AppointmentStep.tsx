import { X } from "lucide-react";
import FeatureCard from "../../FeatureCard";
import FunctionsStep from "../common/FunctionsStep";
import PromptStep from "../common/PromptStep";

const AppointmentStep = () => {
  return (
    <section className="font-dm-sans py-10 lg:py-20 bg-white">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-16">
        <h2 className="text-center md:text-start text-xl lg:text-2xl xl:text-3xl 4xl:text-4xl font-semibold text-dark-gray mb-8 lg:mb-12 tracking-tight">
          Step by Step to use Appointment Booking
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Step 1: Functions */}
          <FeatureCard
            variant="primary"
            title="Create Appointment Booking Functions"
            description={[
              "Start by creating an AI agent tailored for appointment booking.",
              "Add the 'Check Availability' and 'Book Appointments' functions to your agent."
            ]}
          >
            <FunctionsStep/>
          </FeatureCard>

          {/* Step 2: Prompt */}
          <FeatureCard
            variant="tertiary"
            title="Set Up & Add Function Logic to Prompts"
            description={[
              "Define the scenarios where the appointment booking functions will be triggered.",
              "Example: Call the 'Check Availability' function and provide available slots to the customer."
            ]}
          >
            <PromptStep/>
          </FeatureCard>

          {/* Step 3: Bookings */}
          <FeatureCard
            variant="secondary"
            title="Monitor Appointments and Optimize"
            description="Once an appointment is booked, view it directly on the dashboard. Review and refine your agent's prompts to further enhance customer interactions and optimize results."
          >
            <div className="relative z-10 bg-white rounded-lg shadow-md p-3 w-full max-w-[280px]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-gray  font-semibold text-xs"> Bookings</span>
                <div className="size-4.5 rounded bg-warning flex items-center justify-center">
                  <X className="size-3.5 text-white" strokeWidth="3"/>
                </div>
              </div>
              <p className="text-[10px] text-start text-slate-gray mb-4 leading-relaxed pr-6">
                See upcoming and past events booked through your event type links.
              </p>
              <div className="space-y-2.5">
                {["Upcoming", "Unconfirmed", "Past", "Cancelled"].map(
                  (item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 bg-[#F4F4F5] px-2 py-1 rounded border border-gray-100/50"
                    >
                      <div className="relative size-3.5 flex items-center justify-center">
                        <svg
                          className="size-3.5 text-dark-gray"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <div className="absolute -right-0.5 -bottom-0.5 w-2.5 h-2.5 bg-success rounded-full border-2 border-white flex items-center justify-center">
                          <svg
                            className="w-1.5 h-1.5 text-white font-bold"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={5}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-gray font-medium tracking-tight translate-x-1">
                        {item}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>
          </FeatureCard>
        </div>
      </div>
    </section>
  );
};

export default AppointmentStep;
