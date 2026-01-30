import { useState, useMemo } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Plus,
  FileText,
  CheckSquare,
  Mail,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Menu,
  PanelLeft,
  PanelLeftClose,
  LayoutGrid,
  Users,
  Search,
  Bell,
  LogOut,
  Clock,
  CheckCircle2,
  AlertCircle,
  Zap,
  LayoutDashboard,
  Settings as SettingsIcon
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { navItems, initialClients } from "./dashboard/constants";
import { DashboardOverview } from "./dashboard/Overview";
import { ClientsView } from "./dashboard/Clients";
import { EmailsView } from "./dashboard/Emails";
import { TasksView } from "./dashboard/Tasks";
import { TemplatesView } from "./dashboard/Templates";
import { SettingsView } from "./dashboard/Settings";
import { PlaceholderView } from "./dashboard/Placeholder";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const [isNewClientDialogOpen, setIsNewClientDialogOpen] = useState(false);
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [clients, setClients] = useState(initialClients);
  const [newClient, setNewClient] = useState({ name: "", email: "", template: "Enterprise Nexus" });
  const navigate = useNavigate();

  const activeTab = useMemo(() => {
    const path = location.pathname.endsWith('/') ? location.pathname.slice(0, -1) : location.pathname;
    const item = navItems.find(item => item.path === path);
    return item ? item.label : "Dashboard";
  }, [location.pathname]);

  const handleAddClient = () => {
    if (!newClient.name || !newClient.email) {
      toast.error("Please fill in all fields");
      return;
    }

    const clientToAdd = {
      ...newClient,
      progress: 0,
      status: "pending",
      lastActivity: "Just now"
    };

    setClients([clientToAdd, ...clients]);
    setNewClient({ name: "", email: "", template: "Enterprise Nexus" });
    setIsNewClientDialogOpen(false);
    toast.success("Inbound Flow Initialized", {
      description: `${newClient.name} has been synchronized with ${newClient.template}.`
    });
  };

  const stats = [
    { label: "Active Clients", value: clients.length.toString(), icon: Users, change: "+2 this week" },
    { label: "Completion Rate", value: "86%", icon: Zap, change: "Optimized" },
    { label: "Tasks Neutralized", value: "47", icon: CheckSquare, change: "8 total pending" },
    { label: "Auto-Emails Sent", value: "156", icon: Mail, change: "+23 this month" },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-3.5 h-3.5 text-success" />;
      case "in_progress":
        return <Clock className="w-3.5 h-3.5 text-warning" />;
      default:
        return <AlertCircle className="w-3.5 h-3.5 text-white/20" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed": return "Completed";
      case "in_progress": return "In Progress";
      default: return "Pending";
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return <DashboardOverview clients={clients} stats={stats} getStatusIcon={getStatusIcon} getStatusLabel={getStatusLabel} />;
      case "Clients":
        return <ClientsView clients={clients} searchQuery={searchQuery} setSearchQuery={setSearchQuery} setIsNewClientDialogOpen={setIsNewClientDialogOpen} getStatusIcon={getStatusIcon} getStatusLabel={getStatusLabel} />;
      case "Emails":
        return <EmailsView />;
      case "Tasks":
        return <TasksView isAddDialogOpen={isNewTaskDialogOpen} setIsAddDialogOpen={setIsNewTaskDialogOpen} />;
      case "Templates":
        return <TemplatesView />;
      case "Settings":
        return <SettingsView />;
      default:
        return <PlaceholderView title={activeTab} onReset={() => navigate("/dashboard")} />;
    }
  };

  return (
    <div className="h-[var(--viewport-height)] bg-[#0b0c10] flex overflow-hidden relative selection:bg-accent/30 leading-tight">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? 'w-52' : 'w-16'} hidden md:flex flex-col border-r border-white/5 bg-[#0b0c10] transition-all duration-300 relative z-20 shrink-0`}
      >
        <div className="p-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-accent p-1 shadow-glow shrink-0 overflow-hidden">
              <img src="/assets/brand/logo.png" alt="O" className="w-full h-full object-contain" />
            </div>
            {sidebarOpen && (
              <div className="flex flex-col animate-in fade-in duration-500">
                <span className="text-[11px] font-black uppercase tracking-tighter text-white">Onboardly</span>
                <span className="text-[7px] font-black uppercase tracking-[0.3em] text-accent mt-[-2px]">Nexus</span>
              </div>
            )}
          </Link>
          {sidebarOpen && (
            <button onClick={() => setSidebarOpen(false)} className="text-white/20 hover:text-white transition-colors">
              <PanelLeftClose className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {!sidebarOpen && (
          <div className="flex justify-center py-2">
            <button onClick={() => setSidebarOpen(true)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-accent/10 text-accent hover:bg-accent hover:text-white transition-all">
              <PanelLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <nav className="flex-1 px-2.5 py-4 space-y-0.5 mt-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.label;
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-all group ${isActive ? 'bg-accent/10 text-accent shadow-[0_0_15px_rgba(255,107,74,0.05)]' : 'text-white/30 hover:text-white/60 hover:bg-white/[0.02]'
                  }`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {sidebarOpen && <span className="text-[11px] font-bold tracking-tight">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/5">
          <div className={`p-1.5 rounded-xl bg-white/[0.02] flex items-center gap-2 ${!sidebarOpen && 'justify-center'}`}>
            <Avatar className="w-6 h-6 rounded-lg ring-1 ring-white/10">
              <AvatarFallback className="bg-accent/10 text-accent font-bold text-[9px]">JD</AvatarFallback>
            </Avatar>
            {sidebarOpen && (
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-white truncate">Jane Doe</p>
                <p className="text-[8px] text-accent/40 font-black uppercase tracking-tighter leading-none">Pro</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 min-w-0 relative p-1.5 md:p-2 flex flex-col">
        <div className="flex-1 bg-[#14151b]/40 md:backdrop-blur-3xl md:border md:border-white/5 md:rounded-[1rem] flex flex-col overflow-hidden shadow-2xl">
          <header className="h-11 border-b border-white/5 flex items-center justify-between px-4 bg-white/[0.01]">
            <div className="flex items-center gap-2">
              <div className="w-0.5 h-3 bg-accent rounded-full" />
              <h1 className="text-[11px] font-black uppercase tracking-widest text-white/80">{activeTab}</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex relative group">
                <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent" />
                <Input
                  placeholder="Registry search..."
                  className="w-32 bg-white/5 border-transparent h-6 text-[9px] pl-7 rounded-md focus-visible:ring-accent/10 focus-visible:w-48 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                variant="accent"
                size="sm"
                onClick={() => {
                  if (activeTab === "Clients" || activeTab === "Dashboard") setIsNewClientDialogOpen(true);
                  if (activeTab === "Tasks") setIsNewTaskDialogOpen(true);
                  if (activeTab === "Templates") toast.info("Forge Active");
                }}
                className="h-6 px-2.5 rounded-lg text-[8px] font-black uppercase tracking-widest shadow-glow"
              >
                <Plus className="w-3 h-3 mr-1" />
                {activeTab === "Tasks" ? "Assign" : activeTab === "Templates" ? "Forge" : "Integrate"}
              </Button>
              <div className="flex items-center gap-2 border-l border-white/5 pl-3">
                <Button variant="ghost" size="icon" className="h-6 w-6 text-white/20 hover:text-white">
                  <Bell className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-4 md:p-5 custom-scrollbar">
            <div className="max-w-6xl mx-auto">
              {renderContent()}
            </div>
          </div>
        </div>
      </main>

      {/* Dialog for New Client */}
      <Dialog open={isNewClientDialogOpen} onOpenChange={setIsNewClientDialogOpen}>
        <DialogContent className="sm:max-w-[360px] bg-[#1a1b23] border-white/5 text-white rounded-[1.5rem] p-6 shadow-2xl backdrop-blur-3xl">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-black tracking-tight">Partner Integration</DialogTitle>
            <DialogDescription className="text-white/40 text-[11px]">Sync a new inbound partner with the nexus.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-[9px] uppercase font-black tracking-widest text-white/20 ml-1">Partner Identity</Label>
              <Input placeholder="John Doe" className="bg-white/5 h-10 text-xs rounded-xl border-white/5" value={newClient.name} onChange={(e) => setNewClient({ ...newClient, name: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[9px] uppercase font-black tracking-widest text-white/20 ml-1">Neural Address (Email)</Label>
              <Input placeholder="john@nexus.io" className="bg-white/5 h-10 text-xs rounded-xl border-white/5" value={newClient.email} onChange={(e) => setNewClient({ ...newClient, email: e.target.value })} />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="accent" className="w-full h-10 rounded-xl font-black uppercase text-[10px] tracking-widest" onClick={handleAddClient}>Execute Integration</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
