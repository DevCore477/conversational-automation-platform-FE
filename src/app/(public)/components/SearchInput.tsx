"use client";
import React from "react";
import {Search} from "lucide-react";
interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  widthClass?: string;
}

export default function SearchInput({
  placeholder = "Search...",
  value,
  onChange,
  className = "",
  backgroundColor = "bg-white",
  textColor = "text-slate-gray",
  borderColor = "",
  widthClass = "w-full max-w-lg",
}: SearchInputProps) {
  return (
    <div className={`${widthClass} ${className}`}>
      <div className="relative">
        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-gray">
          <Search />
        </span>
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`
            ${backgroundColor}
            ${textColor}
            ${borderColor}
            w-full pl-12 pr-4 py-3
            rounded-lg
            outline-none
            focus:shadow-md
            font-dm-sans
            transition
            shadow-md
          `}
        />
      </div>
    </div>
  );
}