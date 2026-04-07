import { createContext, useContext, useState, ReactNode, useCallback } from "react";

export type Lang = "uz" | "ru";

const translations: Record<string, Record<Lang, string>> = {
  // Dashboard
  "bosh_sahifa": { uz: "Bosh sahifa", ru: "Главная" },
  "xush_kelibsiz": { uz: "Xush kelibsiz", ru: "Добро пожаловать" },
  "samarqand_viloyati": { uz: "Samarqand viloyati", ru: "Самаркандская область" },
  "umumiy_uylar": { uz: "Umumiy uylar", ru: "Всего домов" },
  "band_uylar": { uz: "Band uylar", ru: "Занятые дома" },
  "bosh_uylar": { uz: "Bo'sh uylar", ru: "Свободные дома" },
  "muddat_yaqin": { uz: "Muddat yaqin", ru: "Срок истекает" },
  "ijtimoiy_oilalar": { uz: "Ijtimoiy oilalar", ru: "Социальные семьи" },
  "arizalar": { uz: "Arizalar", ru: "Заявления" },
  "ai_tavsiyalar": { uz: "AI tavsiyalar", ru: "Рекомендации ИИ" },
  "songgi_arizalar": { uz: "So'nggi arizalar", ru: "Последние заявления" },
  "barqaror_holat": { uz: "Barqaror holat", ru: "Стабильное состояние" },
  "taqsimot_kutilmoqda": { uz: "Taqsimot kutilmoqda", ru: "Ожидается распределение" },
  "diqqat_talab_etadi": { uz: "Diqqat talab etadi", ru: "Требует внимания" },
  "bugun_yangilandi": { uz: "Bugun yangilandi", ru: "Обновлено сегодня" },
  "ta_korib_chiqilmoqda": { uz: "ta ko'rib chiqilmoqda", ru: "на рассмотрении" },
  "tasdiqlandi": { uz: "Tasdiqlandi", ru: "Одобрено" },
  "rad_etildi": { uz: "Rad etildi", ru: "Отказано" },
  "korilmoqda": { uz: "Ko'rilmoqda", ru: "Рассматривается" },
  
  // Navigation
  "uylar": { uz: "Uylar", ru: "Дома" },
  "fuqarolar": { uz: "Fuqarolar", ru: "Граждане" },
  "shartnomalar": { uz: "Shartnomalar", ru: "Договоры" },
  "monitoring": { uz: "Monitoring", ru: "Мониторинг" },
  "xarita": { uz: "Xarita", ru: "Карта" },
  "yer_uchastkalari": { uz: "Yer uchastkalari", ru: "Земельные участки" },
  "navbat": { uz: "Navbat", ru: "Очередь" },
  "ai_tahlil": { uz: "AI tahlil", ru: "Анализ ИИ" },
  "hisobotlar": { uz: "Hisobotlar", ru: "Отчёты" },
  "xabarnomalar": { uz: "Xabarnomalar", ru: "Уведомления" },
  "sozlamalar": { uz: "Sozlamalar", ru: "Настройки" },
  "amallar_tarixi": { uz: "Amallar tarixi", ru: "История действий" },
  "nazorat_paneli": { uz: "Nazorat paneli", ru: "Панель контроля" },
  "yakunlangan_ishlar": { uz: "Yakunlangan ishlar", ru: "Завершённые дела" },
  "chiqish": { uz: "Chiqish", ru: "Выход" },
  "asosiy": { uz: "Asosiy", ru: "Основное" },
  
  // Uylar page
  "uylar_boshqaruvi": { uz: "Uylar boshqaruvi", ru: "Управление домами" },
  "jiloy_va_nejiloy": { uz: "Samarqand viloyati — turar joy va noturar joy obyektlarni boshqaring", ru: "Самаркандская область — управление жилыми и нежилыми объектами" },
  "yangi_uy": { uz: "Yangi uy", ru: "Новый дом" },
  "export": { uz: "Export", ru: "Экспорт" },
  "barchasi": { uz: "Barchasi", ru: "Все" },
  "jiloy": { uz: "Turar joy", ru: "Жилой" },
  "nejiloy": { uz: "Noturar joy", ru: "Нежилой" },
  "barcha_tumanlar": { uz: "Barcha tumanlar", ru: "Все районы" },
  "band": { uz: "Band", ru: "Занят" },
  "bosh": { uz: "Bo'sh", ru: "Свободен" },
  "xonalar": { uz: "Xonalar", ru: "Комнаты" },
  "maydon": { uz: "Maydon", ru: "Площадь" },
  "egasi": { uz: "Egasi", ru: "Владелец" },
  "muddat": { uz: "Muddat", ru: "Срок" },
  "qidirish": { uz: "Uy nomi yoki manzil bo'yicha qidirish...", ru: "Поиск по названию или адресу..." },
  
  // Fuqarolar page
  "fuqarolar_royxati": { uz: "Samarqand viloyati — ijtimoiy himoyaga muhtoj fuqarolar ro'yxati", ru: "Самаркандская область — список граждан, нуждающихся в социальной защите" },
  "yangi_fuqaro": { uz: "Yangi fuqaro", ru: "Новый гражданин" },
  "qidirish_fuqaro": { uz: "Ism yoki JShShIR bo'yicha qidiring...", ru: "Поиск по имени или ПИНФЛ..." },
  "ta_ariza": { uz: "ta ariza", ru: "заявлений" },
  
  // Arizalar page
  "barcha_arizalar": { uz: "Barcha arizalar va murojaatlar", ru: "Все заявления и обращения" },
  "yangi_ariza": { uz: "Yangi ariza", ru: "Новое заявление" },
  "qidirish_ariza": { uz: "Fuqaro ismi bo'yicha qidiring...", ru: "Поиск по имени гражданина..." },
  "fuqaro": { uz: "Fuqaro", ru: "Гражданин" },
  "turi": { uz: "Turi", ru: "Тип" },
  "sana": { uz: "Sana", ru: "Дата" },
  "holat": { uz: "Holat", ru: "Статус" },
  "izoh": { uz: "Izoh", ru: "Примечание" },
  
  // Common
  "malumotlar_yuklandi": { uz: "Ma'lumotlar yuklandi", ru: "Данные загружены" },
  "ochirildi": { uz: "o'chirildi", ru: "удалён" },
  "yakunlash": { uz: "Yakunlash", ru: "Завершить" },
  "yakunlandi": { uz: "Yakunlandi", ru: "Завершено" },
  "arxivlash": { uz: "Arxivlash", ru: "Архивировать" },
  "aktiv": { uz: "Aktiv", ru: "Активный" },
  "arxivlangan": { uz: "Arxivlangan", ru: "Архивирован" },
  "tizim_holati": { uz: "Tizim holati", ru: "Состояние системы" },
  "bugungi_ozgarishlar": { uz: "Bugungi o'zgarishlar", ru: "Изменения за сегодня" },
  "yangi_malumotlar": { uz: "Yangi ma'lumotlar", ru: "Новые данные" },
  "ai_muammolar": { uz: "AI aniqlagan muammolar", ru: "Проблемы обнаруженные ИИ" },
  "faol_foydalanuvchilar": { uz: "Faol foydalanuvchilar", ru: "Активные пользователи" },
  
  // Roles
  "hokim": { uz: "Hokim", ru: "Хоким" },
  "uy_joy_bolimi": { uz: "Uy-joy bo'limi", ru: "Жилищный отдел" },
  "ayollar_bolimi": { uz: "Ayollar bo'limi", ru: "Женский отдел" },

  // Sozlamalar
  "sozlamalar_tavsifi": { uz: "Samarqand viloyati — tizim sozlamalari va integratsiyalar", ru: "Самаркандская область — настройки системы и интеграции" },
  "integratsiyalar": { uz: "Integratsiyalar", ru: "Интеграции" },
  "rollar_va_foydalanuvchilar": { uz: "Rollar va foydalanuvchilar", ru: "Роли и пользователи" },
  "ulangan": { uz: "Ulangan", ru: "Подключено" },
  "sozlanmoqda": { uz: "Sozlanmoqda", ru: "Настраивается" },
  "faol": { uz: "Faol", ru: "Активный" },
  "ta": { uz: "ta", ru: "шт" },
  "barcha_statistikani_koradi": { uz: "Barcha statistikani ko'radi", ru: "Видит всю статистику" },
  "uylar_bilan_ishlaydi": { uz: "Uylar bilan ishlaydi", ru: "Работает с домами" },
  "ijtimoiy_oilalar_bilan": { uz: "Ijtimoiy oilalar bilan ishlaydi", ru: "Работает с социальными семьями" },

  // Rahbarlar
  "rahbarlar": { uz: "Rahbarlar", ru: "Руководители" },
  "rahbarlarni_boshqarish": { uz: "Rahbarlarni boshqarish", ru: "Управление руководителями" },
  "lavozim": { uz: "Lavozim", ru: "Должность" },
  "tahrirlash": { uz: "Tahrirlash", ru: "Редактировать" },
  "saqlash": { uz: "Saqlash", ru: "Сохранить" },
  "bekor_qilish": { uz: "Bekor qilish", ru: "Отмена" },
  "murojaatlar_statistikasi": { uz: "Murojaatlar statistikasi", ru: "Статистика обращений" },
  "jami_murojaatlar": { uz: "Jami murojaatlar", ru: "Всего обращений" },
  "hal_qilingan": { uz: "Hal qilingan", ru: "Решено" },
  "jarayonda": { uz: "Jarayonda", ru: "В процессе" },

  // Dashboard role-specific
  "uy_joy_dashboard": { uz: "Uy-joy bo'limi paneli", ru: "Панель жилищного отдела" },
  "ayollar_dashboard": { uz: "Ayollar bo'limi paneli", ru: "Панель женского отдела" },
  "sizning_uylaringiz": { uz: "Sizning uylaringiz", ru: "Ваши дома" },
  "sizning_arizalaringiz": { uz: "Sizning arizalaringiz", ru: "Ваши заявления" },
  "ijtimoiy_holat": { uz: "Ijtimoiy holat", ru: "Социальный статус" },
  "yordam_kerak": { uz: "Yordam kerak", ru: "Нужна помощь" },
  "himoyada": { uz: "Himoyada", ru: "Под защитой" },
};

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("uz");

  const t = useCallback((key: string): string => {
    return translations[key]?.[lang] || key;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
