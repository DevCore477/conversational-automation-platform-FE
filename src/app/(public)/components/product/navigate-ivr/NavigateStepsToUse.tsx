import FeatureCard from "../../FeatureCard";
import FunctionsStep from "../common/FunctionsStep";
import PromptStep from "../common/PromptStep";
import TransferCallStep from "../common/TransferCallStep";

const NavigateStepsToUse = () => {
  return (
    <section className="py-10 lg:py-20 bg-white">
      <div className="font-dm-sans w-full max-w-7xl mx-auto px-6 md:px-16">
        <h2 className="text-center md:text-start text-xl lg:text-2xl xl:text-3xl 4xl:text-4xl font-semibold text-dark-gray mb-8 lg:mb-12 tracking-tight">
          Step by step to use navigate IVR
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/*  Step    1 */}
          <FeatureCard
            variant="primary"
            title="Create functions"
            description="Create a new agent or use a template agent, then in the Functions section, select the “Navigate IVR” function to enable digit pressing."
          >
            <FunctionsStep/>
          </FeatureCard>

          {/* Step 2 */}
          <FeatureCard
            variant="secondary"
            title="Set up functions"
            description="Customize IVR by specifying when and which digits to press; detailed descriptions are optional for better accuracy."
          >
            <TransferCallStep/>
          </FeatureCard>
          
          {/* Step 3 */}
          <FeatureCard
            variant="tertiary"
            title="Add functions in the prompt"
            description="Include prompts like “Press 2 to reach the billing department” to guide the agent in navigating the IVR system."
          >
            <PromptStep/>
          </FeatureCard>
        </div>
      </div>
    </section>
  );
};

export default NavigateStepsToUse;
