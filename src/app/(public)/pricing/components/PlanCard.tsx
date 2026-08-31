import { Check, X, Clock } from "lucide-react";

export interface PlanCardProps {
  name: string;
  tagline: string;
  price: string;
  priceLabel?: string;
  badge?: string;
  extraRate: string;
  features: Array<{ text: string; included: boolean }>;
  buttonText: string;
  buttonVariant?: "primary" | "outline";
  highlighted?: boolean;
}

export function PlanCard({
  name,
  tagline,
  price,
  priceLabel = "/ mo",
  badge,
  extraRate,
  features,
  buttonText,
  buttonVariant = "outline",
  highlighted = false,
}: PlanCardProps) {
  const isPrimary = buttonVariant === "primary";

  return (
    <div
      className={`font-dm-sans bg-white rounded-3xl p-6 shadow-sm hover:shadow-md border border-cyan-blue transition flex flex-col relative`}
    >
      {highlighted && (
        <span className="absolute -top-3 right-4 bg-cyan-blue text-white text-xs font-bold uppercase px-4 py-0.5 rounded-full">
          best value
        </span>
      )}
      <span className="text-xs font-semibold uppercase tracking-wider text-cyan-blue bg-cyan-blue/10 px-3 py-1 rounded-full self-start mb-2">
        {badge || name}
      </span>
      <p className="text-xs text-slate-gray">{tagline}</p>
 
      <div className="font-dm-sans mt-2 text-center">
        <span className="text-lg lg:text-xl 2xl:text-2xl 4xl:text-[28px] font-semibold text-cyan-blue">
          {price}
        </span>
        <span className="text-sm font-medium text-slate-gray ml-1">
          {priceLabel}
        </span>
      </div>
      <div className="text-xs font-medium text-slate-gray bg-slate-100 inline-block px-4 py-1 rounded-full my-4">
        <span className="flex items-center gap-1">
          <Clock className="size-3.5" /> {extraRate}
        </span>
      </div>
      <ul className="font-dm-sans space-y-2 text-sm flex-1">
        {features.map((feature, index) => (
          <li key={index} className="flex text-xs items-start gap-2">
            {feature.included ? (
              <Check className="w-4 h-4 text-warning mt-0.5" />
            ) : (
              <X className="w-4 h-4 text-danger-soft mt-0.5" />
            )}
            {feature.text}
          </li>
        ))}
      </ul>
      {/* <button
        className={`mt-4 w-full py-2.5 rounded-full font-semibold text-sm transition ${
          isPrimary
            ? "bg-cyan-blue text-white hover:bg-cyan-blue shadow-md py-3"
            : "border-2 border-cyan-blue text-cyan-blue hover:bg-blue-50"
        }`}
      >
        {buttonText}
      </button> */}
      <button
        type="submit"
        // disabled={isSubmitting}
        className=" mt-4 rounded-full bg-dark-gray text-xs lg:text-sm lg:text-bas px-4 lg:px-6 py-2 lg:py-3 text-white transition cursor-pointer disabled:opacity-60 "
      >
        {buttonText}
      </button>
    </div>
  );
}