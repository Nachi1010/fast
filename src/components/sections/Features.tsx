import { useState, useRef, useEffect } from "react";
import "./Features.css";
import { useLanguage } from "@/contexts/LanguageContext";

interface FeatureProps {
  title: string;
  description: string;
  expandedText: string;
  arrowPosition: "left" | "right";
}

const Feature = ({
  title,
  description,
  expandedText,
  arrowPosition,
}: FeatureProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedByClick, setExpandedByClick] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { currentLang, getTextDirection } = useLanguage();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const arrowsRef = useRef<HTMLDivElement>(null);
  const featureRef = useRef<HTMLDivElement>(null);
  
  // זיהוי מכשירים ניידים בטעינה ובשינוי גודל המסך
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // בדיקה ראשונית
    checkMobile();
    
    // בדיקה בכל שינוי גודל מסך
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // אנימציה עדינה - מרחף באלגנטיות - כעת מוגדרת בקובץ CSS בלבד
  // מסירים את כל קוד האנימציה של JavaScript שגרם לבעיות
  
  // הגדרת Intersection Observer כדי לעקוב אחרי נראות הקומפוננטה
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // אם הקומפוננטה יצאה מהתצוגה, נאפס את מצב התצוגה
        if (!entries[0].isIntersecting) {
          setIsExpanded(false);
          setExpandedByClick(false);
        }
      },
      { threshold: 0.1 } // מספיק 10% מהקומפוננטה בתצוגה
    );
    
    if (featureRef.current) {
      observer.observe(featureRef.current);
    }
    
    return () => {
      if (featureRef.current) {
        observer.unobserve(featureRef.current);
      }
    };
  }, []);

  const getArrowChar = () => {
    if (currentLang === "en") {
      // באנגלית - מתחילים משמאל לימין, אז:
      return arrowPosition === "left" ? "❯" : "❮"; // חץ ימינה בהתחלה (שמאל), חץ שמאלה בסוף (ימין)
    } else {
      // בעברית - מתחילים מימין לשמאל, אז:
      return arrowPosition === "left" ? "❮" : "❯"; // חץ שמאלה בהתחלה (שמאל), חץ ימינה בסוף (ימין)
    }
  };

  // פונקציה חדשה לקביעת היישור לפי השפה
  const getAlignment = () => {
    if (currentLang === "en") {
      // באנגלית נשמור על היישור המקורי
      return arrowPosition === "right" ? "text-right" : "text-left";
    } else {
      // בעברית נהפוך את היישור
      return arrowPosition === "right" ? "text-left" : "text-right";
    }
  };

  // פונקציה לקביעת היישור של הדסקריפשן (הפוך מהטייטל)
  const getDescriptionAlignment = () => {
    if (currentLang === "en") {
      // באנגלית הדסקריפשן יהיה הפוך מהטייטל
      return arrowPosition === "right" ? "text-left" : "text-right";
    } else {
      // בעברית הדסקריפשן יהיה הפוך מהטייטל
      return arrowPosition === "right" ? "text-right" : "text-left";
    }
  };

  // פונקציה חדשה לקביעת היישור של חיצים לפי השפה
  const getArrowAlignment = () => {
    if (currentLang === "en") {
      // באנגלית נשמור על היישור המקורי
      return arrowPosition === "right" ? "justify-end" : "justify-start";
    } else {
      // בעברית נהפוך את היישור
      return arrowPosition === "right" ? "justify-start" : "justify-end";
    }
  };

  // פונקציה חדשה לקביעת סדר הקולונות
  const getColumnOrder = () => {
    if (currentLang === "en") {
      // באנגלית נשמור על הסדר המקורי
      return arrowPosition === "right" ? "md:order-2" : "";
    } else {
      // בעברית נהפוך את הסדר
      return arrowPosition === "right" ? "" : "md:order-2";
    }
  };

  const columnOrder = getColumnOrder();
  const arrowChar = getArrowChar();
  const textAlignment = getAlignment();
  const descriptionAlignment = getDescriptionAlignment();
  const arrowAlignment = getArrowAlignment();

  // המרווח בין החיצים יותאם לגודל החיצים עצמם
  const arrowGap = "clamp(0.25rem, 1vw, 0.75rem)";

  return (
    <div 
      ref={featureRef}
      className="grid md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 py-4 md:py-6 lg:py-8 first:pt-0 last:pb-0"
    >
      <div className={`flex items-center ${columnOrder}`}>
        <div className="w-full h-full flex flex-col justify-center">
          <div 
            ref={titleRef}
            className={`text-3xl md:text-4xl lg:text-5xl font-bold feature-title text-royal-light ${textAlignment} leading-tight`}
            style={{ 
              direction: getTextDirection(),
              fontSize: "clamp(2rem, 6.5vw, 3.8rem)",
              lineHeight: "1.2",
              letterSpacing: currentLang === "he" ? "-0.01em" : "0.01em"
            }}
          >
            {title}
          </div>
          <div 
            ref={arrowsRef}
            className={`flex mt-2 dynamic-arrow ${arrowAlignment} ${currentLang}`}
            style={{
              gap: arrowGap
            }}
          >
            <span className="arrow-part" style={{ fontSize: "clamp(2rem, 5vw, 7rem)" }}>{arrowChar}</span>
            <span className="arrow-part" style={{ fontSize: "clamp(2rem, 5vw, 7rem)" }}>{arrowChar}</span>
            <span className="arrow-part" style={{ fontSize: "clamp(2rem, 5vw, 7rem)" }}>{arrowChar}</span>
          </div>
        </div>
      </div>

      <div
        className={`${currentLang === "en" ? 
          (arrowPosition === "right" ? "md:order-1" : "") :
          (arrowPosition === "right" ? "" : "md:order-1")} ${
            isMobile ? 'mobile-feature-content' : ''
          }`}
        onClick={() => {
          setIsExpanded(!isExpanded);
          setExpandedByClick(!expandedByClick);
        }}
        onMouseEnter={() => {
          if (!expandedByClick) {
            setIsExpanded(true);
          }
        }}
        onMouseLeave={() => {
          if (!expandedByClick) {
            setIsExpanded(false);
          }
        }}
        onFocus={() => {
          // סימולציה של ריחוף במובייל באמצעות focus - פועל בדיוק כמו hover
          if (!expandedByClick && isMobile) {
            setIsExpanded(true);
            // אם זה לא בהרחבת לחיצה במובייל, יש אפשרות גם להרחיב
            if (!expandedByClick && isMobile) {
              setExpandedByClick(true); // מבטיח שהאנימציה לא תתנגש
            }
          }
        }}
        onBlur={() => {
          // סימולציה של סיום ריחוף במובייל - פועל בדיוק כמו hover
          if (!expandedByClick && isMobile) {
            setIsExpanded(false);
          }
        }}
        // ברגע שהמשתמש לוחץ, נסגור את האנימציה אם אין צורך בה
        onMouseUp={() => {
          if (!expandedByClick) {
            setIsExpanded(false);
          }
        }}
        // רק במובייל נאפשר התמקדות
        tabIndex={isMobile ? 0 : -1}
      >
        <div 
          className={`rounded-lg shadow-xl transition-all duration-700 overflow-hidden border-2 relative ${
            isExpanded 
              ? 'bg-royal-light/30 border-royal-light/60 text-white' 
              : 'bg-primary-dark border-royal-light/40 text-white'
          }`}
          // גובה דינמי במקום קבוע
          style={{ 
            height: 'clamp(8.5rem, 23vw, 15rem)'
          }}
        >
          {/* Background layers - מתקן את הבאג של הכתם הלבן ע"י הגדרת z-index נאותים */}
          <div className={`absolute inset-0 bg-primary-dark transition-opacity duration-700 z-0 ${
            isExpanded ? 'opacity-0' : 'opacity-90'
          }`}></div>
          
          {/* Reveal effect overlay with gold accent in non-expanded state - improved balance */}
          <div className={`absolute inset-0 bg-gradient-to-tr from-primary-dark/90 via-royal-dark/50 to-gold-dark/20 transition-opacity duration-700 z-1 ${
            isExpanded ? 'opacity-0' : 'opacity-100'
          }`}></div>
          
          {/* Grid pattern for expanded state */}
          <div className={`absolute inset-0 bg-grid-pattern transition-opacity duration-700 z-2 ${
            isExpanded ? 'opacity-30' : 'opacity-0'
          }`}></div>
          
          {/* Description */}
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 z-10 ${
            isExpanded 
              ? 'opacity-0 transform translate-y-4 scale-95 blur-sm pointer-events-none' 
              : 'opacity-100 transform translate-y-0 scale-100 blur-0'
          }`}>
            <p 
              className={`${descriptionAlignment} w-full px-4 sm:px-5 md:px-6 transition-all font-bold text-white text-2xl md:text-3xl lg:text-4xl`}
              style={{ 
                direction: getTextDirection(),
                fontSize: 'clamp(1.125rem, calc(0.9rem + 1.8vw), 2rem)',
                lineHeight: '1.3',
                letterSpacing: '0.01em',
                fontFamily: 'Assistant, sans-serif', // שימוש בפונט Assistant
                padding: 'clamp(0.75rem, 2vw, 1.5rem)',
                margin: '0'
              }}
            >
              {description}
            </p>
          </div>
          
          {/* Expanded content - aligned properly */}
          <div className={`absolute inset-0 transition-all duration-500 z-10 ${
            isExpanded 
              ? 'opacity-100 transform translate-y-0 scale-100 blur-0' 
              : 'opacity-0 transform translate-y-8 scale-105 blur-sm pointer-events-none'
          }`}>
            <div className="absolute inset-0 bg-royal-dark/10 backdrop-blur-sm z-0"></div>
            <div className="absolute inset-0 flex items-center justify-center z-1">
              <p 
                className={`w-full h-full text-white md:text-base lg:text-lg xl:text-xl ${
                  currentLang === "en" ? "text-left" : "text-right"
                }`}
                style={{ 
                  direction: getTextDirection(), 
                  padding: 'clamp(0.5rem, 1.5vw, 2rem)', // תיקון פדינג למסכים קטנים
                  fontFamily: 'sans-serif', // שימוש בפונט Assistant  })
                  lineHeight: 'clamp(0.7, 1.3, 1.8)',
                  fontWeight: 'normal', // Reduce boldness for English
                }}
              >
                {expandedText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Features = () => {
  const { currentLang } = useLanguage();
  
  const features = {
    en: [
      {
        title: "AI: High-Tech on Steroids",
        description: "Why there's no \"AI degree\" (or: could a leading AI company provide me with full training??)",
        expandedText: "The pioneering nature of AI and its unique complexities is just one of the factors why the average salary in this field is double that of the old high-tech world. Despite the skyrocketing demand for workers in AI, there is a significant shortage in the available workforce. The reason for this is also rooted in the unique complexity of the field.",
        arrowPosition: "left" as const
      },
      {
        title: "Becoming a Real AI Developer",
        description: "PracticsAI™ - Comprehensive training equivalent to 3 academic degrees + 2-3 years of experience",
        expandedText: "The innovative and subsidized learning methodology was developed specifically for AI sciences by international teaching experts. This allows acquiring all the skills and disciplines required in artificial intelligence sciences during just one academic year - in a special format that combines practical experience in various active projects being worked on at CloserAI.",
        arrowPosition: "right" as const
      },
      {
        title: "One-of-a-Kind Global Opportunity",
        description: "all successful graduates will be integrated into our company and leading AI companies in Israel. Guaranteed.",
        expandedText: "CloserAI's groundbreaking recruitment program—one of Israel's ten growing AI companies—was established precisely to meet industry needs. Thanks to a unique partnership with additional leading AI companies, it's now possible for the first time to skip three exhausting degrees and be accepted to leading AI positions in our company or one of our partners.",
        arrowPosition: "left" as const
      }
    ],
    he: [
      {
        title: "™PracticsAI - הזדמנות ייחודית בעולם ה-AI",
        description: "למה בעצם אין \"תואר ללימודי AI\" (או: יש מצב שחברת AI מובילה תעניק לי הכשרה מלאה??)",
        expandedText: "האופי החלוצי של תחום ה-AI ומורכבויותיו הייחודיות, הוא רק אחד הגורמים לכך שממוצע השכר בתחום הינו כפול מהממוצע בעולמות ההייטק הישן. למרות הביקוש המסחרר לעובדים בתחום ה-AI, מורגש חסר משמעותי בהיצע כח האדם הזמין. הסיבה לכך נעוצה גם היא במורכבות הייחודית של התחום",
        arrowPosition: "left" as const
      },
      {
        title: "להפוך למפתח AI אמיתי בתוך פחות משנה",
        description: "בעלי ידע אקדמי יכולים להפוך למפתחי AI ללא צורך בתארים מתקדמים",
        expandedText: "מתודולוגיית הלימודים החדשנית והמסובסדת, פותחה באופן ייעודי למדעי ה-AI על ידי מומחי הוראה בינלאומיים. כך ניתן לרכוש את כלל המיומנויות והדיסציפלינות הנדרשות במדעי הבינה המלאכותית, במהלך שמונה חודשים בלבד - במתכונת מיוחדת המשלבת התנסות מעשית במגוון פרוייקטים פעילים עליהם עובדים ב-CloserAI",
        arrowPosition: "right" as const
      },
      {
        title: "AI: הייטק על סטרואידים. בואו לעבוד איתנו",
        description: "כלל המסיימים בהצלחה ישולבו מיידית בחברתנו ובחברות ה-AI המובילות בישראל. בהתחייבות.",
        expandedText: "תכנית הגיוס פורצת הדרך של CloserAI -מעשרת חברות ה-AI הצומחות בישראל- הוקמה בדיוק על מנת לענות לצרכי התעשייה. בזכות שת\"פ ייחודי עם חברות AI נוספות, מהמובילות בתחום - ניתן לראשונה לוותר על לימוד של שלשה תארים מייגעים ולהתקבל למשרות AI מובילות בחברתנו, או באחת השותפות",
        arrowPosition: "left" as const
      }
    ]
  };

  return (
    <section className={`w-full bg-dark-darker py-4 md:py-6 lg:py-8 ${currentLang}`}>
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 max-w-7xl">
        {features[currentLang].map((feature, index) => (
          <div key={index} className={`${index === 1 ? "feature-second-item" : ""}`}>
            <Feature {...feature} />
          </div>
        ))}
      </div>
    </section>
  );
};
