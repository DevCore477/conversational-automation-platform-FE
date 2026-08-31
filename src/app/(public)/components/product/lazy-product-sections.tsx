import SpamProtectionSection from "./verified-phone-numbers/SpamProtectionSection";
import VerifiedPhoneSteps from "./verified-phone-numbers/VerifiedSteps";
import PostWhat from "./post-call-analysis/PostCallAnalysis";
import PostStep from "./post-call-analysis/StepsToAddPostCall";
import NavigateWhen from "./navigate-ivr/WhenUseNavigateIVR";
import NavigateStep from "./navigate-ivr/NavigateStepsToUse";
import KnowledgeFeature from "./knowledge-base/KnowledgeFeature";
import KnowledgeStep from "./knowledge-base/KnowledgeUsageSteps";
import CallTransferDifference from "./call-transfer/Difference";
import CallTransferSetup from "./call-transfer/CallTransferFeature";
import UseAIAppointment from "./book-appointment/UseAIAppointment";
import AppointmentStep from "./book-appointment/AppointmentStep";
import IndustriesWeServe from "./book-appointment/IndustriesWeServe";

export function VerifiedPhoneLazySections() {
  return (
    <>
      <SpamProtectionSection />
      <VerifiedPhoneSteps />
    </>
  );
}

export function PostCallAnalysisLazySections() {
  return (
    <>
      <PostWhat />
      <PostStep />
    </>
  );
}

export function NavigateIvrLazySections() {
  return (
    <>
      <NavigateWhen />
      <NavigateStep />
    </>
  );
}

export function KnowledgeBaseLazySections() {
  return (
    <>
      <KnowledgeFeature />
      <KnowledgeStep />
    </>
  );
}

export function CallTransferLazySections() {
  return (
    <>
      <CallTransferDifference />
      <CallTransferSetup />
    </>
  );
}

export function BookAppointmentLazySections() {
  return (
    <>
      <UseAIAppointment />
      <AppointmentStep />
      <IndustriesWeServe />
    </>
  );
}
