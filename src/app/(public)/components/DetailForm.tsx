"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useCallState } from "@/store/call.store";
import { type PartialMakeCall } from "@/types/call.types";

type DetailFormValues = {
  phone: string;
  name: string;
  email: string;
};

interface DetailFormProps {
  voiceId: string;
  script: string;
}

export default function DetailForm({ ...props }: DetailFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<DetailFormValues>();

  const { makeCall, isLoading, clearError } = useCallState();

  const onSubmit = async (data: DetailFormValues) => {
    clearError();
    const payload: PartialMakeCall = {
      to: data.phone,
      script: props.script,
      voiceId: props.voiceId,
      model: "gpt-4o-mini",
      callerName: data.name,
      callerEmail: data.email,
    };
    const res = await makeCall(payload);
    if (!res?.success) {
      toast.error(res?.message || "Failed to initiate call");
    }

    toast.success("Call initiated successfully");

    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="xl:-mt-4 w-full max-w-[400px] rounded-[12px] lg:rounded-[16px] 4xl:rounded-[20px] bg-text-dark p-4 lg:p-6 4xl:p-8 flex flex-col gap-4 lg:gap-6"
    >
      <h2 className="text-white text-sm 2xl:text-base 4xl:text-[28px] font-semibold">
        Enter Details
      </h2>

      {/* Phone */}
      <div className="flex flex-col">
        <input
          type="tel"
          placeholder="+1 123-456-7890"
          {...register("phone", {
            required: "Phone number is required",
            pattern: {
              value:
                /^\+(\d{1,3})\s?\(?(\d{1,4})\)?[\s.-]?\(?(\d{1,5})\)?[\s.-]?\d{1,4}$/, // Regex for phone number with country code
              message:
                "Invalid phone number format (must include country code)",
            },
          })}
          className="h-[50px] lg:h-[60px] py-2 lg:py-3 px-3 lg:px-4 rounded-[12px] lg:rounded-[16px] bg-[#66666633] 
          text-white placeholder:text-gray-400
          border border-[#6B7280] outline-none
          text-xs lg:text-sm
          focus:border-white"
        />
        {errors.phone && (
          <p className="ml-1 text-xs lg:text-sm text-red-400">
            {errors.phone.message}
          </p>
        )}
      </div>

      {/* Name */}
      <div className="flex flex-col">
        <input
          type="text"
          placeholder="Wilson"
          {...register("name", {
            required: "Name is required",
          })}
          className="h-[50px] lg:h-[60px] py-2 lg:py-3 px-3 lg:px-4 rounded-[12px] lg:rounded-[16px] bg-[#66666633] 
          text-white placeholder:text-gray-400
          border border-[#6B7280] outline-none
          text-xs lg:text-sm
          focus:border-white"
        />
        {errors.name && (
          <p className="ml-1 text-xs lg:text-sm text-red-400">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="flex flex-col">
        <input
          type="email"
          placeholder="wilson@company.com"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Invalid email address",
            },
          })}
          className="h-[50px] lg:h-[60px] py-2 lg:py-3 px-3 lg:px-4 rounded-[12px] lg:rounded-[16px] bg-[#66666633] 
          text-white placeholder:text-gray-400
          text-xs lg:text-sm
          border border-[#6B7280] outline-none
          focus:border-white"
        />
        {errors.email && (
          <p className="ml-1 text-xs lg:text-sm text-red-400">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting || isLoading}
        className="mt-2 lg:mt-4 h-[60px] lg:h-[70px] 4xl:h-[80px] rounded-[12px] 4xl:rounded-[16px] bg-white
          font-medium text-[#2B2B2B] cursor-pointer
          text-xs lg:text-sm
          hover:bg-gray-100 transition disabled:opacity-60"
      >
        {isLoading ? "Calling..." : "Get a Call"}
      </button>
    </form>
  );
}
