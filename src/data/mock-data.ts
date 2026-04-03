export const SAMARQAND_TUMANLARI = [
  "Samarqand tumani",
  "Kattaqo'rg'on tumani",
  "Urgut tumani",
  "Pastdarg'om tumani",
  "Ishtixon tumani",
  "Payariq tumani",
  "Bulung'ur tumani",
  "Jomboy tumani",
  "Nurobod tumani",
  "Qo'shrabot tumani",
  "Oqdaryo tumani",
  "Toyloq tumani",
] as const;

export type SamarqandTuman = typeof SAMARQAND_TUMANLARI[number];

export interface Uy {
  id: string;
  nomi: string;
  tur: "jiloy" | "nejiloy";
  manzil: string;
  tuman: SamarqandTuman;
  egasi: string;
  status: "band" | "bosh" | "muddat_yaqin";
  shartnomaMuddat: string;
  xonalar: number;
  maydon: number;
}

export interface Fuqaro {
  id: string;
  ism: string;
  jshshir: string;
  telefon: string;
  ijtimoiyHolat: string;
  tuman: SamarqandTuman;
  uyId?: string;
  arizalarSoni: number;
}

export interface Ariza {
  id: string;
  fuqaroId: string;
  fuqaroIsm: string;
  tur: string;
  sana: string;
  status: "korib_chiqilmoqda" | "tasdiqlandi" | "rad_etildi";
  izoh: string;
  tuman: SamarqandTuman;
}

export interface AITavsiya {
  id: string;
  xabar: string;
  tur: "ogohlantirish" | "tavsiya" | "xavf";
  sana: string;
}

export const uylar: Uy[] = [
  { id: "1", nomi: "Yangi Hayot Turar Joy", tur: "jiloy", manzil: "Samarqand t., Registon ko'chasi, 12-uy", tuman: "Samarqand tumani", egasi: "Abdullayev Anvar", status: "band", shartnomaMuddat: "2026-12-01", xonalar: 3, maydon: 72 },
  { id: "2", nomi: "Mehribon Oila Uyi", tur: "jiloy", manzil: "Kattaqo'rg'on t., Mustaqillik ko'chasi, 5-uy", tuman: "Kattaqo'rg'on tumani", egasi: "Karimova Nilufar", status: "band", shartnomaMuddat: "2025-06-15", xonalar: 2, maydon: 54 },
  { id: "3", nomi: "Baraka Ipoteka", tur: "jiloy", manzil: "Urgut t., Markaziy ko'chasi, 8", tuman: "Urgut tumani", egasi: "Toshmatov Sardor", status: "muddat_yaqin", shartnomaMuddat: "2026-05-20", xonalar: 4, maydon: 95 },
  { id: "4", nomi: "Yoshlar Uyi", tur: "jiloy", manzil: "Pastdarg'om t., Navoiy ko'chasi, 3", tuman: "Pastdarg'om tumani", egasi: "", status: "bosh", shartnomaMuddat: "", xonalar: 2, maydon: 48 },
  { id: "5", nomi: "Ijtimoiy Himoya Blok-1", tur: "jiloy", manzil: "Ishtixon t., Bog'ishamol ko'chasi, 22-uy", tuman: "Ishtixon tumani", egasi: "Raximova Shaxlo", status: "band", shartnomaMuddat: "2027-03-10", xonalar: 3, maydon: 68 },
  { id: "6", nomi: "Navbahor Uy Majmuasi", tur: "jiloy", manzil: "Payariq t., Mustaqillik ko'chasi, 14", tuman: "Payariq tumani", egasi: "", status: "bosh", shartnomaMuddat: "", xonalar: 1, maydon: 36 },
  { id: "7", nomi: "Nurafshon Turar Joy", tur: "jiloy", manzil: "Bulung'ur t., Bog'ishamol ko'chasi, 7", tuman: "Bulung'ur tumani", egasi: "Xasanov Botir", status: "band", shartnomaMuddat: "2026-09-30", xonalar: 3, maydon: 78 },
  { id: "8", nomi: "Ayollar Qo'llab-quvvatlash Uyi", tur: "jiloy", manzil: "Jomboy t., Markaziy ko'chasi, 19-uy", tuman: "Jomboy tumani", egasi: "Nodirova Malika", status: "band", shartnomaMuddat: "2026-08-15", xonalar: 2, maydon: 52 },
  { id: "9", nomi: "Oila Baxti Blok-2", tur: "jiloy", manzil: "Nurobod t., Bobur ko'chasi, 11", tuman: "Nurobod tumani", egasi: "Mirzayev Jasur", status: "muddat_yaqin", shartnomaMuddat: "2026-04-30", xonalar: 3, maydon: 70 },
  { id: "10", nomi: "Saodat Uyi", tur: "jiloy", manzil: "Qo'shrabot t., Chorsu ko'chasi, 6", tuman: "Qo'shrabot tumani", egasi: "Ergasheva Dilnoza", status: "band", shartnomaMuddat: "2027-01-20", xonalar: 4, maydon: 88 },
  { id: "11", nomi: "Markaziy Do'kon", tur: "nejiloy", manzil: "Oqdaryo t., Amir Temur ko'chasi, 1", tuman: "Oqdaryo tumani", egasi: "Soliyev Mansur", status: "band", shartnomaMuddat: "2026-11-01", xonalar: 0, maydon: 120 },
  { id: "12", nomi: "Savdo Markazi Blok-A", tur: "nejiloy", manzil: "Toyloq t., Beruniy ko'chasi, 34", tuman: "Toyloq tumani", egasi: "", status: "bosh", shartnomaMuddat: "", xonalar: 0, maydon: 200 },
  { id: "13", nomi: "Xizmat Ko'rsatish Markazi", tur: "nejiloy", manzil: "Samarqand t., Ulug'bek ko'chasi, 9", tuman: "Samarqand tumani", egasi: "Hamidov Laziz", status: "band", shartnomaMuddat: "2026-07-15", xonalar: 0, maydon: 85 },
];

