import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import "./FAQ.css";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQListItem = ({ item, isOpen, onClick }: { 
  item: FAQItem; 
  isOpen: boolean; 
  onClick: () => void 
}) => {
  const { getTextDirection, currentLang } = useLanguage();
  
  return (
    <div 
      className="faq-item mb-4 bg-dark-light/30 rounded-lg overflow-hidden"
      data-state={isOpen ? "open" : "closed"}
    >
      <button
        className="w-full flex items-center justify-between p-4 text-white/90"
        onClick={onClick}
        aria-expanded={isOpen}
        style={{ direction: getTextDirection() }}
      >
        <span className="text-lg font-medium">{item.question}</span>
        <span className="faq-icon transition-transform duration-300">
          {isOpen ? (
            <Minus className="h-5 w-5 text-royal-light flex-shrink-0" />
          ) : (
            <Plus className="h-5 w-5 text-royal-light flex-shrink-0" />
          )}
        </span>
      </button>
      <div 
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div 
          className="p-4 border-t border-royal-light/20"
          style={{ direction: getTextDirection() }}
        >
          <p 
            className="text-white/60 whitespace-pre-wrap text-[0.95rem] leading-[1.65] font-light tracking-[0.01em]"
            style={{ 
              direction: getTextDirection(),
              fontFamily: currentLang === "he" ? "'Assistant', sans-serif" : "'Inter', sans-serif",
              WebkitFontSmoothing: "antialiased",
              fontOpticalSizing: "auto",
              textShadow: "none" 
            }}
            dangerouslySetInnerHTML={{ __html: item.answer }}
          ></p>
        </div>
      </div>
    </div>
  );
};

