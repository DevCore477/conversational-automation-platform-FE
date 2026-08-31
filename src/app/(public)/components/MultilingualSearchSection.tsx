"use client";

import { useState } from "react";

import SearchInput from "./SearchInput";
import LanguagesSection from "./sections/LanguagesSection";

export default function MultilingualSearchSection() {
  const [search, setSearch] = useState("");

  return (
    <>
      <div className="mx-auto w-full max-w-xl px-6 pb-10 md:px-16 lg:pb-20">
        <SearchInput
          placeholder="Search language..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          widthClass="w-full max-w-lg"
        />
      </div>
      <LanguagesSection searchQuery={search} />
    </>
  );
}
