import { Plus, FileText, Check, X, SendHorizontal } from "lucide-react";
import { FileForwardIcon } from "@/assets";
import FeatureCard from "../../FeatureCard";

const BulbIcon = ({ className = "h-6 w-6" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Rays */}
    <path
      d="M12 1V3M4.22 4.22L5.64 5.64M1 12H3M4.22 19.78L5.64 18.36"
      stroke="#475569"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M19.78 4.22L18.36 5.64M23 12H21M19.78 19.78L18.36 18.36"
      stroke="#475569"
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Bulb Base */}
    <path
      d="M9 20H15M10 22H14"
      stroke="#475569"
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Bulb Body */}
    <path
      d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z"
      fill="#FBBF24"
    />
    {/* Gear inside */}
    <path
      d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"
      fill="white"
    />
    <path
      d="M12 9V10M12 14V15M9 12H10M14 12H15M9.88 9.88L10.59 10.59M13.41 13.41L14.12 14.12M9.88 14.12L10.59 13.41M13.41 10.59L14.12 9.88"
      stroke="white"
      strokeWidth="1"
      strokeLinecap="round"
    />
  </svg>
);

const DocIcon = () => (
  <div>
    <img src={FileForwardIcon.src} alt="File Icon" className="size-4" />
  </div>
);

const KnowledgeUsageSteps = () => {
  return (
    <section className="py-10 lg:py-20 bg-white">
      <div className="font-dm-sans w-full max-w-7xl mx-auto px-6 md:px-16">
        <h2 className="text-center md:text-start text-xl lg:text-2xl xl:text-3xl 4xl:text-4xl font-semibold text-dark-gray mb-8 lg:mb-12 tracking-tight">
          Step by step to use a knowledge base?{" "}
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Step 1: Create Knowledge Base */}
          <FeatureCard
            variant="primary"
            title="Create a knowledge base in Hexa Ai"
            description="Navigate to the “Knowledge Base” tab and click the “Add” button. Choose your source: URL, File, or Text."
          >
            <div className="relative z-10 bg-white rounded-lg shadow-md overflow-hidden w-full max-w-60">
              <div className="flex items-center justify-between px-4 pt-3 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="grid place-items-center">
                    <BulbIcon className="size-4" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-gray tracking-tight hover:text-black">
                    Knowledge Base
                  </span>
                </div>
                <div className="size-4.5 rounded bg-warning flex items-center justify-center shadow">
                  <Plus className="size-3.5 text-white" strokeWidth="3"/>
                </div>
              </div>
              <div className="pb-3.5 pt-1 flex flex-col">
                <div className="flex items-center gap-2 bg-gray-100 border-y border-[#EAEAEA] px-5 py-2">
                  <div className="flex items-center gap-2 w-full bg-gray-200 rounded-sm p-1 mr-2 ">
                    <DocIcon />
                    <span className="text-[10px] font-medium text-slate-gray">
                      Terms & Conditions
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-5 pt-2">
                  <DocIcon />
                  <span className="text-[12px] font-medium text-slate-gray">
                    Privacy Policy
                  </span>
                </div>
              </div>
            </div>
          </FeatureCard>

          {/* Step 2: Add to Agent */}
          <FeatureCard
            variant="secondary"
            title="Add the knowledge base to your agent"
            description="In the agent editor, select your knowledge items for accurate responses."
          >
            <div className="relative z-10 bg-white rounded-lg shadow-md overflow-hidden w-full max-w-[240px] mx-auto">
              <div className=" px-5 py-[7px]  flex items-center  border-b border-[#D4D4D4]/40 ">
                <div className="flex items-center gap-2 w-full bg-gray-100 rounded-sm p-1 mr-2 ">
                  <DocIcon />
                  <span className="text-[10px] font-[600] text-slate-gray tracking-tight">
                    Customer Service
                  </span>
                </div>
              </div>
              <div className="flex flex-col py-2">
                <div className="flex items-center gap-2 px-3 py-1">
                  <DocIcon/>
                  <span className="text-[10px] font-[500] text-slate-gray">
                    Sales Policy
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1">
                  <DocIcon />
                  <span className="text-[10px] font-[500] text-slate-gray">
                    Customer Service
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1">
                  <DocIcon />
                  <span className="text-[10px] font-[500] text-slate-gray">
                    Leaves Policy
                  </span>
                </div>
              </div>
            </div>
          </FeatureCard>

          {/* Step 3: Playground */}
          <FeatureCard
            variant="tertiary"
            title="Test the knowledge base in the playground"
            description="Ask a related question in the test LLM area to verify the knowledge base integration."
          >
            <div className="relative z-10 bg-white rounded-lg shadow-md p-3 w-full max-w-[280px]">
              <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px]  lg:text-xs font-medium text-slate-gray">
                    Knowledge Base
                  </span>
                  <div className="size-4.5 rounded bg-warning flex items-center justify-center">
                    <X className="size-3.5 text-white" strokeWidth="3"/>
                  </div>
              </div>
              <hr className="border-gray-100 mb-1" />
              <p className="text-[9px] lg:text-[11px] text-slate-gray mb-1 font-medium opacity-80">
                Chat with Hexa Ai
              </p>
              <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100 mb-2">
                <p className="text-[8px] lg:text-[11px] font-medium text-slate-gray leading-relaxed">
                  To test the knowledge base, ask related questions in the
                  test LLM area. The agent will automatically use the
                  knowledge base content in its responses without needing
                  prompt updates.
                </p>
              </div>
              <div className="flex items-center gap-2 w-full ">
                <div className="bg-white border border-gray-100 shadow-sm rounded-lg p-1.5 flex-1 flex items-center">
                  <span className="text-[9px] lg:text-[10px] text-ark-gray font-medium">
                    Hi, How to test...
                  </span>
                </div>
                <div className="bg-cyan-blue w-[26px] h-[26px] rounded-full flex shrink-0 items-center justify-center shadow-md">
                  <SendHorizontal
                    className="w-[10px] h-[10px] text-white -rotate-45 -ml-[1px] mt-[1px]"
                    strokeWidth={2.5}
                  />
                </div>
              </div>
            </div>
          </FeatureCard>
        </div>
      </div>
    </section>
  );
};

export default KnowledgeUsageSteps;
