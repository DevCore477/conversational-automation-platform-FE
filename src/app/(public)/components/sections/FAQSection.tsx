"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface FAQItem {
  question: string;
  answer: string;
  link?: { href: string; label: string };
}

interface FAQSectionProps {
  faqs: FAQItem[];
  title?: string;
  className?: string;
}

export default function FAQSection({
  faqs,
  title = "FAQs",
  className,
}: FAQSectionProps) {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (question: string) => {
    setOpenItems((prev) =>
      prev.includes(question)
        ? prev.filter((q) => q !== question)
        : [...prev, question]
    );
  };

  return (
    <section
      className={
        className ??
        "font-dm-sans w-full max-w-7xl mx-auto px-6 md:px-16 py-10 lg:py-20"
      }
    >
      <h2 className="text-center md:text-start text-xl lg:text-2xl xl:text-3xl 4xl:text-4xl font-semibold text-dark-gray tracking-tight mb-6">
        {title}
      </h2>
      <div className="space-y-4">
        {faqs.map((faq) => {
          const isOpen = openItems.includes(faq.question);
          return (
            <Collapsible
              key={faq.question}
              open={isOpen}
              onOpenChange={() => toggleItem(faq.question)}
              className="rounded-xl border border-slate-200 bg-white"
            >
              <CollapsibleTrigger className="flex w-full items-center justify-between p-3 md:p-5 text-left">
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-dark-gray pr-4">
                  {faq.question}
                </h3>
                <ChevronDown
                  className={`size-5 shrink-0 text-slate-gray transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-3 md:px-5 pb-5">
                <p className="text-sm md:text-base text-slate-gray font-light">
                  {faq.answer}
                </p>
                {faq.link ? (
                  <div className="mt-3">
                    <Link
                      href={faq.link.href}
                      className="text-cyan-blue underline underline-offset-4 text-sm md:text-base"
                    >
                      {faq.link.label}
                    </Link>
                  </div>
                ) : null}
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </div>
    </section>
  );
}
