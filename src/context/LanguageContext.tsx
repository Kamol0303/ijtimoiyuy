import { createContext, useContext, useState, ReactNode, useCallback } from "react";

export type Lang = "uz" | "ru";

const translations: Record<string, Record<Lang, string>> = {
  // Dashboard
  "bosh_sahifa": { uz: "Bosh sahifa", ru: "Главная" },
  "xush_kelibsiz": { uz: "Xush kelibsiz", ru: "Добро пожаловать" },
  "samarqand_viloyati": { uz: "Samarqand shahar hokimligi", ru: "Хокимият города Самарканда" },
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

  // Login page
  "tizimga_kirish": { uz: "Tizimga kirish", ru: "Вход в систему" },
  "platformasi": { uz: "Samarqand shahar hokimligi platformasi", ru: "Платформа хокимията города Самарканда" },
  "login_parol": { uz: "Login/Parol", ru: "Логин/Пароль" },
  "telefon": { uz: "Telefon", ru: "Телефон" },
  "foydalanuvchi_nomi": { uz: "Foydalanuvchi nomi", ru: "Имя пользователя" },
  "parol": { uz: "Parol", ru: "Пароль" },
  "parolni_kiriting": { uz: "Parolni kiriting", ru: "Введите пароль" },
  "kirish": { uz: "Kirish", ru: "Войти" },
  "login_xato": { uz: "Login yoki parol noto'g'ri", ru: "Неверный логин или пароль" },
  "sinov_loginlar": { uz: "Sinov uchun loginlar:", ru: "Тестовые логины:" },
  "sms_kod_yuborish": { uz: "SMS kod yuborish", ru: "Отправить SMS код" },
  "telefon_raqam": { uz: "Telefon raqam", ru: "Номер телефона" },
  "sms_tasdiq": { uz: "Telefon raqamingizga tasdiqlash kodi yuboriladi", ru: "Код подтверждения будет отправлен на ваш номер" },
  "myid_kirish": { uz: "MyID orqali kirish", ru: "Вход через MyID" },
  "myid_qr": { uz: "MyID ilovasini ochib QR kodni skanerlang", ru: "Откройте приложение MyID и отсканируйте QR код" },
  "qr_kod": { uz: "QR Kod", ru: "QR Код" },
  "login_banner": { uz: "Adolatli taqsimot, shaffof nazorat va aqlli boshqaruv", ru: "Справедливое распределение, прозрачный контроль и умное управление" },

  // NazoratPaneli
  "malumotlar_nazorati": { uz: "Ma'lumotlar nazorati va AI kuzatuv", ru: "Контроль данных и ИИ мониторинг" },
  "tizim_holati_tavsif": { uz: "Tizim holati va sun'iy intellekt monitoring", ru: "Состояние системы и мониторинг ИИ" },
  "ai_tahlil_boshlash": { uz: "AI tahlil boshlash", ru: "Запустить анализ ИИ" },
  "ai_ogohlantirishlar": { uz: "AI ogohlantirishlar", ru: "Предупреждения ИИ" },
  "barchasini_oquldi": { uz: "Barchasini o'qildi", ru: "Отметить все как прочитанные" },
  "ai_ogohlantirish_yoq": { uz: "AI ogohlantirishlar yo'q", ru: "Нет предупреждений ИИ" },
  "yangi": { uz: "Yangi", ru: "Новое" },
  "bolim_statistikasi": { uz: "Bo'lim statistikasi", ru: "Статистика по отделам" },
  "bugun_malumot_yoq": { uz: "Bugun hali ma'lumot yo'q", ru: "Сегодня пока нет данных" },
  "bugungi_amallar": { uz: "Bugungi amallar", ru: "Сегодняшние действия" },
  "qoshildi": { uz: "Qo'shildi", ru: "Добавлено" },
  "tahrirlandi": { uz: "Tahrirlandi", ru: "Изменено" },
  "ochirildi_label": { uz: "O'chirildi", ru: "Удалено" },

  // AmallarTarixi
  "barcha_ozgarishlar": { uz: "Barcha o'zgarishlar va amallar qayd etilgan", ru: "Все изменения и действия зафиксированы" },
  "csv_yuklash": { uz: "CSV yuklash", ru: "Скачать CSV" },
  "qidirish_umumiy": { uz: "Qidirish...", ru: "Поиск..." },
  "barcha_bolimlar": { uz: "Barcha bo'limlar", ru: "Все отделы" },
  "bolim": { uz: "Bo'lim", ru: "Отдел" },
  "davr": { uz: "Davr", ru: "Период" },
  "bugun": { uz: "Bugun", ru: "Сегодня" },
  "haftalik": { uz: "Haftalik", ru: "Неделя" },
  "oylik": { uz: "Oylik", ru: "Месяц" },
  "jami_amallar": { uz: "Jami amallar", ru: "Всего действий" },
  "amallar_tarixi_bosh": { uz: "Hozircha amallar tarixi bo'sh", ru: "История действий пока пуста" },

  // YakunlanganIshlar
  "tiklash": { uz: "Tiklash", ru: "Восстановить" },
  "yakunlangan_topilmadi": { uz: "Yakunlangan ishlar topilmadi", ru: "Завершённые дела не найдены" },
  "bajarildi": { uz: "bajarildi", ru: "выполнено" },
  "qayta_tiklandi": { uz: "Qayta tiklandi", ru: "Восстановлено" },

  // Ariza dialog
  "ariza_qoshish": { uz: "Yangi ariza qo'shish", ru: "Добавить заявление" },
  "ariza_tahrirlash": { uz: "Arizani tahrirlash", ru: "Редактировать заявление" },
  "fuqaro_ismi": { uz: "Fuqaro ismi", ru: "Имя гражданина" },
  "ariza_turi": { uz: "Ariza turi", ru: "Тип заявления" },
  "tuman": { uz: "Tuman", ru: "Район" },
  "ariza_izoh": { uz: "Izoh yozing...", ru: "Напишите примечание..." },
  "uy_olish": { uz: "Uy olish uchun ariza", ru: "Заявление на жильё" },
  "ijara_uzaytirish": { uz: "Ijara uzaytirish", ru: "Продление аренды" },
  "murojaat_yuborish": { uz: "Murojaat yuborish", ru: "Отправить обращение" },
  "tamir_talabi": { uz: "Ta'mirlash talabi", ru: "Запрос на ремонт" },
  "qoshish": { uz: "Qo'shish", ru: "Добавить" },

  // Statistics chart
  "statistika_grafik": { uz: "Arizalar statistikasi (grafik)", ru: "Статистика заявлений (график)" },
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
