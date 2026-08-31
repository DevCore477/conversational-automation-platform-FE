import FeatureComplaintBox from "../FeatureComplaintBox";
import FeatureMultlingualBox from "../FeatureMultlingualBox";
import FeatureRelaiableBox from "../FeatureRelaiableBox";
import FeatureScalabilityBox from "../FeatureScalabilityBox";
import FeatureVoiceAiBox from "../FeatureVoiceAiBox";

export default function FeaturesSection() {
  return (
    <div className="font-dm-sans w-full max-w-7xl mx-auto px-6 md:px-16 flex flex-col gap-7 lg:gap-16 4xl:gap-20 py-10 lg:py-20">
      <h2 className="font-semibold text-xl lg:text-2xl xl:text-3xl 4xl:text-4xl text-dark-gray">
        Build Enterprise-grade AI Voice Agents At scale
      </h2>
      <div className="hidden lg:flex gap-4 2xl:gap-8">
        <div className="flex-2/3 flex flex-col gap-4 2xl:gap-8">
          <FeatureComplaintBox />
          <div className="flex gap-4 xl:gap-8">
            <FeatureMultlingualBox />
            <FeatureScalabilityBox />
          </div>
        </div>
        <div className="flex-1/3 flex flex-col gap-4 2xl:gap-8">
          <FeatureVoiceAiBox />
          <FeatureRelaiableBox />
        </div>
      </div>

      {/**Mobile */}
      <div className="flex flex-col gap-4 md:hidden">
        <FeatureComplaintBox />
        <FeatureVoiceAiBox />
        <FeatureMultlingualBox />
        <FeatureScalabilityBox />
        <FeatureRelaiableBox />
      </div>

      {/**Tablets */}
      <div className="hidden md:flex flex-col gap-4 lg:hidden">
        <div className="flex items-center gap-4">
          <FeatureComplaintBox />
          <FeatureVoiceAiBox />
        </div>
        <div className="flex items-center gap-4">
          <FeatureMultlingualBox />
          <FeatureScalabilityBox />
        </div>
        <FeatureRelaiableBox />
      </div>
    </div>
  );
}
