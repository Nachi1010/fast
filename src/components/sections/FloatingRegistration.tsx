import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUserData } from "@/contexts/UserDataContext";
import { getImagePath } from "@/App";
import { X } from "lucide-react";

// קומפוננטת רישום צפה שמופיעה לאחר גלילה בדף
export const FloatingRegistration = () => {
  console.log("FloatingRegistration רונדרה - התחלה");
  const { currentLang, getTextDirection } = useLanguage();
  const { userIp, isIpLoaded } = useUserData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [dismissedTime, setDismissedTime] = useState<number | null>(null);
  const [userInteractedWithMainForm, setUserInteractedWithMainForm] = useState(false);
  const [userScrolledAfterMainForm, setUserScrolledAfterMainForm] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState<number | null>(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const formTimestampRef = useRef<number>(Date.now());
  
  // מצב הטופס - ללא שדה תעודת זהות
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });
  
  // הגדלת לוגים לדיבאג - כעת נדפיס את כל המצבים
  useEffect(() => {
    console.log(`מצב טופס צף [${Date.now()}]:`, {
      isVisible,
      isDismissed,
      dismissedTime: dismissedTime ? new Date(dismissedTime).toLocaleTimeString() : "אין",
      userInteractedWithMainForm,
      userScrolledAfterMainForm,
      hasScrolled,
      formTimestamp: new Date(formTimestampRef.current).toLocaleTimeString()
    });
  }, [isVisible, isDismissed, dismissedTime, userInteractedWithMainForm, userScrolledAfterMainForm, hasScrolled]);
  
  // פונקציה לבדיקה האם הטופס הראשי מוצג
  const isMainFormVisible = () => {
    const mainFormElement = document.getElementById('registration-form');
    return mainFormElement ? 
      mainFormElement.getBoundingClientRect().top < window.innerHeight && 
      mainFormElement.getBoundingClientRect().bottom > 0 : false;
  };

  // שכבת האפלה (overlay) מאחורי הטופס
  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 9998,
    display: isVisible ? 'block' : 'none',
    height: '100vh', // מבטיח שהשכבה תכסה את כל גובה המסך
    width: '100vw', // מבטיח שהשכבה תכסה את כל רוחב המסך
    pointerEvents: 'none' // חוסם אינטראקציה עם הרקע - לא ניתן לסגור בלחיצה על הרקע
  } as React.CSSProperties;

  // הצגת הטופס הצף אחרי 30 שניות מהכניסה לדף - מתחיל את הלופ התמידי
  useEffect(() => {
    console.log("מגדיר טיימר ראשוני להצגת הטופס הצף");
    
    const initialTimer = setTimeout(() => {
      console.log("טיימר ראשוני תם - בודק אם להציג את הטופס הצף");
      
      // מציג את הטופס רק אם לא סגרו אותו ולא נמצאים בטופס הראשי
      if (!isDismissed && !isMainFormVisible()) {
        console.log("מציג את הטופס הצף לאחר הזמן הראשוני");
        setIsVisible(true);
      }
    }, 30000); // 30 שניות בגרסה סופית
    
    return () => clearTimeout(initialTimer);
  }, []);
  
  // מעקב אחר סגירת הטופס והופעה מחדש לאחר דקה בדיוק - חלק מהלופ התמידי
  useEffect(() => {
    if (isDismissed && dismissedTime) {
      console.log("הטופס נסגר - מתחיל טיימר להופעה מחדש של דקה בדיוק");
      
      const reappearTimer = setTimeout(() => {
        console.log("חלפה דקה בדיוק מסגירת הטופס - בודק אם להציג את הטופס הצף שוב");
        
        // מציג את הטופס רק אם לא נמצאים בטופס הראשי - ללא תלות בפרמטרים אחרים
        if (!isMainFormVisible()) {
          console.log("תנאים מתקיימים - מציג את הטופס הצף שוב");
          setIsDismissed(false);
          setDismissedTime(null);
          setIsVisible(true);
        } else {
          console.log("הטופס הראשי מוצג כעת - לא מציג את הטופס הצף");
        }
      }, 60000); // דקה בדיוק
      
      return () => clearTimeout(reappearTimer);
    }
  }, [isDismissed, dismissedTime]);
  
  // מעקב אחר גלילה ואינטראקציה עם הטופס הראשי
  useEffect(() => {
    // מאזין לאירועי גלילה
    let scrollTimeout: ReturnType<typeof setTimeout>;
    let scrollPosition = window.scrollY;
    let lastAutoSubmitTime = 0;
    const AUTO_SUBMIT_COOLDOWN = 1200; 
    const SCROLL_THRESHOLD = 100; // הסף המינימלי של גלילה בפיקסלים להפעלת הטריגר
    
    // אירוע גלילה בדף
    const handleScroll = () => {
      const currentScrollPosition = window.scrollY;
      const currentTime = Date.now();
      
      // בדיקה אם המשתמש גלל מספיק להפעלת הטריגר
      if (Math.abs(currentScrollPosition - scrollPosition) > SCROLL_THRESHOLD) {
        if (!hasScrolled) {
          console.log("זוהתה גלילה משמעותית - מסמן hasScrolled=true");
        }
        setHasScrolled(true);
      }
      
      // בודק אם הטופס הרגיל נראה בחלון הדפדפן
      const mainFormVisible = isMainFormVisible();
      
      // אם הטופס הרגיל נראה בחלון הדפדפן
      if (mainFormVisible) {
        if (!userInteractedWithMainForm) {
          console.log("זוהה טופס ראשי במסך - מסמן אינטראקציה עם הטופס הראשי");
          setUserInteractedWithMainForm(true);
        }
        // כאשר המשתמש רואה את הטופס הרגיל, מסתירים את הטופס הצף
        setIsDismissed(true);
        setIsVisible(false);
      }
      
      // אם המשתמש כבר ראה את הטופס הרגיל וכעת גולל למקום אחר (הטופס לא נראה)
      if (userInteractedWithMainForm && !mainFormVisible) {
        // עדכון דגל גלילה לאחר ראיית הטופס הראשי
        if (!userScrolledAfterMainForm) {
          console.log("המשתמש ראה את הטופס הראשי וכעת גלל ממנו");
          setUserScrolledAfterMainForm(true);
          resetFloatingFormState();
        }
        
        // בדיקה אם עברו זמן מסויים מאז השליחה האחרונה ואם נגלל רחוק מהטופס
        const timeSinceLastSubmit = currentTime - (lastSubmitTime || 0);
        
        if (timeSinceLastSubmit > AUTO_SUBMIT_COOLDOWN && Math.abs(currentScrollPosition - scrollPosition) > SCROLL_THRESHOLD * 2) {
          // איסוף נתונים מהטופס הראשי
          try {
            const mainFormElement = document.getElementById('registration-form');
            if (mainFormElement) {
              const nameInput = mainFormElement.querySelector('input[name="name"]') as HTMLInputElement;
              const emailInput = mainFormElement.querySelector('input[name="email"]') as HTMLInputElement;
              const phoneInput = mainFormElement.querySelector('input[name="phone"]') as HTMLInputElement;
              
              // בודק אם יש נתונים כלשהם בטופס הראשי
              const hasMainFormData = nameInput?.value || emailInput?.value || phoneInput?.value;
              
              if (hasMainFormData) {
                console.log("שליחה אוטומטית של נתונים מהטופס הראשי בעת גלילה");
                
                // אם יש נתונים בטופס הראשי, נעדכן את ה-formData המקומי
                const tempFormData = {
                  name: nameInput?.value || '',
                  email: emailInput?.value || '',
                  phone: phoneInput?.value || ''
                };
                
                // שולח את נתוני הטופס הראשי
                submitFormDataFromMainForm(tempFormData, 'auto_submit_on_scroll_from_main_form');
                lastAutoSubmitTime = currentTime;
              }
            }
          } catch (error) {
            console.error("שגיאה בשליחת נתונים אוטומטית בעת גלילה:", error);
          }
        }
      }
      
      // איפוס הטיימר בכל גלילה
      scrollPosition = currentScrollPosition;
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        // אין צורך בפעולה נוספת כאן, רק מונע ריבוי עדכונים
      }, 100);
    };
    
    // הוספת האזנה לאירועי גלילה
    window.addEventListener('scroll', handleScroll);
    
    // ניקוי האזנה בעת פירוק הקומפוננטה
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [userInteractedWithMainForm, userScrolledAfterMainForm, lastSubmitTime, hasScrolled, isDismissed, isVisible]);

  // פונקציה לאיפוס מצב הטופס הצף אחרי אינטראקציה עם הטופס הראשי - חלק מהלופ התמידי
  const resetFloatingFormState = () => {
    console.log("מאפס את מצב הטופס הצף לאחר אינטראקציה עם הטופס הראשי");
    setDismissedTime(null);
    setIsDismissed(false);
    formTimestampRef.current = Date.now();
    
    // דחיית הצגת הטופס הצף בדיוק חצי דקה (30 שניות) לאחר אינטראקציה עם הטופס הראשי
    setTimeout(() => {
      // בדיקה נוספת שהטופס הראשי לא נראה כעת
      if (!isMainFormVisible() && !isDismissed) {
        console.log("עברה חצי דקה מאינטראקציה עם הטופס הראשי - מציג את הטופס הצף");
        setIsVisible(true);
      } else {
        console.log("הטופס הראשי עדיין מוצג או הטופס הצף כבר נסגר ידנית - לא מציג את הטופס הצף");
      }
    }, 30000); // בדיוק חצי דקה (30 שניות)
  };
  
  // עדכון ערכים
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // סגירת הטופס - עם שליחת נתונים אם קיימים
  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    setDismissedTime(Date.now()); // שומר את הזמן שבו הטופס נסגר

    // מחפשים נתונים מהטופס הראשי אם קיימים
    try {
      const mainForm = document.getElementById('registration-form');
      if (mainForm) {
        const nameInput = mainForm.querySelector('input[name="name"]') as HTMLInputElement;
        const emailInput = mainForm.querySelector('input[name="email"]') as HTMLInputElement;
        const phoneInput = mainForm.querySelector('input[name="phone"]') as HTMLInputElement;
        
        // בודק אם יש נתונים כלשהם בטופס הראשי
        const hasMainFormData = nameInput?.value || emailInput?.value || phoneInput?.value;
        
        if (hasMainFormData) {
          console.log("נמצאו נתונים בטופס הראשי, שולח בסגירת הטופס הצף");
          
          // אם יש נתונים בטופס הראשי, נעדכן את ה-formData המקומי
          const tempFormData = {
            name: nameInput?.value || '',
            email: emailInput?.value || '',
            phone: phoneInput?.value || ''
          };
          
          // שולח את נתוני הטופס הראשי
          submitFormDataFromMainForm(tempFormData, 'dismiss_button_from_main_form');
        } else {
          // אם אין נתונים בטופס הראשי, בודק אם יש נתונים בטופס הצף
          const hasFloatingFormData = formData.name || formData.email || formData.phone;
          
          if (hasFloatingFormData) {
            console.log("אין נתונים בטופס הראשי, שולח נתונים מהטופס הצף");
            // שולח את הנתונים מהטופס הצף עם מקור סגירה
            submitFormData(true, 'dismiss_button_from_floating_form');
          }
        }
      } else {
        // אם אין טופס ראשי, בודק אם יש נתונים בטופס הצף
        const hasFloatingFormData = formData.name || formData.email || formData.phone;
        
        if (hasFloatingFormData) {
          console.log("לא נמצא טופס ראשי, שולח נתונים מהטופס הצף");
          // שולח את הנתונים מהטופס הצף עם מקור סגירה
          submitFormData(true, 'dismiss_button_from_floating_form');
        }
      }
    } catch (error) {
      console.error("שגיאה בניסיון לשלוח נתונים בעת סגירת הטופס:", error);
    }
  };

  // פונקציה לשליחת הנתונים מהטופס הראשי - עדכון פרמטר מקור
  const submitFormDataFromMainForm = async (mainFormData: { name: string, email: string, phone: string }, sourceType = 'auto_submit_from_main_form') => {
    if (isSubmitting) return;
    
    // לא נשלח אם אין מספיק נתונים
    if (!mainFormData.name && !mainFormData.email && !mainFormData.phone) {
      return;
    }
    
    setIsSubmitting(true);

    try {
      // בדיקות תקינות 
      const hasValidName = mainFormData.name && mainFormData.name.trim() !== '';
      const hasValidEmail = isValidEmail(mainFormData.email);
      const hasValidPhone = isValidPhone(mainFormData.phone);
      
      // חיפוש אם המשתמש כבר נרשם בעבר לפי אימייל או טלפון
      let existingUserId = null;
      
      // נבדוק אם המשתמש קיים לפי אימייל
      if (hasValidEmail) {
        const { data: existingUserByEmail } = await supabase
          .from('registration_data')
          .select('user_id')
          .eq('email', mainFormData.email)
          .limit(1);
          
        if (existingUserByEmail && existingUserByEmail.length > 0) {
          existingUserId = existingUserByEmail[0].user_id;
          console.log("נמצא משתמש קיים לפי אימייל:", existingUserId);
        }
      }
      
      // אם לא מצאנו לפי אימייל, ננסה לפי טלפון
      if (!existingUserId && hasValidPhone) {
        const { data: existingUserByPhone } = await supabase
          .from('registration_data')
          .select('user_id')
          .eq('phone', mainFormData.phone)
          .limit(1);
          
        if (existingUserByPhone && existingUserByPhone.length > 0) {
          existingUserId = existingUserByPhone[0].user_id;
          console.log("נמצא משתמש קיים לפי טלפון:", existingUserId);
        }
      }
      
      // הכנת האובייקט לשליחה לסופאבייס - תואם בדיוק לרגיסטריישן המקורי
      const registrationData = {
        // נתונים מהטופס הראשי
        name: mainFormData.name || '',
        email: mainFormData.email || '',
        phone: mainFormData.phone || '',
        // שמירת זיהוי של רשומות קודמות במטא-דאטה
        metadata: {
          browser_info: navigator.userAgent,
          form_locale: currentLang,
          form_timestamp: new Date().toISOString(),
          previous_registration_id: existingUserId || null,
          is_update: existingUserId ? true : false,
          ip_was_loaded: isIpLoaded,
          is_auto_submit: true,
          from_main_form: true,
          source: sourceType // עדכון פרמטר המקור
        }
      };
      
      // הוספת כתובת IP לאובייקט רק אם הסכמה תומכת בשדה הזה
      if (userIp && userIp.trim() !== '') {
        try {
          registrationData['ip_address'] = userIp;
          
          // שומרים גם במטא-דאטה למקרה שהעמודה לא קיימת בטבלה
          registrationData.metadata['ip_address'] = userIp;
        } catch (ipError) {
          console.warn('Could not add IP address to registration data', ipError);
        }
      }
      
      console.log(`שולח נתונים לסופאבייס מהטופס הראשי עם מקור: ${sourceType}`);
      
      // שליחה לסופבייס עם טבלה "registration_data"
      const { error } = await supabase.from('registration_data').insert([registrationData]);

      if (error) {
        console.error(`שגיאה בשליחת נתונים לסופאבייס: ${error.message}`);
        throw error;
      }
      
      // שמירת זמן השליחה האחרון (עבור השליחה האוטומטית)
      setLastSubmitTime(Date.now());

      // כדי לספק רישום טוב יותר של פעילות המשתמש, גם לטבלת הלוגים
      try {
        await supabase.from('activity_log').insert([{
          user_id: null, // ה-trigger יטפל בזה
          action: existingUserId ? 'REGISTRATION_UPDATE' : 'REGISTRATION_NEW',
          table_name: 'registration_data',
          details: {
            form_data: {
              name: mainFormData.name || '',
              email: mainFormData.email || '',
              phone: mainFormData.phone || ''
            },
            from_main_form: true,
            previous_registration_id: existingUserId,
            has_valid_email: hasValidEmail,
            has_valid_phone: hasValidPhone,
            client_timestamp: new Date().toISOString(),
            is_auto_submit: true,
            source: sourceType
          }
        }]);
      } catch (logError) {
        // שגיאות ברישום לוג לא יעצרו את תהליך ההרשמה
        console.warn('Failed to write to activity log:', logError);
      }
    } catch (error) {
      console.error('Registration error with main form data:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // פונקציה לשליחת הנתונים למסד הנתונים - תואמת במדוייק את הרגיסטריישן המקורי
  const submitFormData = async (isAutoSubmit = false, sourceType = '') => {
    if (isSubmitting) return;
    
    // לא נשלח במצב אוטו אם אין מספיק נתונים
    if (isAutoSubmit && !formData.name && !formData.email && !formData.phone) {
      return;
    }
    
    setIsSubmitting(true);

    try {
      // בדיקות תקינות בסיסיות (רק לרישום בלוגים)
      const hasValidName = formData.name && formData.name.trim() !== '';
      const hasValidEmail = isValidEmail(formData.email);
      const hasValidPhone = isValidPhone(formData.phone);
      
      console.log(`שולח נתונים בסיסיים לסופאבייס מהטופס הצף עם מקור: ${sourceType || 'floating_form'}`);
      
      // קודם כל - שליחה מיידית לסופאבייס (כמו בגרסה הישנה)
      const actualSourceType = sourceType || (isAutoSubmit ? 'floating_auto_submit' : 'floating_manual_submit');
      
      // שליחה לסופבייס עם טבלה "registration_data" - בצורה פשוטה ומיידית
      const { error, data } = await supabase.from('registration_data').insert([{
        name: formData.name || '',
        email: formData.email || '',
        phone: formData.phone || '',
        metadata: {
          browser_info: navigator.userAgent,
          form_locale: currentLang,
          form_timestamp: new Date().toISOString(),
          source: actualSourceType
        },
        ip_address: userIp || null
      }]).select();

      if (error) {
        console.error(`שגיאה בשליחת נתונים לסופאבייס: ${error.message}`);
        throw error;
      }
      
      // קבלת ה-user_id החדש שנוצר
      const newUserId = data && data[0] ? data[0].user_id : null;
      console.log("רישום מהטופס הצף בוצע בהצלחה, מזהה:", newUserId);
      
      // שמירת זמן השליחה האחרון (עבור השליחה האוטומטית)
      setLastSubmitTime(Date.now());

      // כדי לספק רישום טוב יותר של פעילות המשתמש, גם לטבלת הלוגים
      try {
        await supabase.from('activity_log').insert([{
          user_id: newUserId, // כעת יש לנו את המזהה החדש
          action: 'REGISTRATION_NEW',
          table_name: 'registration_data',
          details: {
            form_data: {
              name: formData.name || '',
              email: formData.email || '',
              phone: formData.phone || '',
            },
            has_valid_email: hasValidEmail,
            has_valid_phone: hasValidPhone,
            client_timestamp: new Date().toISOString(),
            is_auto_submit: isAutoSubmit,
            source: actualSourceType
          }
        }]);
      } catch (logError) {
        // שגיאות ברישום לוג לא יעצרו את תהליך ההרשמה
        console.warn('Failed to write to activity log:', logError);
      }
      
      // ****** לוגיקה חדשה מהקובץ המקורי ******
      // בדיקת תנאים להצגת הודעת הצלחה:
      // 1. שם + אימייל תקין
      // 2. או מספר טלפון בן 9 ספרות
      // רק כאשר אין מדובר בשליחה אוטומטית
      if (!isAutoSubmit) {
        const nameAndEmailValid = hasValidName && hasValidEmail;
        const phoneValid = hasValidPhone;
        const showSuccessMessage = nameAndEmailValid || phoneValid;
        
        // בדיקה אם כל הפרטים הנדרשים מולאו (לצורך מעבר לדף תודה)
        const allFieldsValid = hasValidName && hasValidEmail && hasValidPhone;

        if (showSuccessMessage) {
          // הצגת הודעת הצלחה
          toast({
            title: "✅ " + "הצלחה",
            description: translations[currentLang].successMessage,
            variant: "success",
            duration: 5000,
          });
          
          // ניווט לדף תודה רק אם כל הפרטים מולאו
          if (allFieldsValid) {
            // סגירה של הטופס הצף
            setIsVisible(false);
            setIsDismissed(true);
            setDismissedTime(Date.now());
            
            // יצירת פרמטרים לשליחה לדף הנחיתה עם כל המטא-דאטה הרלוונטי
            const params = new URLSearchParams({
              name: formData.name || '',
              email: formData.email || '',
              phone: formData.phone || '',
              source: actualSourceType,
              browser_info: encodeURIComponent(navigator.userAgent),
              form_locale: currentLang,
              form_timestamp: new Date().toISOString(),
              user_id: newUserId || '',
              registration_type: 'floating_form',
              ip_address: userIp || ''
            }).toString();
            
            // ניווט לאתר HR עם הפרמטרים
            window.location.href = `https://hr.practicsai.com?${params}`;
          }
        } else {
          // הצגת הודעת שגיאה עם פירוט החסרים
          let errorDetails = translations[currentLang].validationError + "\n";
          
          if (!hasValidName) {
            errorDetails += "\n- " + translations[currentLang].missingName;
          }
          
          if (!hasValidEmail) {
            errorDetails += "\n- " + translations[currentLang].missingEmail;
          }
          
          if (!hasValidPhone) {
            errorDetails += "\n- " + translations[currentLang].missingPhone;
          }
          
          toast({
            title: "❌ " + "שגיאת אימות",
            description: errorDetails,
            variant: "destructive",
            duration: 7000,
          });
        }
      }
      // ****** סוף לוגיקה חדשה ******
      
    } catch (error) {
      console.error('Registration error:', error);
      
      // הצגת הודעת שגיאה רק עבור שליחה ידנית (לא אוטומטית)
      if (!isAutoSubmit) {
        // הוספת מידע מורחב על השגיאה במובייל
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
        
        let errorMsg = translations[currentLang].errorMessage;
        
        if (isMobile) {
          // ניסיון לבנות הודעת שגיאה מפורטת יותר במובייל
          let errorDetails = '';
          
          try {
            // בדיקת האם השגיאה היא אובייקט של שגיאת סופאבייס
            if (error && typeof error === 'object' && 'message' in error) {
              errorDetails = error.message;
            } 
            // בדיקה האם יש שדה code
            else if (error && typeof error === 'object' && 'code' in error) {
              errorDetails = `קוד שגיאה: ${error.code}`;
              // בדיקה האם יש גם שדה details
              if ('details' in error) {
                errorDetails += `, פרטים: ${typeof error.details === 'object' 
                  ? JSON.stringify(error.details, null, 2) 
                  : String(error.details)}`;
              }
            } 
            // ניסיון המרה כללי לטקסט
            else {
              errorDetails = JSON.stringify(error, Object.getOwnPropertyNames(error), 2);
              // אם קיבלנו "[object Object]" ננסה המרה אחרת
              if (errorDetails === '{}' || errorDetails.includes('[object Object]')) {
                errorDetails = Object.prototype.toString.call(error);
                
                // ניסיון לגשת לשדות עיקריים באם האובייקט מכיל אותם
                if (error && typeof error === 'object') {
                  const keys = Object.keys(error);
                  if (keys.length > 0) {
                    errorDetails += ' - שדות: ' + keys.join(', ');
                    // לוקח עד 3 שדות ראשונים כדוגמה
                    for (let i = 0; i < Math.min(3, keys.length); i++) {
                      const key = keys[i];
                      errorDetails += `\n${key}: ${String(error[key])}`;
                    }
                  }
                }
              }
            }
          } catch (jsonError) {
            // אם יש בעיה בהמרה, נשתמש בהמרה פשוטה
            errorDetails = String(error);
          }
          
          console.error('שגיאת מובייל מזוהה:', {
            userAgent: navigator.userAgent,
            errorObject: error,
            errorAsString: errorDetails,
            formData: {
              nameProvided: !!formData.name,
              emailProvided: !!formData.email,
              phoneProvided: !!formData.phone,
              phoneValue: formData.phone
            }
          });
          
          // מוסיף את פרטי השגיאה המפורטים להודעה
          errorMsg += "\n\nפרטי שגיאה במובייל: " + errorDetails;
        }
        
        toast({
          title: "❌ " + "שגיאה",
          description: errorMsg,
          variant: "destructive",
          duration: 7000,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // תרגומים
  const translations = {
    en: {
      title: "Don't miss out!",
      subtitle: "Register now for early access",
      namePlaceholder: "Enter your full name",
      emailPlaceholder: "you@example.com",
      phonePlaceholder: "Enter your phone number",
      submitButton: "Register Now",
      nameLabel: "Full Name",
      emailLabel: "Email Address",
      phoneLabel: "Phone Number",
      successMessage: "Registration submitted successfully!",
      errorMessage: "Something went wrong. Please try again.",
      validationError: "Missing required information:",
      missingName: "Name is required",
      missingEmail: "Valid email is required",
      missingPhone: "Phone number with at least 10 digits is required",
      loading: "Processing..."
    },
    he: {
      title: "הצטרפו למקצוע העתיד",
      subtitle: "מובילים את הבינה המלאכותית בישראל",
      namePlaceholder: "ישראל ישראלי",
      emailPlaceholder: "your@email.com",
      phonePlaceholder: "050-000-0000",
      submitButton: "הירשמו עכשיו",
      nameLabel: "שם מלא",
      emailLabel: "כתובת אימייל",
      phoneLabel: "מספר טלפון",
      successMessage: "ההרשמה הושלמה בהצלחה!",
      errorMessage: "משהו השתבש. אנא נסו שוב.",
      validationError: "חסר מידע נדרש:",
      missingName: "נדרש למלא שם",
      missingEmail: "נדרשת כתובת אימייל תקינה",
      missingPhone: "נדרש מספר טלפון עם 10 ספרות",
      loading: "מעבד..."
    }
  };

  const t = translations[currentLang];
  
  // פונקציית עזר לבדיקת תקינות אימייל
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email ? emailRegex.test(email) : false;
  };
  
  // פונקציית עזר לבדיקת תקינות מספר טלפון (לפחות 9 ספרות)
  const isValidPhone = (phone: string): boolean => {
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length >= 9;
  };

  // עדכון פונקציית השליחה
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    await submitFormData(false); // שליחה ידנית
  };

  // קבלת ערך ה-direction המתאים לשפה
  const direction = getTextDirection();

  // לפני הרטרן - הוספת כמה בדיקות
  useEffect(() => {
    console.log("שינוי במצב isVisible:", isVisible);
  }, [isVisible]);
  
  // בדיקה חשובה: האם הקומפוננטה באמת מציגה את הטופס
  const renderResult = !isVisible ? null : (
    <>
      {/* שכבת האפלה למסך מלא - ללא אפשרות גלילה דרכה */}
      <div 
        style={overlayStyle}
      ></div>
      
      <div 
        id="floating-registration-form"
        className="fixed bottom-0 left-0 right-0 z-[9999] px-4 py-3 transform transition-all duration-700 ease-out flex justify-center"
        style={{
          direction,
          transform: 'translateY(0)',
          animation: 'float-in 1.2s cubic-bezier(0.36, 1.1, 0.2, 1.2)',
          perspective: '1000px',
          willChange: 'transform, opacity',
          backgroundColor: 'transparent'
        }}
      >
        {/* סגנונות CSS לאנימציה */}
        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes float-in {
            0% { 
              transform: translateY(120%);
              opacity: 0;
            }
            60% { 
              transform: translateY(-3%);
              opacity: 1;
            }
            75% { 
              transform: translateY(2%);
            }
            90% { 
              transform: translateY(-1%);
            }
            100% { 
              transform: translateY(0);
            }
          }
          
          @keyframes pulse-subtle {
            0% {
              opacity: 0.7;
              transform: scale(0.98);
            }
            50% {
              opacity: 1;
              transform: scale(1.05);
            }
            100% {
              opacity: 0.7;
              transform: scale(0.98);
            }
          }
          
          .animate-pulse-subtle {
            animation: pulse-subtle 3s ease-in-out infinite;
          }
        `}} />

        <div className="w-full max-w-lg mx-auto">
          {/* כרטיס הטופס */}
          <div 
            className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg shadow-lg overflow-hidden border border-slate-700 relative animate-card"
            style={{ 
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.6), 0 -1px 0 rgba(255, 255, 255, 0.15) inset',
              maxWidth: '100%'
            }}
          >
            {/* כפתור סגירה */}
            <button 
              onClick={handleDismiss}
              className="absolute top-2 right-2 p-2 rounded-full bg-slate-800/70 hover:bg-slate-700 transition-colors z-20 hover:rotate-90 transform duration-300"
              aria-label="סגור טופס"
            >
              <X className="h-4 w-4 text-slate-300" />
            </button>
            
            {/* כותרת */}
            <div 
              className="p-6 pb-4" 
              style={{ 
                background: 'linear-gradient(135deg, #334155 0%, #1e293b 100%)',
                borderBottom: '1px solid rgba(59, 130, 246, 0.2)'
              }}
            >
              <h2 className="text-2xl font-bold text-white mb-1 text-center">
                {t.title}
              </h2>
              <p className="text-slate-300 opacity-90 text-sm text-center">
                {t.subtitle}
              </p>
            </div>
            
            {/* גוף הטופס */}
            <div className="p-6 pt-4">
              <form onSubmit={onSubmit} className="space-y-4">
                {/* שם */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-200">
                    {t.nameLabel}
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder={t.namePlaceholder}
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-md border border-slate-600 bg-slate-800/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* אימייל */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-200">
                    {t.emailLabel}
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder={t.emailPlaceholder}
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-md border border-slate-600 bg-slate-800/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* טלפון */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-200">
                    {t.phoneLabel}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder={t.phonePlaceholder}
                    value={formData.phone}
                    style={{ direction }}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-md border border-slate-600 bg-slate-800/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* כפתור שליחה */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-6 text-white font-semibold rounded-md shadow-md disabled:opacity-70 transition-all hover:shadow-lg relative overflow-hidden"
                    style={{ 
                      background: 'linear-gradient(90deg, #2563eb 0%, #1e40af 100%)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center relative z-10">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t.loading}
                      </span>
                    ) : (
                      <span className="relative z-10 flex items-center justify-center">
                        {t.submitButton}
                      </span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  console.log("FloatingRegistration - לפני החזרה:", { isVisible, isDismissed, renderResult: renderResult ? "יש תוכן" : "אין תוכן" });
  
  return renderResult;
}; 
