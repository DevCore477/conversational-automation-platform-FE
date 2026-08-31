"use client";

export default function FormInput({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  type?: string;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-dm-sans text-xs 2xl:text-sm 4xl:text-base text-dark-gray">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="h-[36px] 2xl:h-[48px] 4xl:h-[52px]  w-full rounded-md 2xl:rounded-lg 4xl:rounded-xl bg-white px-4 font-dm-sans text-xs 2xl:text-sm 4xl:text-base font-light text-text-dark shadow-[0px_4px_4px_rgba(14,165,233,0.05)] outline-none focus:ring-1 focus:ring-[#0EA5E9]"
      />
    </div>
  );
}