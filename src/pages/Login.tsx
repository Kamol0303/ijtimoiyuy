import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
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
  const [tab, setTab] = useState<"login" | "telefon" | "myid">("login");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (login(username, password)) {
      navigate("/dashboard");
    } else {
      setError("Login yoki parol noto'g'ri");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - pattern */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden">
        <img src={suzani} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 govtech-gradient opacity-90" />
        <div className="relative z-10 text-center px-12">
          <img src={logo} alt="IjtimoiyUy AI" className="w-24 h-24 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-primary-foreground mb-4">IjtimoiyUy AI</h1>
          <p className="text-lg text-primary-foreground/80">Samarqand viloyati — Adolatli taqsimot, shaffof nazorat va aqlli boshqaruv</p>
        </div>
      </div>

      {/* Right - form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md animate-slide-up">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <img src={logo} alt="IjtimoiyUy AI" className="w-12 h-12" />
            <h1 className="text-2xl font-bold text-foreground">IjtimoiyUy AI</h1>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-2">Tizimga kirish</h2>
          <p className="text-muted-foreground mb-8">Samarqand viloyati platformasi</p>

          {/* Tabs */}
          <div className="flex gap-1 bg-muted rounded-lg p-1 mb-6">
            {[
              { key: "login" as const, label: "Login/Parol" },
              { key: "telefon" as const, label: "Telefon" },
              { key: "myid" as const, label: "MyID" },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex-1 text-sm py-2 rounded-md transition-colors ${
                  tab === t.key ? "bg-card text-foreground shadow-sm font-medium" : "text-muted-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === "login" && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="text-foreground">Foydalanuvchi nomi</Label>
                <Input
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="hokim, uyjoy, ayollar"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label className="text-foreground">Parol</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Parolni kiriting"
                  className="mt-1.5"
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full">Kirish</Button>
            </form>
          )}

          {tab === "telefon" && (
            <div className="space-y-4">
              <div>
                <Label className="text-foreground">Telefon raqam</Label>
                <Input placeholder="+998 __ ___ __ __" className="mt-1.5" />
              </div>
              <Button className="w-full">SMS kod yuborish</Button>
              <p className="text-xs text-muted-foreground text-center">Telefon raqamingizga tasdiqlash kodi yuboriladi</p>
            </div>
          )}

          {tab === "myid" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">ID</span>
              </div>
              <p className="text-foreground font-medium mb-2">MyID orqali kirish</p>
              <p className="text-sm text-muted-foreground mb-6">MyID ilovasini ochib QR kodni skanerlang</p>
              <div className="w-40 h-40 bg-muted rounded-xl mx-auto flex items-center justify-center border-2 border-dashed border-border">
                <span className="text-muted-foreground text-sm">QR Kod</span>
              </div>
            </div>
          )}

          <div className="mt-8 p-4 bg-muted rounded-xl">
            <p className="text-xs font-medium text-foreground mb-2">Sinov uchun loginlar:</p>
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
