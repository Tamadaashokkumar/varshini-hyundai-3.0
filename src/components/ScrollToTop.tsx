// "use client";

// import { useEffect } from "react";
// import { usePathname, useSearchParams } from "next/navigation";

// export default function ScrollToTop() {
//   const pathname = usePathname();
//   const searchParams = useSearchParams();

//   useEffect(() => {
//     // బ్రౌజర్ ఆటోమేటిక్ స్క్రోల్ రీస్టోరేషన్‌ని ఆపేయమని చెప్తున్నాం
//     if ("scrollRestoration" in window.history) {
//       window.history.scrollRestoration = "manual";
//     }

//     // చిన్న డిలే (Timeout) ఇవ్వడం వల్ల పేజీ లోడ్ అయ్యాక పైకి వెళ్తుంది
//     const timer = setTimeout(() => {
//       window.scrollTo({
//         top: 0,
//         left: 0,
//         behavior: "instant",
//       });
//     }, 50); // 50ms డిలే చాలు

//     return () => clearTimeout(timer);
//   }, [pathname, searchParams]); // searchParams మారినప్పుడు కూడా పని చేయాలి

//   return null;
// }

"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// 1. అసలైన లాజిక్ మొత్తం ఈ ఇన్నర్ కాంపోనెంట్ లో రాశాను
function ScrollHandler() {
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

// 2. దాన్ని Suspense తో ర్యాప్ చేసి ఎక్స్‌పోర్ట్ చేస్తున్నాను (Next.js Build Error రాకుండా)
export default function ScrollToTop() {
  return (
    <Suspense fallback={null}>
      <ScrollHandler />
    </Suspense>
  );
}
