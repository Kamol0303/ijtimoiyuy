import {
  LayoutDashboard, Home, Users, FileText, BarChart3, Map, Bell,
  Settings, Brain, ListOrdered, Building2, LandPlot, LogOut, ShieldCheck,
  History, Shield
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useAuth, getRoleLabel, type UserRole } from "@/context/AuthContext";
import logo from "@/assets/logo.png";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";

interface NavItem {
  title: string;
  url: string;
  icon: React.ElementType;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  { title: "Bosh sahifa", url: "/dashboard", icon: LayoutDashboard, roles: ["hokim", "uy_joy", "ayollar"] },
  { title: "Uylar", url: "/uylar", icon: Home, roles: ["hokim", "uy_joy"] },
  { title: "Fuqarolar", url: "/fuqarolar", icon: Users, roles: ["hokim", "uy_joy", "ayollar"] },
  { title: "Arizalar", url: "/arizalar", icon: FileText, roles: ["hokim", "uy_joy", "ayollar"] },
  { title: "Shartnomalar", url: "/shartnomalar", icon: ShieldCheck, roles: ["hokim", "uy_joy"] },
  { title: "Monitoring", url: "/monitoring", icon: BarChart3, roles: ["hokim"] },
  { title: "Xarita", url: "/xarita", icon: Map, roles: ["hokim", "uy_joy"] },
  { title: "Yer uchastkalari", url: "/yer-uchastkalari", icon: LandPlot, roles: ["hokim", "uy_joy"] },
  { title: "Navbat", url: "/navbat", icon: ListOrdered, roles: ["hokim", "uy_joy"] },
  { title: "AI tahlil", url: "/ai", icon: Brain, roles: ["hokim"] },
  { title: "Hisobotlar", url: "/hisobotlar", icon: Building2, roles: ["hokim"] },
  { title: "Xabarnomalar", url: "/xabarnomalar", icon: Bell, roles: ["hokim", "uy_joy", "ayollar"] },
  { title: "Sozlamalar", url: "/sozlamalar", icon: Settings, roles: ["hokim"] },
  { title: "Amallar tarixi", url: "/amallar-tarixi", icon: History, roles: ["hokim"] },
  { title: "Nazorat paneli", url: "/nazorat-paneli", icon: Shield, roles: ["hokim"] },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { user, logout } = useAuth();

  if (!user) return null;

  const filtered = navItems.filter(item => item.roles.includes(user.role));

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarContent className="bg-sidebar">
        <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
          <img src={logo} alt="IjtimoiyUy AI" className="w-9 h-9 rounded-lg" />
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold text-sidebar-foreground">IjtimoiyUy AI</span>
              <span className="text-xs text-sidebar-foreground/60">Samarqand viloyati</span>
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 text-xs uppercase tracking-wider">
            {!collapsed && "Asosiy"}
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
                      {!collapsed && <span className="text-sm">{item.title}</span>}
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
            {!collapsed && "Chiqish"}
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
