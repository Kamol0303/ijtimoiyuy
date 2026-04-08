import {
  LayoutDashboard, Home, Users, FileText, BarChart3, Map, Bell,
  Settings, ListOrdered, Building2, LandPlot, LogOut, ShieldCheck,
  History, Shield, CheckCircle2
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useAuth, getRoleLabel, type UserRole } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import logo from "@/assets/logo.png";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";

interface NavItem {
  titleKey: string;
  url: string;
  icon: React.ElementType;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  { titleKey: "bosh_sahifa", url: "/dashboard", icon: LayoutDashboard, roles: ["hokim", "uy_joy", "ayollar"] },
  { titleKey: "uylar", url: "/uylar", icon: Home, roles: ["hokim", "uy_joy"] },
  { titleKey: "fuqarolar", url: "/fuqarolar", icon: Users, roles: ["hokim", "uy_joy", "ayollar"] },
  { titleKey: "arizalar", url: "/arizalar", icon: FileText, roles: ["hokim", "uy_joy", "ayollar"] },
  { titleKey: "shartnomalar", url: "/shartnomalar", icon: ShieldCheck, roles: ["hokim", "uy_joy"] },
  { titleKey: "monitoring", url: "/monitoring", icon: BarChart3, roles: ["hokim"] },
  { titleKey: "xarita", url: "/xarita", icon: Map, roles: ["hokim", "uy_joy"] },
  { titleKey: "yer_uchastkalari", url: "/yer-uchastkalari", icon: LandPlot, roles: ["hokim", "uy_joy"] },
  { titleKey: "navbat", url: "/navbat", icon: ListOrdered, roles: ["hokim", "uy_joy"] },
  
  { titleKey: "hisobotlar", url: "/hisobotlar", icon: Building2, roles: ["hokim"] },
  { titleKey: "xabarnomalar", url: "/xabarnomalar", icon: Bell, roles: ["hokim", "uy_joy", "ayollar"] },
  { titleKey: "yakunlangan_ishlar", url: "/yakunlangan", icon: CheckCircle2, roles: ["hokim"] },
  { titleKey: "amallar_tarixi", url: "/amallar-tarixi", icon: History, roles: ["hokim"] },
  { titleKey: "nazorat_paneli", url: "/nazorat-paneli", icon: Shield, roles: ["hokim"] },
  { titleKey: "sozlamalar", url: "/sozlamalar", icon: Settings, roles: ["hokim"] },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  if (!user) return null;

  const filtered = navItems.filter(item => item.roles.includes(user.role));

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarContent className="bg-sidebar">
        <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
          <img src={logo} alt="Ijtimoiy-uy AI" className="w-9 h-9 rounded-lg" />
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold text-sidebar-foreground">Ijtimoiy-uy AI</span>
              <span className="text-xs text-sidebar-foreground/60">{t("samarqand_viloyati")}</span>
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 text-xs uppercase tracking-wider">
            {!collapsed && t("asosiy")}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filtered.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
                      activeClassName="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!collapsed && <span className="text-sm">{t(item.titleKey)}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-sidebar border-t border-sidebar-border">
        <div className="p-3">
          {!collapsed && (
            <div className="mb-2 px-2">
              <p className="text-sm font-medium text-sidebar-foreground">{user.ism}</p>
              <p className="text-xs text-sidebar-foreground/50">{user.telefon}</p>
            </div>
          )}
          <button
            onClick={logout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-sidebar-foreground/60 hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && t("chiqish")}
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
