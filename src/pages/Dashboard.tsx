import { useState, useMemo, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Menu,
  PanelLeft,
  Search,
  LogOut,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  PanelLeftClose
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
import OptimizedImage from "@/components/OptimizedImage";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { navItems } from "./dashboard/constants";
import LiveOnboardingFunnel from './dashboard/LiveOnboardingFunnel';
import FailingSteps from './dashboard/FailingSteps';
import RecentEvents from './dashboard/RecentEvents';
import { ClientsView } from "./dashboard/Clients";
import { EmailsView } from "./dashboard/Emails";
import { TasksView } from "./dashboard/Tasks";
import { TemplatesView } from "./dashboard/TemplatesView";
import { SettingsView } from "./dashboard/Settings";
import { PlaceholderView } from "./dashboard/Placeholder";
import IntegrationView from './dashboard/IntegrationView';
import FlowTemplatesView from './dashboard/FlowTemplatesView';
import VisualFlowEditorView from './dashboard/VisualFlowEditorView';
import InsightsView from './dashboard/InsightsView';
import WebhooksView from './dashboard/WebhooksView';
import DashboardMetrics from '@/components/dashboard/DashboardMetrics';
import Notifications from '@/components/dashboard/Notifications';
import ActivationPulse from './dashboard/ActivationPulse';
import UserSegments from './dashboard/UserSegments';
import FlowsView from './dashboard/FlowsView';
import ClientManageDialog from '@/components/dialogs/ClientManageDialog';

import { PageLoader } from "@/components/Loader";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [isNewClientDialogOpen, setIsNewClientDialogOpen] = useState(false);
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  const [isManageClientDialogOpen, setIsManageClientDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newClient, setNewClient] = useState({ name: "", email: "", template: "Enterprise Nexus" });
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('onboardly_user');
    if (storedUser) setUser(JSON.parse(storedUser));

    // Set up real-time listener for clients
    const syncClients = async () => {
      const { collection, query, onSnapshot } = await import("firebase/firestore");
      const { db } = await import("@/lib/firebase");

      const q = query(collection(db, "clients"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const clientsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setClients(clientsData);
        setLoading(false);
      }, (error) => {
        console.error("Firestore listener error:", error);
        setLoading(false);
      });

      return unsubscribe;
    };

    let unsubscribe: any;
    syncClients().then(unsub => unsubscribe = unsub);

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const activeTab = useMemo(() => {
    const path = location.pathname.endsWith('/') ? location.pathname.slice(0, -1) : location.pathname;
    const item = navItems.find(item => item.path === path);
    return item ? item.label : "Dashboard";
  }, [location.pathname]);

  const handleAddClient = async () => {
    if (!newClient.name || !newClient.email) {
      toast.error("Please fill in all fields");
      return;
    }

    const { collection, addDoc } = await import("firebase/firestore");
    const { db } = await import("@/lib/firebase");

    try {
      const clientObj = {
        name: newClient.name,
        email: newClient.email,
        template: newClient.template,
        tasks: [], // Would normally fetch from templates
        progress: 0,
        status: "pending",
        createdAt: new Date().toISOString(),
        lastActivity: "Just now",
      };

      await addDoc(collection(db, "clients"), clientObj);

      setNewClient({ name: "", email: "", template: "Enterprise Nexus" });
      setIsNewClientDialogOpen(false);
      toast.success("Inbound Flow Initialized", {
        description: `${clientObj.name} has been synchronized with ${clientObj.template}.`
      });
    } catch (error: any) {
      console.error("Error adding client:", error);
      toast.error("Failed to add client");
    }
  };

  const resetClientForm = () => {
    setNewClient({ name: "", email: "", template: "Enterprise Nexus" });
    setIsNewClientDialogOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('onboardly_user');
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const analytics = useMemo(() => {
    const total = clients.length;
    const activated = clients.filter((c: any) => c.progress === 100 || c.isActivated).length;
    const activationRate = total > 0 ? Math.round((activated / total) * 100) : 0;

    // Simple funnel mock based on real counts
    return {
      funnel: [
        { name: 'Signup', count: 100, dropOff: 0, avgTime: '1m' },
        { name: 'Step 1', count: 85, dropOff: 15, avgTime: '2m' },
        { name: 'Step 2', count: 60, dropOff: 25, avgTime: '3m' },
        { name: 'Activated', count: activationRate, dropOff: 100 - activationRate, avgTime: 'N/A' }
      ]
    };
  }, [clients]);

  const failingSteps = useMemo(() => {
    // Extract failing steps from actual client tasks if possible, 
    // or return empty for now since we are stripping mock data
    return [];
  }, [clients]);

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
        return (
          <>
            <div className="space-y-6">
              <DashboardMetrics analytics={analytics} failingSteps={failingSteps} clients={clients} />
              <ActivationPulse analytics={analytics} clients={clients} />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <LiveOnboardingFunnel funnel={analytics.funnel} />
                  <FailingSteps steps={failingSteps} />
                  <RecentEvents />
                </div>
                <div>
                  <UserSegments />
                </div>
              </div>
            </div>
          </>
        );
      case "Clients":
        return <ClientsView
          clients={clients}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setIsNewClientDialogOpen={setIsNewClientDialogOpen}
          getStatusIcon={getStatusIcon}
          getStatusLabel={getStatusLabel}
          onManageClient={(client) => {
            setSelectedClient(client);
            setIsManageClientDialogOpen(true);
          }}
        />;
      case "Emails":
        return <EmailsView />;
      case "Tasks":
        return <TasksView isAddDialogOpen={isNewTaskDialogOpen} setIsAddDialogOpen={setIsNewTaskDialogOpen} clients={clients} />;
      case "Templates":
        return <TemplatesView />;
      case "Flows":
        return <FlowsView />;
      case "Settings":
        return <SettingsView />;
      case "Integration":
        return <IntegrationView />;
      case "Flow Templates":
        return <FlowTemplatesView />;
      case "Visual Flow Editor":
        return <VisualFlowEditorView />;
      case "Insights":
        return <InsightsView />;
      case "Webhooks":
        return <WebhooksView clients={clients} />;
      default:
        return <PlaceholderView title={activeTab} onReset={() => navigate("/dashboard")} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] flex overflow-hidden relative selection:bg-accent/30 leading-tight">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? 'w-52' : 'w-16'} ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative flex flex-col border-r border-white/5 bg-[#0b0c10] transition-all duration-300 z-50 shrink-0 h-full`}
      >
        <div className="p-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-accent p-1 shadow-glow shrink-0 overflow-hidden">
              <OptimizedImage src="/assets/brand/logo.png" alt="O" className="w-full h-full object-contain" />
            </div>
            {sidebarOpen && (
              <div className="flex flex-col animate-in fade-in duration-500">
                <span className="text-[11px] font-black uppercase tracking-tighter text-white">Onboardly</span>
                <span className="text-[7px] font-black uppercase tracking-[0.3em] text-accent mt-[-2px]">Nexus</span>
              </div>
            )}
          </Link>
          <div className="flex items-center gap-2">
            {sidebarOpen && (
              <button onClick={() => setSidebarOpen(false)} className="hidden md:flex text-white/20 hover:text-white transition-colors">
                <PanelLeftClose className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden text-white/20 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!sidebarOpen && (
          <div className="flex justify-center py-2">
            <button
              onClick={() => setSidebarOpen(true)}
              className="hidden md:flex w-7 h-7 items-center justify-center rounded-lg bg-accent/10 text-accent hover:bg-accent hover:text-white transition-all"
            >
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
                onClick={() => setMobileMenuOpen(false)}
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
              <AvatarFallback className="bg-accent/10 text-accent font-bold text-[9px]">
                {user?.name?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            {sidebarOpen && (
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-white truncate">{user?.name || 'User'}</p>
                <p className="text-[8px] text-accent/40 font-black uppercase tracking-tighter leading-none">{user?.plan || 'Free'}</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 min-w-0 relative p-1.5 md:p-2 flex flex-col">
        <div className="flex-1 bg-[#14151b]/40 md:backdrop-blur-3xl md:border md:border-white/5 md:rounded-[1rem] flex flex-col overflow-hidden shadow-2xl">
          <header className="h-14 md:h-16 border-b border-white/5 flex items-center justify-between px-4 md:px-6 bg-white/[0.02]">
            <div className="flex items-center gap-2 md:gap-4">
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden text-white/20 hover:text-white transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="w-0.5 h-4 md:h-5 bg-accent rounded-full" />
              <h1 className="text-xs md:text-sm font-black uppercase tracking-widest text-white/90">{activeTab}</h1>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <div className="hidden lg:flex relative group">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent" />
                <Input
                  placeholder="Search clients, tasks..."
                  className="w-32 md:w-48 bg-white/5 border-transparent h-8 text-[10px] pl-9 rounded-md focus-visible:ring-accent/10 focus-visible:w-64 transition-all"
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
                className="h-8 px-3 md:px-4 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-glow"
              >
                <Plus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">
                  {activeTab === "Tasks" ? "Assign" : activeTab === "Templates" ? "Forge" : "Integrate"}
                </span>
                <span className="sm:hidden">+</span>
              </Button>
              <div className="flex items-center gap-2 border-l border-white/5 pl-3">
                <Notifications />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="h-6 w-6 text-white/20 hover:text-white"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-4 md:p-5 custom-scrollbar">
            <div className="max-w-6xl mx-auto">
              {loading ? <PageLoader /> : renderContent()}
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

      {/* Dialog for Managing Client */}
      <ClientManageDialog
        open={isManageClientDialogOpen}
        onOpenChange={setIsManageClientDialogOpen}
        client={selectedClient}
      />
    </div>
  );
};

export default Dashboard;
