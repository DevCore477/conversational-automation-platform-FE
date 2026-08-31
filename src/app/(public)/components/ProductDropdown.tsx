"use client";

import { useRouter } from "next/navigation";

import { PRODUCT_DROPDOWN } from "@/app/(public)/product-nav";

interface ProductDropdownProps {
  isOpen: boolean;
  onNavigate?: () => void;
}

export default function ProductDropdown({
  isOpen,
  onNavigate,
}: ProductDropdownProps) {
  const router = useRouter();

  const go = (path: string) => {
    router.push(path);
    onNavigate?.();
  };

  if (!isOpen) return null;

  const categories = Object.entries(PRODUCT_DROPDOWN);

  return (
    <div className="absolute left-1/2 transform -translate-x-1/3 mt-10 4xl:mt-[71px] bg-white shadow-md 4xl:shadow-[0px_4px_4px_rgba(0,0,0,0.1)] rounded-[20px] p-8 z-50 w-[320px] sm:w-[400px] md:w-[600px] lg:w-[700px] xl:w-[700px] 2xl:w-[700px] 4xl:w-[850px]">
      <div className="flex flex-row justify-center items-start gap-8">
        {" "}
        {categories.map(([category, items], idx) => (
          <div key={category} className="flex flex-row items-start">
            <div className="flex flex-col items-start gap-3 lg:gap-4 4xl:gap-[24px]">
              <h3 className="text-cyan-blue 4xl:text-[#0EA5E9] font-semibold 4xl:font-['DM_Sans'] text-xs 2xl:text-xs 4xl:text-sm 4xl:leading-[20px]">
                {category}
              </h3>
              {items.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => go(item.path)}
                  className="group relative text-muted-text 4xl:text-[#6C757D] hover:text-cyan-blue 4xl:hover:text-[#0EA5E9] text-xs 2xl:text-xs 4xl:text-sm 4xl:leading-[20px] 4xl:font-['DM_Sans'] 4xl:font-normal text-start whitespace-nowrap transition-colors"
                >
                  {item.name}
                  <span className="absolute left-0 -bottom-1 h-[2px] bg-cyan-blue 4xl:bg-[#0EA5E9] transition-all duration-300 ease-in-out w-0 group-hover:w-full" />
                </button>
              ))}
            </div>
            {idx < categories.length - 1 && (
              <div className="bg-gray-200 4xl:bg-[#D9D9D9] h-[120px] xl:h-[150px] 2xl:h-[150px] 4xl:h-[160px] w-[1px] rounded-full 4xl:rounded-[100px] ml-6 lg:ml-8 xl:ml-10 2xl:ml-12 4xl:ml-[80px]" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
