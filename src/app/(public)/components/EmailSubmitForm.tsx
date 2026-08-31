"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";

type FormValues = {
  email: string;
};

export default function EmailSubmitForm() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/newsletter/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Subscription failed (${response.status})`);
      }

      const result = await response.json();
      
      if (result.status === "subscribed") {
        toast.success("Successfully subscribed to newsletter! 🎉");
        reset();
      } else {
        toast.error("Subscription failed. Please try again.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An unexpected error occurred");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-center gap-2 lg:gap-3 4xl:gap-5 max-w-sm"
    >
      <input
        type="email"
        placeholder="Your email"
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^\S+@\S+$/i,
            message: "Invalid email",
          },
        })}
        className="
          flex-1 bg-transparent
          rounded-full border border-slate-gray
          font-light
          text-sm lg:text-base
          px-4 lg:px-6 py-2 lg:py-3
          text-text-dark
          placeholder:text-muted-text
          outline-none
          !w-[150px] md:!w-[180px] lg:!w-[240px]
        "
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="
          rounded-full bg-dark-gray
          text-sm lg:text-base font-light
          px-4 lg:px-6 py-2 lg:py-3
          text-white
          transition
          cursor-pointer
          disabled:opacity-60 
          whitespace-nowrap
        "
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}