const faqItems = {
  en: [
    {
      question: "Who are we?",
      answer: "Hello, nice to meet you. We're PracticsAI™, CloserAI's recruitment program - one of Israel's ten fastest-growing AI companies. When we discovered the incredible gap between our recruitment needs and those of our colleagues versus the limited workforce supply in the market, we decided, in collaboration with other AI companies, to establish a roundtable with international teaching experts in the field. Together with leading mathematicians, programmers, neuroscientists, and data scientists, we created PracticsAI™ - the world's only program where an \"ordinary person\" can become an AI scientist with comprehensive knowledge and rich experience, with a contractual commitment to a position in our company upon course completion."
    },
    {
      question: "What's in the program?",
      answer: "With deep understanding of the content and comprehensive knowledge of industry needs, we've compressed into one intensive year all the content and learning methods that will transform you into AI developers with theoretical, intuitive, and practical perspectives, and with comprehensive knowledge equivalent to graduates with three degrees in mathematics, computer science, data science, and neuroscience. Throughout (almost) the entire course, students work hands-on on live projects from the company's regular operations, thus building an autodidactic approach that will help them work in the \"real world\" while creating experience and a portfolio equivalent to two-three years of practical experience."
    },
    {
      question: "How does the magic happen?",
      answer: "PracticsAI™'s innovative and successful learning methodology, developed by renowned teaching experts and international AI scientists, is specifically adapted to the complex curriculum and inherent multi-disciplinary nature of AI. Every detail has been carefully considered to ensure each student acquires all required disciplines and critical learning skills, as well as familiarity with the most innovative architectures that appear regularly, while constantly corresponding with dynamic industry needs. Simultaneously, significant thought is invested in imparting autodidactic and analytical abilities that will enable students to cope long-term in such a dynamic and evolving field."
    },
    {
      question: "What's the unique teaching method?",
      answer: "Throughout the academic year, we'll tackle the AI world from all angles. We'll invest considerable time in acquiring programming languages and coding skills, familiarize ourselves with all relevant tools and aids in the field, and explore the latest research. More importantly, we'll develop the theoretical approach that will help us make complex decisions based on multiple disciplines, extensively practice every aspect of our studies, and build real projects from the company's operations. Combined with mental thinking exercises, we'll become leading and groundbreaking AI scientists: autodidacts capable of handling any new technology or architecture that emerges in the near future."
    },
    {
      question: "What exactly do we learn?",
      answer: "PracticsAI™'s unprecedentedly successful curriculum is divided into four separate semesters – each containing learning modules from theoretical, intuitive, and practical perspectives. In the first two, we'll compress all foundational studies (like mathematics) and infrastructure studies (like Python programming) required. In the third, we'll focus on advanced AI studies (like convolutional networks and Backprograming) and familiarize ourselves with a wide range of leading architectures. In the fourth semester, students will be divided into tracks according to the role assigned to each by our HR department, where we'll learn about advanced training methods, integrate into dedicated teams by track, and familiarize ourselves with architectures relevant to the specific track. Visual and generative architectures will be taught in all tracks."
    },
    {
      question: "What are the training costs?",
      answer: "The actual cost of all learning materials is estimated at $38,000 per student. However, given acceptance to the program (which is required anyway, unfortunately) - the vast majority of this amount is subsidized by our group companies, the Innovation Authority, and additional funding sources. Ultimately, all students pay only a single-digit percentage of the total training cost. Even this symbolic cost is offset anyway by the astronomical salaries that company employees receive after completing the training."
    },
    {
      question: "Who is the program for?",
      answer: "PracticsAI™ - CloserAI's training academy, was established to address the existential need of the AI industry across its various branches. We recruit high-quality individuals with advanced mental capabilities - with the explicit goal of having them fill the various positions available at our company through the fastest possible track without compromising on the level of education and knowledge. This is why in our assessment process we filter only candidates with specific traits that will allow us to wholeheartedly offer signing an explicit contract with a commitment to employment in our company upon course completion. Academic degrees aren't necessary because most academic content and the outdated pedagogical method aren't suitable for the dynamic and evolving AI world anyway, and the rest we teach ourselves through an innovative method in accelerated training."
    },
    {
      question: "Is there a job guarantee?",
      answer: "Yes, absolutely. All candidates who successfully complete the course (approximately 96.7% based on previous cohorts' average) will be immediately accepted into coveted AI positions at CloserAI or one of the 35 growing AI companies in Israel that collaborate with us. This is also why in the fourth semester of PracticsAI™'s curriculum, all classes are redistributed into different tracks where they'll learn architectures and algorithmic methodologies dedicated to each candidate's assigned placement field. However, attendance of less than 80% of studies without approval may terminate our employment commitment upon course completion - the studies are particularly intensive and every miss is significant."
    },
    {
      question: "Who can apply?",
      answer: "Anyone can register for compatibility assessment, <a href='#registration-form' class='text-white font-bold hover:text-white/80 hover:underline transition-colors' onclick='event.preventDefault(); document.getElementById(\"registration-form\").scrollIntoView({behavior:\"smooth\"});'>right here</a>. However, registration doesn't guarantee acceptance to the program. We recruit high-quality individuals with advanced mental capabilities - with the explicit goal of having them fill the various positions available upon completion of studies. This is why we conduct a thorough assessment process where we filter only candidates with specific traits that will allow us to wholeheartedly offer signing an explicit contract in advance, with a commitment to employment in our company upon course completion. It's important to emphasize that the screening process focuses solely on the candidate's personal and mental capabilities, and no prior knowledge or academic degree is required because we provide these ourselves through an innovative method during the accelerated training."
    },
    {
      question: "Why should you join us?",
      answer: "If and when you're accepted into the training program, PracticsAI™ will provide you with a unique opportunity to skip three exhausting degrees and jump straight into the deep world of AI after just one year of intensive training. The AI profession is complex and intricate, which is why there isn't any single academic degree that enables comprehensive AI studies. The \"Programming with AI\" courses and similar offerings from old-tech educational institutions are outdated courses that have lost relevance with marginal content additions, which at best will help the average software engineer stay relevant for a few more years."
    },
    {
      question: "What else are you waiting for?",
      answer: "Nothing. <a href='#registration-form' class='text-white font-bold hover:text-white/80 hover:underline transition-colors' onclick='event.preventDefault(); document.getElementById(\"registration-form\").scrollIntoView({behavior:\"smooth\"});'>Submit your application</a> here and now. Suitable candidates can win the world's only entry ticket to a secure springboard directly into the profession of the future."
    }
  ],

  he: [
    {
      question: "מי אנחנו?",
      answer: "היי, נעים מאוד. אז אנחנו CloserAI – אחת מעשרת חברות ה-AI הצומחות ביותר בישראל. כאשר התברר הפער הבלתי נתפס בין צרכי הגיוס שלנו ושל הקולגות, לבין היצע כח האדם המצומצם בשוק – החלטנו, בשת\"פ עם חברות AI נוספות, להקים שולחן עגול שבו יושבים מומחי הוראה בינלאומיים עם זיקה לתחום. ובשת\"פ עם המתמטיקאים, המתכנתים, מדעני המוח והנתונים המובילים בתחומם, הקמנו את ™PracticsAI - התכנית היחידה מסוגה בעולם, שבה אדם \"מן השורה\" יכול להפוך למדען AI עם ידע מקיף וניסיון עשיר, כשבכיסו התחייבות חוזית למשרה בחברתנו עם תום הקורס."
    },
    {
      question: "מה בתוכנית?",
      answer: "מתוך היכרות עמוקה עם התכנים והבנה מקיפה של צרכי התעשייה, דחסנו לשנת לימודים אחת אינטנסיבית את כל התכנים ושיטות הלמידה שבאמצעותם נהפוך למתכנתי AI עם נקודת מבט תיאורטית, אינטואיטיבית וביצועית. ועם ידע מקיף ושווה ערך לבוגרי שלשה תארים במתמטיקה, מדעי המחשב והנתונים ומדעי המוח. לאורך (כמעט) כל הקורס, הסטודנטים יעבדו בשילוב \"hands on\" על פרוייקטים חיים מתוך שדרת הפעילות הסדירה של החברה כך שבמקביל לידע התיאורטי התלמיד בונה לעצמו גישה אוטודידקטית שתסייע לו בעבודה ב\"עולם האמיתי\", ויוצר לעצמו ניסיון ותיק עבודות שווה ערך לשנתיים-שלש של ניסיון מעשי."
    },
    {
      question: "איך קורה הקסם?",
      answer: "מתודולוגיית הלימודים החדשנית והמצליחה של ™PracticsAI, פותחה בידי מומחי הוראה ידועי-שם ומדעני AI בינלאומיים, באופן ספציפי המותאם לתכני הלימודים המורכבים ולמולטי-דיסציפלינריות המובנית של תחום ה-AI. נעשתה חשיבה על כל פרט, כך שכל תלמיד ירכוש את כלל הדיסציפלינות הנדרשות, ואת מיומנויות הלמידה הקריטיות, כמו גם היכרות עם הארכיטקטורות החדשניות ביותר המופיעות חדשות לבקרים, תוך התכתבות מתמדת עם צרכי התעשייה הדינמיים. במקביל, מושקעת חשיבה רבה בהקניית יכולות אוטודידקטיות ואנליטיות, שיאפשרו לתלמיד התמודדות ל-long shot בתחום דינמי ומתפתח שכזה."
    },
    {
      question: "מהי שיטת הלימוד הייחודית?",
      answer: "לאורך כל שנת הלימודים נתקוף את עולם ה-AI מכל היבטיו. נשקיע לא מעט זמן ברכישת שפות תכנות ומיומנויות כתיבת קוד, נכיר את כל הכלים והעזרים הרלוונטיים לתחום, ונערוך הכרות עם המחקר החדשני ביותר. אבל חשוב מכך, נפתח את הגישה התיאורטית שתסייע לנו לקבל החלטות מורכבות שמתבססות על דיסציפלינות מרובות, נתרגל שעות רבות כל אספקט של הלימודים, ונבנה יחד פרוייקטים אמיתיים מתוך פעילות החברה. בשילוב תרגולי חשיבה מנטליים – נהפוך למדעני AI מובילים ופורצי דרך: אוטודידקטים שמסוגלים להתמודד עם כל טכנולוגיה או ארכיטקטורה חדשה שתצמח בעתיד הלא-רחוק."
    },
    {
      question: "מה לומדים תכלס?",
      answer: "תוכנית הלימודים של ™PracticsAI הזוכה להצלחה חסרת תקדים, מחולקת לארבעה סמסטרים נפרדים – בכל אחד מהם מערכי לימודים מזוויות של גישה תיאורטית, גישה אינטואיטיבית וגישה ביצועית – בשני הראשונים נדחס את כל לימודי הבסיס (כמו מתמטיקה) ולימודי התשתית (כמו תכנות בפייתון) הנדרשים. בשלישי, נתמקד כבר בלימודי AI מתקדמים (כמו רשתות קונבולוציוניות ו-Backprograming) ונערוך הכרות עם מגוון רחב של ארכיטקטורות מובילות. בסמסטר הרביעי התלמידים יתחלקו למסלולים לפי התפקיד שיוקצה לכל אחד מהם בידי מחלקת ה-hr שלנו שם נלמד על שיטות אימון מתקדמות, נשתלב בצוותים ייעודיים לפי מסלול ונערוך הכרות עם ארכיטקטורות רלוונטיות למסלול הספציפי. בכל המסלולים יילמדו גם ארכיטקטורות חזותיות וגנרטיביות."
    },
    {
      question: "מה עלויות ההכשרה?",
      answer: "העלות הריאלית של כלל מערכי הלימודים מוערכת בכ-38,000$ לתלמיד. עם זאת, בהינתן עמידה בתנאי הקבלה למסלול (שבלעדיה בלאו הכי לא ניתן להצטרף לתכנית, לצערנו) - רובו העצום של הסכום מסובסד בידי חברות הקבוצה, רשות החדשנות, וגורמים מממנים נוספים. כך שבסופו של יום, כלל התלמידים משלמים אחוז בודד בלבד מעלות ההכשרה הכוללת. גם עלות סמלית זו מתקזזת ממילא עם משכורות העתק שמקבלים עובדי החברה לאחר תום ההכשרה."
    },
    {
      question: "למי התכנית מיועדת?",
      answer: "™PracticsAI – אקדמיית ההכשרה של CloserAI, הוקמה בכדי לענות על צורך קיומי של תעשיית ה-AI לענפיה השונים. אנו מגייסים אנשים איכותיים ו בעלי יכולות מנטאליות גבוהות – במטרה מוצהרת שאלו יאיישו את מגוון המשרות הזמינות אצלנו במסלול המזורז ביותר האפשרי מבלי להתפשר על רמת הלימודים וה kenn. זו הסיבה שבתהליך האבחון אנו מסננים אך ורק מועמדים עם סט תכונות ספציפיות שיאפשרו לנו להציע בלב שלם חתימה על חוזה מפורש, ובו התחייבות לתעסוקה בחברתנו עם סיום הקורס. אין צורך בתארים אקדמיים מפני שרובם של תכני הלימודים האקדמיים כמו גם השיטה הפדגוגית המיושנת בלאו הכי לא מתאימים לעולם ה-AI הדינמי והמתפתח, ואת היתר אנו מקנים בעצמנו בשיטה חדשנית בהכשרה המזורזת."
    },
    {
      question: "יש התחייבות להשמה?",
      answer: "כן, חד וחלק. כלל המועמדים מסיימי הקורס בהצלחה (כ-96.7% לפי ממוצע המחזורים הקודמים), יתקבלו מיידית למשרות AI נחשקות בחברת CloserAI, או באחת מ-35 חברות ה-AI מהצומחות בישראל שפועלות עימנו בשיתוף פעולה. זו גם הסיבה שבסמסטר הרביעי של תכנית הלימודים ב-™PracticsAI, כלל הכיתות מתחלקות מחדש לפי מסלולים שונים שבהן יילמדו ארכיטקטורות ומתודולוגיות אלגוריתמיקה ייעודיות לפי תחום ההשמה שנקבע עבור כל מועמד. עם זאת, היעדרות של פחות מ-80% מהלימודים ללא אישור עלולה לסיים את המחוייבות שלנו לתעסוקה בתום הקורס - הלימודים הינם אינטנסיביים במיוחד וכל החמצה הינה משמעותית."
    },
    {
      question: "מי זכאי להגיש מועמדות?",
      answer: "כל בעל תואר אקדמי, או סטודנט בשנה ג' ומעלה יכול להרשם לבדיקת התאמה, <a href='#registration-form' class='text-white font-bold hover:text-white/80 hover:underline transition-colors' onclick='event.preventDefault(); document.getElementById(\"registration-form\").scrollIntoView({behavior:\"smooth\"});'>ממש כאן</a>. עם זאת, ההרשמה אינה מבטיחה קבלה למסלול. אנו מגייסים אנשים איכותיים ובעלי יכולות מנטאליות גבוהות – במטרה מוצהרת שאלו יאיישו את מגוון המשרות הזמינות אצלנו עם תום הלימודים. זו הסיבה שמתקיים תהליך אבחון מוקפד שבו אנו מסננים אך ורק מועמדים עם סט תכונות ספציפיות שיאפשרו לנו להציע בלב שלם חתימה על חוזה מפורש מראש, ובו התחייבות לתעסוקה בחברתנו עם תום הקורס. חשוב להדגיש כי ההתמקדות בתהליך הסינון הינה אך ורק ביכולות האישיות והמנטליות של המועמד ולא נדרש ידע מוקדם או תואר אקדמי מפני שאת אלו אנו מקנים בעצמנו בשיטה חדשנית במהלך ההכשרה המזורזת."
    },
    {
      question: "למה כדאי להצטרף אלינו?",
      answer: "אם וכאשר תתקבלו למסלול ההכשרה, הרי ש-™PracticsAI תהווה עבורכם הזדמנות יחידה מסוגה בעולם לדלג על לימוד שלשה תארים מפרכים, ולקפוץ היישר אל עולמות ה-AI העמוקים לאחר הכשרה אינטנסיבית של שנה בסה\"כ. מקצוע ה-AI הינו מורכב וסבוך, וזאת הסיבה לכך שאין אף תואר אקדמאי יחיד המאפשר לימודי בינה מלאכותית מקיפים. הקורסים ל\"תכנות עם AI\" וכדו', אותם מציעים מוסדות הלימוד מתחום ההייטק הישן הינם קורסים מיושנים שאבד עליהם הכלח עם תוספת תכנים שוליים, שלכל היותר יסייעו למהנדס התוכנה המצוי להישאר רלוונטי לעוד שנים ספורות."
    },
    {
      question: "למה עוד יש לחכות?",
      answer: "לכלום. <a href='#registration-form' class='text-white font-bold hover:text-white/80 hover:underline transition-colors' onclick='event.preventDefault(); document.getElementById(\"registration-form\").scrollIntoView({behavior:\"smooth\"});'>מגישים מועמדות</a> כאן ועכשיו. המתאימים יוכלו לזכות בכרטיס הכניסה היחיד מסוגו בעולם למקפצה בטוחה ישירות אל מקצוע העתיד."
    }
  ]
};

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { currentLang } = useLanguage();

  return (
    <section id="faq" className="py-16 bg-dark-darker" aria-labelledby="faq-title">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 
            id="faq-title" 
            className={`text-3xl font-bold mb-8 text-white/90 ${
              currentLang === "he" ? "text-right" : "text-left"
            }`}
          >
            {currentLang === "he" ? "שאלות נפוצות" : "Frequently Asked Questions"}
          </h2>
          {faqItems[currentLang].map((item, index) => (
            <FAQListItem
              key={index}
              item={item}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
