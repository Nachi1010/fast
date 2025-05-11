import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";

// קומפוננטת הסטטיסטיקה עם אנימציה
interface StatItemProps {
  start: number;
  end: number;
  label: string;
  animate: boolean;
}

const StatItem = ({ start, end, label, animate }: StatItemProps) => {
  const { currentLang, getTextDirection } = useLanguage();
  const [count, setCount] = useState(start);
  const isRTL = currentLang === 'he';
  
  const animateCounter = useCallback(() => {
    const duration = 2000;
    const frames = 60;
    const interval = duration / frames;
    const step = (end - start) / frames;
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      const currentCount = Math.min(
        Math.floor(start + step * frame),
        end
      );
      setCount(currentCount);

      if (frame === frames) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [start, end]);

  useEffect(() => {
    if (animate) {
      return animateCounter();
    }
  }, [animate, animateCounter]);

  return (
    <div className={`text-center p-6 bg-white rounded-lg shadow-md ${isRTL ? 'rtl' : 'ltr'}`}
        style={{ direction: getTextDirection() }}>
      <div className="text-4xl font-bold text-primary mb-2 flex items-start justify-center gap-1">
        <span className="text-2xl mt-1">+</span>
        <span>{count.toLocaleString()}</span>
      </div>
      <div className="text-gray-600">
        {label}
      </div>
    </div>
  );
};

export const Statistics = () => {
  const { currentLang, getTextDirection } = useLanguage();
  const isRTL = currentLang === 'he';
  
  const [statsRef, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1
  });

  const stats = {
    en: [
      { start: 100, end: 400, label: "AI Expert Graduates" },
      { start: 1000, end: 2500, label: "Hours of Content" },
      { start: 10, end: 23, label: "Completed Cohorts" },
      { start: 10, end: 42, label: "Hiring Companies" }
    ],
    he: [
      { start: 100, end: 400, label: "בוגרים במשרות AI מובילות" },
      { start: 10, end: 23, label: "מחזורים הסתיימו" },
      { start: 10, end: 42, label: "שותפים בתעשייה" },
      { start: 1000, end: 2500, label: "שעות תוכן" },
    ]
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div ref={statsRef} className="max-w-3xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats[currentLang].map((stat, index) => (
              <StatItem 
                key={index} 
                start={stat.start}
                end={stat.end}
                label={stat.label}
                animate={inView}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}; 
