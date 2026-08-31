import CheckIcon from "@/assets/Product/Verified Phone Numbers/Check.png";
import PhoneIcon from "@/assets/Product/Verified Phone Numbers/Phone.png";
import FeatureCard from "../../FeatureCard";
import { Plus, X } from "lucide-react";
const VerifiedStep = () => {
  return (
    <section className="py-10 lg:py-20 bg-white">
      <div className="font-dm-sans w-full max-w-7xl mx-auto px-6 md:px-16">
        <h2 className="text-center md:text-start text-xl lg:text-2xl xl:text-3xl 4xl:text-4xl font-semibold text-dark-gray mb-8 lg:mb-12 tracking-tight">
          How Verified Phone Numbers Work?
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Step 1 */}
          <FeatureCard
            variant="primary"
            title="Purchase a phone number"
            description="Log in to the Hexa AI dashboard, navigate to the Advanced Add-Ons section, and click &quot;Verified Phone Number&quot; to start the application."
          >
            <div className="relative z-10 bg-white rounded-lg shadow-md p-3 xs:p-5 w-full max-w-[280px]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-gray font-semibold text-sm">
                  Phone Numbers
                </span>
                <div className="size-4.5 rounded bg-warning flex items-center justify-center shadow">
                  <Plus className="size-3.5 text-white" strokeWidth="3"/>
                </div>
              </div>
              <p className="text-[10px] text-slate-gray mb-4 leading-relaxed font-medium">
                List of added numbers
              </p>
              <div className="space-y-2">
                {[1, 2, 3].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-[#F4F4F5] p-2.5 rounded-lg"
                  >
                    <img src={PhoneIcon.src} alt="Phone" className="w-3.5 h-3.5 object-contain" />
                    <span className="text-[11px] font-medium text-slate-gray">
                      +971 78643 3409
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </FeatureCard>

          {/* Step 2 */}
          <FeatureCard
            variant="secondary"
            title="Submit Your Application"
            description="Fill in your company details in the business profile. Submit the application for verification—approval typically takes 1–2 weeks."
          >
            <div className="relative z-10 bg-gray-100 rounded-lg shadow-md p-4 w-full max-w-[280px]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-gray font-semibold text-sm">
                  Business Details
                </span>
                <div className="size-4.5 rounded bg-warning flex items-center justify-center">
                  <X className="size-3.5 text-white" strokeWidth="3"/>
                </div>
              </div>
              <hr className="border-gray-100 mb-2" />
              <div className="space-y-3 ">
                <div>
                  <label className="text-[9px] text-slate-gray mb-1 block ">
                    Business Name
                  </label>
                  <div className="bg-gray-200 border border-gray-100 rounded-lg p-0.5 ">
                    <span className="ml-2 text-[10px] text-slate-gray font-medium">
                      Hexa Ai
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-[9px] text-slate-gray mb-1 block">
                    Business Number
                  </label>
                  <div className="bg-gray-200 border border-gray-100 rounded-lg p-0.5">
                    <span className="ml-2 text-[10px] text-slate-gray font-medium">
                      + 571 1289 2345
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-[9px] text-slate-gray mb-1 block">
                    Business Type
                  </label>
                  <div className="bg-gray-200 border border-gray-100 rounded-lg p-0.5">
                    <span className="ml-2 text-[10px] text-slate-gray font-medium">
                      Technology Company
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </FeatureCard>

          {/* Step 3 */}
          <FeatureCard
            variant="tertiary"
            title="Start Using Verified Numbers"
            description="Once approved, begin making outbound calls with your verified number, saying goodbye to &quot;Spam Likely&quot; and hello to better answer rates."
          >
            <div className="relative z-10 bg-gray-100 rounded-lg shadow-md p-4 xs:p-5 w-full max-w-[280px]">
              <div className="flex items-center justify-between mb-5">
                <span className="text-slate-gray font-semibold text-sm">
                  Verified Phone Numbers
                </span>
                <div className="size-4.5 rounded bg-warning flex items-center justify-center">
                  <X className="size-3.5 text-white" strokeWidth="3"/>
                </div>
              </div>
              <p className="text-[10px] text-slate-gray mb-4 leading-relaxed font-medium">
                Choose a verified phone number for calls
              </p>

              <div className="space-y-2">
                {[1, 2].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-gray-200 p-2.5 rounded-lg border border-gray-100"
                  >
                    <img src={CheckIcon.src} alt="Verified" className="w-4 h-4 object-contain"/>
                    <span className="text-[10px] xs:text-[11px] font-medium text-slate-gray">
                      +971 78643 3409
                    </span>
                  </div>
                ))}
              </div>
            </div> 
          </FeatureCard>
        </div>
      </div>
    </section>
  );
};

export default VerifiedStep;
