import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "hokim" | "uy_joy" | "ayollar";

interface User {
  id: string;
  ism: string;
  role: UserRole;
  telefon: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const mockUsers: Record<string, { password: string; user: User }> = {
  hokim: { password: "hokim123", user: { id: "2", ism: "Sultonov Shavkat", role: "hokim", telefon: "+998 90 000 00 02" } },
  uyjoy: { password: "uyjoy123", user: { id: "3", ism: "Qodirov Bobur", role: "uy_joy", telefon: "+998 90 000 00 03" } },
  ayollar: { password: "ayollar123", user: { id: "4", ism: "Murodova Zulfiya", role: "ayollar", telefon: "+998 90 000 00 04" } },
};

const roleLabels: Record<UserRole, string> = {
  hokim: "Hokim",
  uy_joy: "Uy-joy bo'limi",
  ayollar: "Ayollar bo'limi",
};

export const getRoleLabel = (role: UserRole) => roleLabels[role];

const AUTH_STORAGE_KEY = "ijtimoiy_auth_user";

function getPersistedUser(): User | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getPersistedUser);

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  const login = (username: string, password: string): boolean => {
    const found = mockUsers[username];
    if (found && found.password === password) {
      setUser(found.user);
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