export const fuqarolar: Fuqaro[] = [
  { id: "1", ism: "Abdullayev Anvar Baxtiyorovich", jshshir: "31205890120045", telefon: "+998 90 123 45 67", ijtimoiyHolat: "Kam ta'minlangan oila", tuman: "Samarqand tumani", uyId: "1", arizalarSoni: 2 },
  { id: "2", ism: "Karimova Nilufar Toxirovna", jshshir: "42305670340012", telefon: "+998 91 234 56 78", ijtimoiyHolat: "Ko'p bolali oila", tuman: "Kattaqo'rg'on tumani", uyId: "2", arizalarSoni: 1 },
  { id: "3", ism: "Toshmatov Sardor Ulug'bekovich", jshshir: "30108900450023", telefon: "+998 93 345 67 89", ijtimoiyHolat: "Nogironligi bor", tuman: "Urgut tumani", uyId: "3", arizalarSoni: 3 },
  { id: "4", ism: "Raximova Shaxlo Akmalovna", jshshir: "41207890560034", telefon: "+998 94 456 78 90", ijtimoiyHolat: "Yolg'iz ona", tuman: "Ishtixon tumani", uyId: "5", arizalarSoni: 1 },
  { id: "5", ism: "Xasanov Botir Farhod o'g'li", jshshir: "29506780670045", telefon: "+998 95 567 89 01", ijtimoiyHolat: "Ijtimoiy yordamga muhtoj", tuman: "Bulung'ur tumani", uyId: "7", arizalarSoni: 2 },
  { id: "6", ism: "Nodirova Malika Rustamovna", jshshir: "40603670780056", telefon: "+998 97 678 90 12", ijtimoiyHolat: "Zo'ravonlikdan jabrlangan", tuman: "Jomboy tumani", uyId: "8", arizalarSoni: 4 },
  { id: "7", ism: "Mirzayev Jasur Kamoliddinovich", jshshir: "31102560890067", telefon: "+998 99 789 01 23", ijtimoiyHolat: "Kam ta'minlangan oila", tuman: "Nurobod tumani", uyId: "9", arizalarSoni: 1 },
  { id: "8", ism: "Ergasheva Dilnoza Baxromovna", jshshir: "42201450900078", telefon: "+998 90 890 12 34", ijtimoiyHolat: "Ko'p bolali oila", tuman: "Qo'shrabot tumani", uyId: "10", arizalarSoni: 2 },
];

