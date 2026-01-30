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

export const initialClients = [
    {
        name: "Sarah Johnson",
        slug: "sarah-johnson",
        email: "sarah@company.com",
        template: "Enterprise Nexus",
        progress: 75,
        status: "in_progress",
        lastActivity: "2 hours ago"
    },
    {
        name: "Michael Chen",
        slug: "michael-chen",
        email: "michael@startup.io",
        template: "Velocity Stream",
        progress: 100,
        status: "completed",
        lastActivity: "1 day ago"
    },
    {
        name: "Emily Davis",
        slug: "emily-davis",
        email: "emily@agency.com",
        template: "Standard Onboarding",
        progress: 25,
        status: "pending",
        lastActivity: "3 days ago"
    },
    {
        name: "Alex Thompson",
        slug: "alex-thompson",
        email: "alex@business.net",
        template: "Quick Start",
        progress: 50,
        status: "in_progress",
        lastActivity: "5 hours ago"
    },
    {
        name: "Jessica Wu",
        slug: "jessica-wu",
        email: "jess@quantum.tech",
        template: "Enterprise Nexus",
        progress: 92,
        status: "in_progress",
        lastActivity: "12 mins ago"
    },
    {
        name: "David Miller",
        slug: "david-miller",
        email: "david@forbes.com",
        template: "Global Expansion",
        progress: 15,
        status: "pending",
        lastActivity: "1 hour ago"
    },
    {
        name: "Sophia Loren",
        slug: "sophia-loren",
        email: "sophia@vogue.it",
        template: "Brand Identity",
        progress: 100,
        status: "completed",
        lastActivity: "2 days ago"
    }
];
