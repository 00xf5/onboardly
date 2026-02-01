import { LayoutDashboard, Users, FileText, Mail, CheckSquare, Settings, Zap } from "lucide-react";

export const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Users, label: "Clients", path: "/dashboard/clients" },
    { icon: FileText, label: "Flows", path: "/dashboard/flows" },
    { icon: FileText, label: "Templates", path: "/dashboard/templates" },
    { icon: Mail, label: "Emails", path: "/dashboard/emails" },
    { icon: CheckSquare, label: "Tasks", path: "/dashboard/tasks" },
    { icon: Settings, label: "Settings", path: "/dashboard/settings" },
    { icon: Zap, label: "Integration", path: "/dashboard/integration" },
    { icon: FileText, label: "Flow Templates", path: "/dashboard/flow-templates" },
    { icon: Zap, label: "Visual Flow Editor", path: "/dashboard/visual-flow-editor" },
    { icon: Zap, label: "Insights", path: "/dashboard/insights" },
    { icon: Zap, label: "Webhooks", path: "/dashboard/webhooks" },
];


