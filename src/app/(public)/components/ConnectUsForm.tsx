"use client";

import { useState } from "react";
import { ConnectUs } from "@/assets";
import Button from "./Button";
import FormSelect from "./FormSelect";
import FormInput from "./FormInput";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  companySize: string;
  useCase: string;
  implementation: string;
  agentsCount: string;
  message: string;
  referralSource: string;
}

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  companySize: "1 - 10",
  useCase: "Use Hexa AI for my company's phone operations",
  implementation: "Self-setup with my developers",
  agentsCount: "Fewer than 10",
  message: "",
  referralSource: "Google search",
};

export default function ConnectForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch("/api/connect-us", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const details = Array.isArray(errorData.details)
          ? errorData.details.join(", ")
          : typeof errorData.details === "object" && errorData.details !== null
            ? errorData.details.message || JSON.stringify(errorData.details)
            : errorData.details;
        throw new Error(details || errorData.error || "Failed to submit form");
      }

      setSubmitStatus("success");
      setFormData(initialFormData);
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (submitStatus === "success") {
    return (
      <section className="relative w-full overflow-visible bg-white py-8 4xl:py-12">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[40%] bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(153,131,191,0.08)_100%)]" aria-hidden />
        <div className="relative mx-auto w-11/12 max-w-7xl px-4 md:px-16">
          <div className="flex min-h-[60vh] flex-col items-center justify-center py-16 md:py-24">
            <div className="w-full max-w-2xl rounded-2xl border border-gray-100 bg-white p-8 shadow-[0px_8px_40px_rgba(14,165,233,0.08)] md:p-12 lg:p-16">
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#0EA5E9]/10 to-[#EE10E5]/10 md:h-28 md:w-28">
                  <svg className="h-12 w-12 text-cyan-blue md:h-14 md:w-14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="mb-4 bg-[linear-gradient(90deg,rgba(14,165,233,0.8)_0%,rgba(238,16,229,0.8)_100%)] bg-clip-text text-3xl font-medium leading-tight text-transparent md:text-4xl lg:text-5xl">
                  Thank You!
                </h2>
                <p className="mb-2 text-base text-dark-gray md:text-lg">
                  Your message has been submitted successfully.
                </p>
                <p className="mb-8 text-sm text-slate-gray md:text-base">
                  Our team will review your inquiry and get back to you within 24 hours.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button
                    text="Submit Another Response"
                    backgroundColor="bg-cyan-blue"
                    textColor="text-white"
                    borderColor="border-cyan-blue"
                    onClick={() => setSubmitStatus("idle")}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="font-dm-sans relative w-full overflow-visible bg-white py-4 md:py-8 lg:py-8 4xl:py-12">
      {/* Decorative Background Gradient (Stage Bottom) */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[40%] bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(153,131,191,0.08)_100%)]"
        aria-hidden
      />

      <div className="relative mx-auto w-full lg:max-w-[980px] 2xl:max-w-[1280px] 4xl:max-w-[1540px] xs:px-6 md:px-">
        {/* Section Heading - Gradient Text */}
        <div className="mb-10 flex justify-end">
          <h1 className="bg-[linear-gradient(90deg,rgba(14,165,233,0.5)_0%,rgba(238,16,229,0.5)_73.56%)] bg-clip-text text-[50px] xs:text-[60px] font-medium leading-tight text-transparent md:text-[60px] lg:text-[70px] 2xl:text-[80px] 4xl:text-[120px]">
            CONNECT
          </h1>
        </div>

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 4xl:gap-12">
          {/* Left Side: Image Card with Floating Badges */}
          <div className="relative order-2 flex justify-center lg:order-1 lg:col-span-5">
            <div className="relative h-full w-full max-w-[520px] flex items-end justify-center overflow-hidden rounded-[20px]">
              <img
                src={ConnectUs.src}
                alt="Assistant"
                className="h-full w-auto object-contain"
              />
            </div>
          </div>

          {/* Right Side: Form Content */}
          <div className="order-1 lg:order-2 lg:col-span-7">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 lg:gap-8">
              {submitStatus === "error" && (
                <div className="rounded-md bg-red-50 p-4 text-sm text-danger-soft">
                  {errorMessage}
                </div>
              )}

              {/* Row 1: Names */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-8">
                <FormInput
                  label="First Name"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(value) => handleChange("firstName", value)}
                />
                <FormInput
                  label="Last Name"
                  placeholder="Deo"
                  value={formData.lastName}
                  onChange={(value) => handleChange("lastName", value)}
                />
              </div>

              {/* Row 2: Contact & Size */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-8 md:items-end">
                <FormInput
                  label="Email"
                  placeholder="johndeo@company.com"
                  type="email"
                  value={formData.email}
                  onChange={(value) => handleChange("email", value)}
                />
                <FormSelect
                  label="Number of employees work at your company?"
                  value={formData.companySize}
                  options={["1 - 10", "11 - 50", "51 - 100", "101 - 500", "500+"]}
                  onChange={(value) => handleChange("companySize", value)}
                />
              </div>

              {/* Row 3: Usage & Implementation */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-8 md:items-end">
                <FormSelect
                  label="How do you want to use Hexa Ai?"
                  value={formData.useCase}
                  options={["Use Hexa AI for my company's phone operations", "I want to help my clients implement AI voice agents", "Build a product for my customers", "Whitelabel and resell Hexa AI to my clients", "Become a Hexa AI certified partner"]}
                  onChange={(value) => handleChange("useCase", value)}
                />
                <FormSelect
                  label="How do you want to implement the solution?"
                  value={formData.implementation}
                  options={["Self-setup with my developers", "Managed service by Hexa AI", "Hybrid approach", "Need consulting"]}
                  onChange={(value) => handleChange("implementation", value)}
                />
              </div>

              {/* Row 4: Agents (Full Width) */}
              <FormSelect
                label="Number of contact center agents in your company?"
                value={formData.agentsCount}
                options={["Fewer than 10", "10 - 50", "51 - 100", "101 - 500", "500+"]}
                onChange={(value) => handleChange("agentsCount", value)}
              />

              {/* Row 5: Use Case (Textarea) */}
              <div className="flex flex-col gap-2">
                <label className="font-dm-sans text-xs 2xl:text-sm 4xl:text-base text-dark-gray">
                  What is your use case?
                </label>
                <textarea
                  placeholder="Write here...."
                  value={formData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  className="h-[64px] 2xl:h-[80px] 4xl:h-[108px] w-full rounded-md 2xl:rounded-lg 4xl:rounded-xl bg-white px-4 py-3 font-dm-sans text-xs 2xl:text-sm 4xl:text-lg font-light text-text-dark shadow-[0px_4px_4px_rgba(14,165,233,0.05)] outline-none focus:ring-1 focus:ring-[#0EA5E9]"
                />
              </div>

              {/* Row 6: Referral */}
              <FormSelect
                label="How did you hear about us?"
                value={formData.referralSource}
                options={["Google search", "Chatgpt/Perplexity Search", "Recommendation (friend, co-worker, community)", "Youtube", "Linkedln", "X/Twitter", "Reddit", "Product Hunt", "Competitors' Website", "Blogs & Articles", "Other"]}
                onChange={(value) => handleChange("referralSource", value)}
              />

              {/* Submit Button */}
              <div className="flex w-[140px] 2xl:w-[160px] 4xl:w-[160px] self-end">
                <Button
                  text={isLoading ? "Submitting..." : "Submit"}
                  backgroundColor="bg-cyan-blue"
                  textColor="text-white"
                  borderColor="border-cyan-blue"
                  onClick={() => {}}
                  disabled={isLoading}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}