export const arizalar: Ariza[] = [
  { id: "1", fuqaroId: "1", fuqaroIsm: "Abdullayev Anvar", tur: "Uy olish uchun ariza", sana: "2026-03-15", status: "korib_chiqilmoqda", izoh: "Kam ta'minlangan oila sifatida ariza topshirdi", tuman: "Samarqand tumani" },
  { id: "2", fuqaroId: "2", fuqaroIsm: "Karimova Nilufar", tur: "Ijara uzaytirish", sana: "2026-03-10", status: "tasdiqlandi", izoh: "Shartnoma 1 yilga uzaytirildi", tuman: "Kattaqo'rg'on tumani" },
  { id: "3", fuqaroId: "3", fuqaroIsm: "Toshmatov Sardor", tur: "Murojaat yuborish", sana: "2026-03-20", status: "korib_chiqilmoqda", izoh: "Uy ta'mirlash bo'yicha murojaat", tuman: "Urgut tumani" },
  { id: "4", fuqaroId: "4", fuqaroIsm: "Raximova Shaxlo", tur: "Uy olish uchun ariza", sana: "2026-02-28", status: "tasdiqlandi", izoh: "Yolg'iz ona sifatida ijtimoiy uy ajratildi", tuman: "Ishtixon tumani" },
  { id: "5", fuqaroId: "6", fuqaroIsm: "Nodirova Malika", tur: "Murojaat yuborish", sana: "2026-03-25", status: "rad_etildi", izoh: "Hujjatlar to'liq emas", tuman: "Jomboy tumani" },
  { id: "6", fuqaroId: "5", fuqaroIsm: "Xasanov Botir", tur: "Ijara uzaytirish", sana: "2026-03-18", status: "korib_chiqilmoqda", izoh: "Ijara muddatini uzaytirishni so'radi", tuman: "Bulung'ur tumani" },
  { id: "7", fuqaroId: "7", fuqaroIsm: "Mirzayev Jasur", tur: "Uy olish uchun ariza", sana: "2026-01-10", status: "tasdiqlandi", izoh: "Navbatga qo'yildi", tuman: "Nurobod tumani" },
];

export const aiTavsiyalar: AITavsiya[] = [
  { id: "1", xabar: "Urgut tumanida ijtimoiy uy talabi 15% oshgan", tur: "tavsiya", sana: "2026-04-03" },
  { id: "2", xabar: "Pastdarg'om tumanida bo'sh uylar ko'p — taqsimot tavsiya etiladi", tur: "tavsiya", sana: "2026-04-03" },
  { id: "3", xabar: "Samarqand tumanida 1 ta uyda boshqa shaxs yashayotgani aniqlandi", tur: "xavf", sana: "2026-04-02" },
  { id: "4", xabar: "3 ta uyda shartnoma muddati tugashiga 30 kundan kam qoldi", tur: "ogohlantirish", sana: "2026-04-03" },
  { id: "5", xabar: "Jomboy tumanidagi fuqaro ijtimoiy toifaga mos emas — tekshirish tavsiya etiladi", tur: "xavf", sana: "2026-04-03" },
];

export const navbatRoyxati = [
  { tartib: 1, ism: "Ergasheva Dilnoza", toifa: "Ko'p bolali oila", ball: 92, sana: "2026-01-05", tuman: "Qo'shrabot tumani" as SamarqandTuman },
  { tartib: 2, ism: "Toshmatov Sardor", toifa: "Nogironligi bor", ball: 88, sana: "2026-01-12", tuman: "Urgut tumani" as SamarqandTuman },
  { tartib: 3, ism: "Abdullayev Anvar", toifa: "Kam ta'minlangan", ball: 85, sana: "2026-02-01", tuman: "Samarqand tumani" as SamarqandTuman },
  { tartib: 4, ism: "Xasanov Botir", toifa: "Ijtimoiy yordamga muhtoj", ball: 80, sana: "2026-02-15", tuman: "Bulung'ur tumani" as SamarqandTuman },
  { tartib: 5, ism: "Nodirova Malika", toifa: "Zo'ravonlikdan jabrlangan", ball: 78, sana: "2026-03-01", tuman: "Jomboy tumani" as SamarqandTuman },
];

export const yerUchastkalari = [
  { id: "1", nomi: "Samarqand 14-A", maydon: 600, status: "bosh" as const, tur: "jiloy", manzil: "Samarqand viloyati, Samarqand tumani", tuman: "Samarqand tumani" as SamarqandTuman },
  { id: "2", nomi: "Urgut 7-B", maydon: 1200, status: "band" as const, tur: "nejiloy", manzil: "Samarqand viloyati, Urgut tumani", tuman: "Urgut tumani" as SamarqandTuman },
  { id: "3", nomi: "Kattaqo'rg'on 22", maydon: 450, status: "boshqa_tashkilot" as const, tur: "yer", manzil: "Samarqand viloyati, Kattaqo'rg'on tumani", tuman: "Kattaqo'rg'on tumani" as SamarqandTuman },
  { id: "4", nomi: "Pastdarg'om 3", maydon: 800, status: "bosh" as const, tur: "jiloy", manzil: "Samarqand viloyati, Pastdarg'om tumani", tuman: "Pastdarg'om tumani" as SamarqandTuman },
  { id: "5", nomi: "Ishtixon 11-C", maydon: 350, status: "band" as const, tur: "jiloy", manzil: "Samarqand viloyati, Ishtixon tumani", tuman: "Ishtixon tumani" as SamarqandTuman },
];
