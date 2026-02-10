"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function ScrollToTop() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // బ్రౌజర్ ఆటోమేటిక్ స్క్రోల్ రీస్టోరేషన్‌ని ఆపేయమని చెప్తున్నాం
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // చిన్న డిలే (Timeout) ఇవ్వడం వల్ల పేజీ లోడ్ అయ్యాక పైకి వెళ్తుంది
    const timer = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
    }, 50); // 50ms డిలే చాలు

    return () => clearTimeout(timer);
  }, [pathname, searchParams]); // searchParams మారినప్పుడు కూడా పని చేయాలి

  return null;
}
