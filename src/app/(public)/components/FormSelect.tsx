import { useEffect, useRef, useState } from "react";
import { MouseEvent } from "react";

export default function FormSelect({
    label,
    value: controlledValue,
    options,
    onChange,
  }: {
    label: string;
    value?: string;
    options: string[];
    onChange?: (value: string) => void;
  }) {
    const [isOpen, setIsOpen] = useState(false);
    const [internalValue, setInternalValue] = useState(controlledValue || "");
    const [hasSelected, setHasSelected] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selected = controlledValue ?? internalValue;
  
    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside as unknown as EventListener);
      return () => document.removeEventListener("mousedown", handleClickOutside as unknown as EventListener);
    }, []);
  
    return (
      <div className="flex flex-col gap-2" ref={dropdownRef}>
        <label className="font-dm-sans text-xs leading-tight text-[#333333] 2xl:text-sm 4xl:text-base">
          {label}
        </label>
        
        <div className="relative">
          {/* Trigger Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`flex h-[36px] 2xl:h-[48px] 4xl:h-[52px] w-full items-center justify-between rounded-md 2xl:rounded-lg 4xl:rounded-xl border bg-white px-4 font-dm-sans text-xs font-light transition-all shadow-[0px_4px_4px_rgba(14,165,233,0.05)] 2xl:text-sm 4xl:text-base 
              ${isOpen ? "border-[#0EA5E9] ring-1 ring-[#0EA5E9]" : "border-transparent hover:border-[#0EA5E9]/30"}
            `}
          >
            <span className={hasSelected || (controlledValue !== undefined && selected !== controlledValue) || (controlledValue === undefined && selected !== "") ? "text-[#333333] text-start" : "text-[#6C757D]/50 text-start"}>
              {selected}
            </span>
            
            <svg
              viewBox="0 0 12 7"
              fill="none"
              className={`text-[#6C757D] size-2 2xl:size-2 4xl:size-3 transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`}
            >
              <path
                d="M1 1L6 6L11 1"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
  
          {/* Custom Dropdown Menu */}
          {isOpen && (
            <div className="absolute left-0 top-[60px] z-50 w-full overflow-hidden rounded-xl border border-[#0EA5E9]/10 bg-white py-1 shadow-xl animate-in fade-in zoom-in-95 duration-200">
              <div className="max-h-[240px] overflow-y-auto overflow-x-hidden custom-scrollbar">
                {options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      if (controlledValue !== undefined) {
                        onChange?.(option);
                      } else {
                        setInternalValue(option);
                      }
                      setHasSelected(true);
                      setIsOpen(false);
                    }}
                    className="flex w-full items-center px-4 py-3 text-left font-dm-sans text-xs text-[#333333] transition-colors hover:bg-[#0EA5E9]/10 2xl:text-sm 4xl:text-base"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }