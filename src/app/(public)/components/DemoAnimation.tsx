"use client";

import { useState, useEffect } from "react";

import AnimatedCursor from "./AnimatedCursor";
import CustomerServiceModal from "./CustomerServiceModal";
import KnowledgeBaseModal from "./KnowledgeBaseModal";

type Phase = "kb" | "cursor" | "customer" | "reset";

export default function DemoAnimation() {
  const [phase, setPhase] = useState<Phase>("kb");

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (phase === "kb") {
      timer = setTimeout(() => setPhase("cursor"), 900);
    }

    if (phase === "cursor") {
      timer = setTimeout(() => setPhase("customer"), 700);
    }

    if (phase === "customer") {
      timer = setTimeout(() => setPhase("reset"), 2000);
    }

    if (phase === "reset") {
      timer = setTimeout(() => setPhase("kb"), 700);
    }

    return () => clearTimeout(timer);
  }, [phase]);

  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
      <div className="relative">
        <KnowledgeBaseModal phase={phase} />
        <CustomerServiceModal phase={phase} />
      </div>

      <AnimatedCursor phase={phase} />
    </div>
  );
}
