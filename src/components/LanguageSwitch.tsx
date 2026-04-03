import { useLanguage, type Lang } from "@/context/LanguageContext";

export function LanguageSwitch() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
      {([
        { code: "uz" as Lang, label: "🇺🇿 UZ" },
        { code: "ru" as Lang, label: "🇷🇺 RU" },
      ]).map(l => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          className={`px-2.5 py-1 text-xs rounded-md transition-colors font-medium ${
            lang === l.code
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
