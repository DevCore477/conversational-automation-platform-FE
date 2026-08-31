"use client";

import FeatureCard from "../../FeatureCard";
import FunctionsStep from "../common/FunctionsStep";
import PromptStep from "../common/PromptStep";
import TransferCallStep from "../common/TransferCallStep";

const CallTransferFeature = () => {
  return (
    <section className="py-10 lg:py-20 bg-white">
      <div className="font-dm-sans w-full max-w-7xl mx-auto px-6 md:px-16">
        <h2 className="text-center md:text-start text-xl lg:text-2xl xl:text-3xl 4xl:text-4xl font-semibold text-dark-gray mb-8 lg:mb-12 tracking-tight">
          How to Setup Our Call Transfer Feature
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/*  Step    1 */}
          <FeatureCard
            variant="primary"
            title="Add the function"
            description="Start by selecting a template or using an existing AI agent, then go to the Functions section and add the 'Call Transfer' function."
          >
            <FunctionsStep/>
          </FeatureCard>
          {/* Step 2 */}
          <FeatureCard
            variant="secondary"
            title="Configure the function"
            description="Decide between Cold Transfer for quick routing or Warm Transfer to share context, set the 'Transfer To' number accordingly, and you're all set."
          >
            <TransferCallStep/>
          </FeatureCard>
          {/* Step 3 */}
          <FeatureCard
            variant="tertiary"
            title="Add the function into the agent"
            description="Finally, add the function to your agent with a prompt like 'If the user said yes, call 'transfer_call' to transfer the call to a human.'"
          >
            <PromptStep/>
          </FeatureCard>
        </div>
      </div>
    </section>
  );
};

export default CallTransferFeature;
