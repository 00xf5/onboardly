import { MoreVertical, ChevronDown, TrendingUp, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";

interface DashboardOverviewProps {
    clients: any[];
    stats: any[];
    getStatusIcon: (status: string) => React.ReactNode;
    getStatusLabel: (status: string) => string;
}

export const DashboardOverview = ({ clients, stats, getStatusIcon, getStatusLabel }: DashboardOverviewProps) => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
            {/* 💎 Compact Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="relative p-3.5 md:p-4 bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/5 hover:border-accent/20 transition-all group overflow-hidden"
                    >
                        <div className="relative flex items-center justify-between mb-3">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 shadow-inner group-hover:scale-110 transition-transform">
                                <stat.icon className="w-4 h-4 text-accent" />
                            </div>
                            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-success/10 border border-success/10">
                                <TrendingUp className="w-2.5 h-2.5 text-success" />
                                <span className="text-[8px] font-black text-success uppercase">Growth</span>
                            </div>
                        </div>

                        <div className="relative">
                            <h3 className="text-xl md:text-2xl font-black text-white tracking-tighter">
                                {stat.value}
                            </h3>
                            <p className="text-[8px] text-white/30 font-black uppercase tracking-[0.2em] mt-0.5">
                                {stat.label}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* 🚀 High Density Activity Table */}
            <div className="bg-[#1a1b23]/40 backdrop-blur-3xl rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
                <div className="p-4 md:p-5 border-b border-white/5 flex items-center justify-between">
                    <div>
                        <h2 className="text-xs md:text-sm font-black text-white uppercase tracking-widest">Active Intelligence</h2>
                        <p className="text-[9px] text-white/20 mt-0.5 uppercase tracking-tighter italic font-medium">Real-time nexus synchronization</p>
                    </div>
                    <Button variant="ghost" size="sm" asChild className="h-7 rounded-lg bg-white/5 text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/10 border border-white/5 px-3 transition-all">
                        <Link to="/dashboard/clients" className="gap-1.5">
                            Full Registry
                            <ArrowUpRight className="w-3 h-3" />
                        </Link>
                    </Button>
                </div>

                <div className="overflow-x-auto p-1.5 md:p-3">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-white/10 uppercase tracking-[0.2em] text-[8px] font-black">
                                <th className="pb-4 px-3">Partner</th>
                                <th className="pb-4 px-3">Protocol</th>
                                <th className="pb-4 px-3">Velocity</th>
                                <th className="pb-4 px-3">State</th>
                                <th className="pb-4 px-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {clients.slice(0, 5).map((client, index) => (
                                <tr key={index} className="group hover:bg-white/[0.01] transition-colors">
                                    <td className="py-3 px-3">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="w-7 h-7 rounded-lg ring-1 ring-white/5">
                                                <AvatarFallback className="bg-white/5 text-white/40 font-black uppercase text-[8px]">
                                                    {client.name.split(' ').map((n: string) => n[0]).join('')}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0">
                                                <p className="text-[11px] font-bold text-white truncate group-hover:text-accent transition-colors">{client.name}</p>
                                                <p className="text-[9px] text-white/30 truncate leading-none mt-0.5">{client.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 px-3">
                                        <span className="text-[9px] font-black uppercase tracking-tighter text-white/40 border border-white/5 px-2 py-0.5 rounded-md bg-white/[0.02]">
                                            {client.template}
                                        </span>
                                    </td>
                                    <td className="py-3 px-3">
                                        <div className="flex items-center gap-2 w-24">
                                            <div className="h-0.5 flex-1 bg-white/5 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-accent shadow-glow transition-all duration-1000 ease-out"
                                                    style={{ width: `${client.progress}%` }}
                                                />
                                            </div>
                                            <span className="text-[9px] font-black text-white italic">{client.progress}%</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-3">
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(client.status)}
                                            <span className="text-[9px] font-bold uppercase text-white/40 tracking-widest leading-none">
                                                {getStatusLabel(client.status)}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-3 text-right text-xs">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => toast.info(`Accessing ${client.name}`)}
                                            className="h-6 w-6 p-0 rounded-md bg-white/5 text-white/20 hover:text-white"
                                        >
                                            <ArrowUpRight className="w-3 h-3" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
