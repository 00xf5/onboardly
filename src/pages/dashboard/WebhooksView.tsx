import React, { useState } from 'react';
import { toast } from 'sonner';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface WebhooksViewProps {
  clients?: any[];
}

const WebhooksView = ({ clients = [] }: WebhooksViewProps) => {
  const [webhookUrl, setWebhookUrl] = useState(() => localStorage.getItem('onboardly_webhook_url') || '');

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setWebhookUrl(val);
    localStorage.setItem('onboardly_webhook_url', val);
  };

  const handleExport = () => {
    const headers = ['ID', 'Name', 'Email', 'Template', 'Progress', 'Status', 'CreatedAt'];
    const csvContent = [
      headers.join(','),
      ...clients.map(c => [c.id, c.name, c.email, c.template, c.progress, c.status, c.createdAt].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'onboardly-clients.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Client data exported.');
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="space-y-1">
        <h2 className="text-sm font-black text-foreground uppercase tracking-widest">External Synchronization</h2>
        <p className="text-[10px] text-muted-foreground/30 font-black uppercase tracking-[0.2em]">Configuring outbound data relays</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-card/95 dark:bg-card/40 backdrop-blur-xl p-8 rounded-2xl border border-border shadow-lg space-y-6">
          <div className="space-y-2">
            <h3 className="text-xs font-black text-foreground uppercase tracking-tight">Webhook Configuration</h3>
            <p className="text-[10px] text-muted-foreground/40 font-medium">Transmit activation signals to your infrastructure</p>
          </div>

          <div className="space-y-3">
            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 ml-1">Relay Endpoint (URL)</label>
            <Input
              type="text"
              placeholder="https://api.nexus.io/v1/webhook"
              className="bg-muted h-11 text-xs rounded-xl border-none shadow-inner"
              value={webhookUrl}
              onChange={handleUrlChange}
            />
            <p className="text-[8px] text-muted-foreground/20 italic font-medium px-1">Active listener: POST application/json</p>
          </div>
        </div>

        <div className="bg-card/95 dark:bg-card/40 backdrop-blur-xl p-8 rounded-2xl border border-border shadow-lg flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-xs font-black text-foreground uppercase tracking-tight">Data Extraction</h3>
            <p className="text-[10px] text-muted-foreground/40 font-medium">Export operational telemetry for offline analysis</p>
          </div>

          <Button
            onClick={handleExport}
            className="w-full h-11 rounded-xl bg-accent text-white font-black uppercase text-[10px] tracking-widest shadow-glow hover:bg-accent/90 transition-all mt-6"
          >
            Generate CSV Manifest
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WebhooksView;
