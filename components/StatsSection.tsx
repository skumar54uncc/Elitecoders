"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FileText, Users, Briefcase, Award } from "lucide-react";

interface Stat {
  value: string;
  label: string;
  icon: React.ReactNode;
  numericValue?: number; // For counting animation
  suffix?: string; // For +, -, etc.
  isRange?: boolean; // For ranges like "40-100"
  rangeStart?: number;
  rangeEnd?: number;
}

const stats: Stat[] = [
  {
    value: "700+",
    label: "operative reports coded per month",
    icon: <FileText className="h-10 w-10" />,
    numericValue: 700,
    suffix: "+",
  },
  {
    value: "1100+",
    label: "office visits coded per month",
    icon: <FileText className="h-10 w-10" />,
    numericValue: 1100,
    suffix: "+",
  },
  {
    value: "40–100",
    label: "affidavits prepared per month",
    icon: <Briefcase className="h-10 w-10" />,
    isRange: true,
    rangeStart: 40,
    rangeEnd: 100,
  },
  {
    value: "12",
    label: "active clients supported",
    icon: <Users className="h-10 w-10" />,
    numericValue: 12,
  },
];

// Hook for counting animation
function useCountUp(end: number, duration: number = 2000, start: number = 0, isInView: boolean) {
  const [count, setCount] = useState(start);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(start + (end - start) * easeOutQuart));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, start, isInView]);

  return count;
}

function AnimatedStat({ stat, index }: { stat: Stat; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Always call hooks unconditionally at the top level
  // Use appropriate values based on stat type, but always call the hooks
  const rangeStartValue = stat.isRange && stat.rangeStart !== undefined ? stat.rangeStart : 0;
  const rangeEndValue = stat.isRange && stat.rangeEnd !== undefined ? stat.rangeEnd : 0;
  const numericValue = stat.numericValue !== undefined ? stat.numericValue : 0;
  
  const startCount = useCountUp(rangeStartValue, 1500, 0, isInView && stat.isRange === true);
  const endCount = useCountUp(rangeEndValue, 2000, 0, isInView && stat.isRange === true);
  const numericCount = useCountUp(numericValue, 2000, 0, isInView && stat.numericValue !== undefined);

  let displayValue: string;

  if (stat.isRange && stat.rangeStart !== undefined && stat.rangeEnd !== undefined) {
    displayValue = `${startCount}–${endCount}`;
  } else if (stat.numericValue !== undefined) {
    displayValue = `${numericCount}${stat.suffix || ""}`;
  } else {
    displayValue = stat.value;
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex flex-col items-center rounded-lg border border-gray-200 bg-gray-50 p-6 text-center"
    >
      <div className="mb-4 text-accent">{stat.icon}</div>
      <div className="text-4xl font-bold text-primary">{displayValue}</div>
      <div className="mt-2 text-base text-gray-600">{stat.label}</div>
    </motion.div>
  );
}

export default function StatsSection() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary sm:text-4xl">
            By the Numbers
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Trusted by New York hospitals and specialty practices
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <AnimatedStat key={index} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

