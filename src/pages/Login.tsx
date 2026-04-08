import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import suzani from "@/assets/suzani-pattern.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (login(username, password)) {
      navigate("/dashboard");
    } else {
      setError(t("login_xato"));
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - pattern */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden">
        <img src={suzani} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 govtech-gradient opacity-90" />
        <div className="relative z-10 text-center px-12">
          <img src={logo} alt="Ijtimoiy-uy AI" className="w-24 h-24 mx-auto mb-6 object-contain" />
          <h1 className="text-4xl font-bold text-primary-foreground mb-4">Ijtimoiy-uy AI</h1>
          <p className="text-lg text-primary-foreground/80">{t("samarqand_viloyati")} — {t("login_banner")}</p>
        </div>
      </div>

      {/* Right - form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background relative">
        <div className="absolute top-4 right-4">
          <LanguageSwitch />
        </div>
        <div className="w-full max-w-md animate-slide-up">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <img src={logo} alt="Ijtimoiy-uy AI" className="w-12 h-12" />
            <h1 className="text-2xl font-bold text-foreground">Ijtimoiy-uy AI</h1>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-2">{t("tizimga_kirish")}</h2>
          <p className="text-muted-foreground mb-8">{t("platformasi")}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-foreground">{t("foydalanuvchi_nomi")}</Label>
              <Input
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="hokim, uyjoy, ayollar"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label className="text-foreground">{t("parol")}</Label>
              <Input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={t("parolni_kiriting")}
                className="mt-1.5"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full">{t("kirish")}</Button>
          </form>

          <div className="mt-8 p-4 bg-muted rounded-xl">
            <p className="text-xs font-medium text-foreground mb-2">{t("sinov_loginlar")}</p>
            <div className="grid grid-cols-1 gap-1 text-xs text-muted-foreground">
              <span>hokim / hokim123</span>
              <span>uyjoy / uyjoy123</span>
              <span>ayollar / ayollar123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;