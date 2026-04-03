## Bosqichma-bosqich reja

### 1-bosqich: KPI kartalar navigatsiyasi
- Dashboard KPI kartalarni bosilganda tegishli sahifaga filter bilan o'tkazish
- `useNavigate` + query params yoki state orqali

### 2-bosqich: i18n (UZ/RU) til tizimi
- `LanguageContext` yaratish
- Barcha matnlar uchun tarjima lug'ati
- Sidebar/header da til switch tugmasi
- Barcha sahifalarda `t()` funksiyasi ishlatish

### 3-bosqich: Yakunlash funksiyasi
- Har bir obyektga `holat` field qo'shish: `aktiv` | `yakunlangan` | `arxivlangan`
- "Yakunlash" tugmasi qo'shish
- "Yakunlangan ishlar" sahifasi yaratish
- Asosiy ro'yxatlarda faqat aktiv elementlar ko'rsatish

### 4-bosqich: Rol asosida nazorat
- `RoleGuard` component yaratish
- Hokim: to'liq CRUD + audit
- Boshqalar: faqat ko'rish + cheklangan tahrir

### 5-bosqich: Kengaytirilgan filterlar
- Har bir sahifaga status, tuman, sana filterlari
- Filter UI component

### 6-bosqich: Export kengaytirish + Arxiv
- PDF/Excel export
- Arxivga o'tkazish tugmasi

### 7-bosqich: AI monitoring kuchaytirish
- Yangi AI qoidalar qo'shish
- Toast xabarnomalar