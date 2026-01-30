import { Search, Plus, MoreVertical, Filter, SlidersHorizontal, ArrowUpRight, Link as LinkIcon, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

interface ClientsViewProps {
    clients: any[];
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    setIsNewClientDialogOpen: (open: boolean) => void;
    getStatusIcon: (status: string) => React.ReactNode;
    getStatusLabel: (status: string) => string;
}

export const ClientsView = ({
    clients,
    searchQuery,
    setSearchQuery,
    setIsNewClientDialogOpen,
    getStatusIcon,
    getStatusLabel
}: ClientsViewProps) => {
    const filteredClients = clients.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
            {/* 🔮 Control Bar */}
            <div className="bg-[#1a1b23]/40 backdrop-blur-3xl rounded-xl border border-white/5 p-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-xs group">
                    <Search className="w-3 h-3 absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-accent transition-colors" />
                    <input
                        placeholder="Scan Partners..."
                        className="w-full bg-white/[0.03] border-white/5 rounded-lg h-8 text-[11px] pl-9 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-accent/40 placeholder:text-white/10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toast.info("Filter Matrix Engaged")}
                        className="h-8 rounded-lg bg-white/5 border border-white/5 px-2.5 text-[10px] uppercase font-black tracking-widest text-white/40 hover:text-white"
                    >
                        <Filter className="w-3.5 h-3.5 mr-1.5" />
                        Options
                    </Button>
                    <Button
                        variant="accent"
                        size="sm"
                        onClick={() => setIsNewClientDialogOpen(true)}
                        className="h-8 rounded-lg px-4 font-black uppercase text-[10px] tracking-widest shadow-glow"
                    >
                        <Plus className="w-3.5 h-3.5 mr-1.5" />
                        Integrate
                    </Button>
                </div>
            </div>

            {/* Matrix Table */}
            <div className="bg-[#1a1b23]/40 backdrop-blur-3xl rounded-xl border border-white/5 overflow-hidden">
                <div className="overflow-x-auto p-1.5">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-white/10 uppercase tracking-[0.2em] text-[8px] font-black border-b border-white/[0.03]">
                                <th className="py-3 px-3">Entity</th>
                                <th className="py-3 px-3">Strategy</th>
                                <th className="py-3 px-3">Velocity</th>
                                <th className="py-3 px-3">State</th>
                                <th className="py-3 px-3 text-right">Relay</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.01]">
                            {filteredClients.map((client, index) => (
                                <tr key={index} className="group hover:bg-white/[0.01] transition-colors">
                                    <td className="py-2.5 px-3">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="w-7 h-7 rounded-lg ring-1 ring-white/5 group-hover:ring-accent/30 transition-all">
                                                <AvatarFallback className="bg-white/5 text-white/40 font-black text-[8px]">
                                                    {client.name.split(' ').map((n: string) => n[0]).join('')}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0">
                                                <p className="text-[11px] font-bold text-white group-hover:text-accent transition-colors">{client.name}</p>
                                                <p className="text-[9px] text-white/20 truncate leading-tight mt-0.5 uppercase tracking-tighter">{client.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-2.5 px-3">
                                        <span className="text-[9px] font-bold text-white/40 bg-white/5 border border-white/5 px-2 py-0.5 rounded-md">
                                            {client.template}
                                        </span>
                                    </td>
                                    <td className="py-2.5 px-3">
                                        <div className="flex items-center gap-2 w-28">
                                            <div className="h-0.5 flex-1 bg-white/5 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-accent shadow-glow transition-all duration-1000 ease-out"
                                                    style={{ width: `${client.progress}%` }}
                                                />
                                            </div>
                                            <span className="text-[9px] font-black text-white italic tracking-tighter">{client.progress}%</span>
                                        </div>
                                    </td>
                                    <td className="py-2.5 px-3">
                                        <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-md w-fit border border-white/5">
                                            {getStatusIcon(client.status)}
                                            <span className="text-[8px] font-black uppercase text-white/40 tracking-widest leading-none">
                                                {getStatusLabel(client.status)}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-2.5 px-3 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    const url = `${window.location.origin}/onboard/${client.name.toLowerCase().replace(/\s+/g, '-')}`;
                                                    navigator.clipboard.writeText(url);
                                                    toast.success("Sync Link Copied");
                                                }}
                                                className="h-7 w-7 p-0 rounded-lg bg-white/5 border border-white/5 text-white/20 hover:text-accent"
                                                title="Copy Link"
                                            >
                                                <LinkIcon className="w-3.5 h-3.5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => toast.info(`Managing ${client.name}`)}
                                                className="h-7 px-3 rounded-lg text-[9px] font-black uppercase tracking-widest text-white/30 hover:text-white hover:bg-white/10"
                                            >
                                                Manage
                                            </Button>
                                        </div>
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
