import React, { useMemo } from "react";
import { Search, Plus, MoreVertical, Filter, SlidersHorizontal, ArrowUpRight, Link as LinkIcon, Copy } from "lucide-react";
import { FixedSizeList } from 'react-window';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

import useDebounce from "@/hooks/use-debounce";

interface ClientsViewProps {
    clients: any[];
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    setIsNewClientDialogOpen: (open: boolean) => void;
    getStatusIcon: (status: string) => React.ReactNode;
    getStatusLabel: (status: string) => string;
    onManageClient?: (client: any) => void;
}

export const ClientsView = React.memo(function ClientsView({
    clients,
    searchQuery,
    setSearchQuery,
    setIsNewClientDialogOpen,
    getStatusIcon,
    getStatusLabel,
    onManageClient
}: ClientsViewProps) {
    const debouncedQuery = useDebounce(searchQuery, 250);

    const filteredClients = useMemo(() => clients.filter(c =>
        c.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(debouncedQuery.toLowerCase())
    ), [clients, debouncedQuery]);

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
            {/* 🔮 Control Bar */}
            <div className="bg-card/40 backdrop-blur-3xl rounded-xl border border-border p-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-xs group">
                    <Search className="w-3 h-3 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors" />
                    <input
                        placeholder="Scan Partners..."
                        className="w-full bg-muted/30 border-border rounded-lg h-8 text-[11px] pl-9 pr-4 text-foreground focus:outline-none focus:ring-1 focus:ring-accent/40 placeholder:text-muted-foreground/30"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toast.info("Filter Matrix Engaged")}
                        className="h-8 rounded-lg bg-muted border border-border px-2.5 text-[10px] uppercase font-black tracking-widest text-muted-foreground hover:text-foreground"
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
            <div className="bg-card/40 backdrop-blur-3xl rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto p-1.5">
                    <div className="w-full text-left">
                        <div className="text-muted-foreground/50 uppercase tracking-[0.2em] text-[8px] font-black border-b border-border/50 grid grid-cols-5 py-3 px-3">
                            <div>Entity</div>
                            <div>Strategy</div>
                            <div>Velocity</div>
                            <div>State</div>
                            <div className="text-right">Relay</div>
                        </div>

                        <div style={{ height: Math.min(400, filteredClients.length * 72) }}>
                            <FixedSizeList
                                height={Math.min(400, filteredClients.length * 72)}
                                itemCount={filteredClients.length}
                                itemSize={72}
                                width="100%"
                            >
                                {({ index, style }) => {
                                    const client = filteredClients[index];
                                    return (
                                        <div style={style} key={client.id} className="grid grid-cols-5 items-center gap-4 px-3 hover:bg-muted/10 transition-colors">
                                            <div className="py-2.5">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="w-7 h-7 rounded-lg ring-1 ring-border group-hover:ring-accent/30 transition-all">
                                                        <AvatarFallback className="bg-muted text-muted-foreground font-black text-[8px]">
                                                            {client.name.split(' ').map((n: string) => n[0]).join('')}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="min-w-0">
                                                        <p className="text-[11px] font-bold text-foreground group-hover:text-accent transition-colors">{client.name}</p>
                                                        <p className="text-[9px] text-muted-foreground truncate leading-tight mt-0.5 uppercase tracking-tighter">{client.email}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="py-2.5">
                                                <span className="text-[9px] font-bold text-muted-foreground bg-muted border border-border px-2 py-0.5 rounded-md">
                                                    {client.template}
                                                </span>
                                            </div>
                                            <div className="py-2.5">
                                                <div className="flex items-center gap-2 w-28">
                                                    <div className="h-0.5 flex-1 bg-muted rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-accent shadow-glow transition-all duration-1000 ease-out"
                                                            style={{ width: `${client.progress}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-[9px] font-black text-foreground italic tracking-tighter">{client.progress}%</span>
                                                </div>
                                            </div>
                                            <div className="py-2.5">
                                                <div className="flex items-center gap-1.5 px-2 py-1 bg-muted rounded-md w-fit border border-border">
                                                    {getStatusIcon(client.status)}
                                                    <span className="text-[8px] font-black uppercase text-muted-foreground tracking-widest leading-none">
                                                        {getStatusLabel(client.status)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="py-2.5 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            const url = `${window.location.origin}/onboard/${client.slug}`;
                                                            navigator.clipboard.writeText(url);
                                                            toast.success("Invitation Link Copied", {
                                                                description: `Send this to ${client.name} to start onboarding.`
                                                            });
                                                        }}
                                                        className="h-8 px-3 rounded-lg bg-accent/5 border border-accent/10 text-accent hover:bg-accent hover:text-white transition-all gap-2 text-[10px] font-black uppercase"
                                                    >
                                                        <LinkIcon className="w-3.5 h-3.5" />
                                                        Invite
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            if (onManageClient) {
                                                                onManageClient(client);
                                                            } else {
                                                                // Fallback if no handler provided
                                                                toast.info(`Managing ${client.name}`);
                                                            }
                                                        }}
                                                        className="h-7 px-3 rounded-lg text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-muted"
                                                    >
                                                        Manage
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }}
                            </FixedSizeList>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});
