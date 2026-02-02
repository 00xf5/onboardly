import { Terminal, Code2, Rocket, Zap, Shield, Globe, Cpu, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const IntegrationView = () => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Configuration Copied to Clipboard");
  };

  const scriptSnippet = `<script 
  src="${window.location.origin}/widget-loader.js" 
  data-onboardly-id="YOUR_PARTNER_SLUG"
></script>`;

  const relaySchema = `{
  "event": "task_completed",
  "userId": "admin_nexus_uuid",
  "payload": {
    "clientName": "Jane Cooper",
    "taskTitle": "Domain Configuration",
    "progress": 75,
    "clientId": "cx_9921"
  }
}`;

  return (
    <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header Hero */}
      <div className="relative p-10 bg-card/40 backdrop-blur-3xl rounded-[2.5rem] border border-border shadow-2xl overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[120px] rounded-full" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-black text-foreground uppercase italic tracking-tight mb-4">Command Gateway</h1>
            <p className="text-muted-foreground/60 text-sm font-medium leading-relaxed">
              Initialize the Onboardly Nexus within your own infrastructure. Bridge the gap between your product core and the activation sequence logic.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="h-12 px-6 rounded-2xl border-border bg-card/50 text-[10px] font-black uppercase tracking-widest gap-2">
              <Terminal className="w-4 h-4" />
              API Specs
            </Button>
            <Button className="h-12 px-6 rounded-2xl bg-accent text-white shadow-glow text-[10px] font-black uppercase tracking-widest gap-2">
              <Rocket className="w-4 h-4" />
              Live Test
            </Button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* 1. Trojan Horse Widget */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="p-2 bg-success/10 rounded-lg">
              <Globe className="w-4 h-4 text-success" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-widest text-foreground">Trojan Horse Widget</h3>
          </div>
          <div className="bg-card/40 backdrop-blur-3xl p-8 rounded-[2rem] border border-border space-y-6">
            <p className="text-[11px] text-muted-foreground/60 font-medium">
              Embed the Onboardly HUD directly into your React, Vue, or Vanilla JS environment. It renders as a non-intrusive floating activator.
            </p>
            <div className="relative group">
              <pre className="p-5 bg-black/40 rounded-2xl border border-white/5 font-mono text-[10px] leading-relaxed text-accent/80 overflow-x-auto">
                {scriptSnippet}
              </pre>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(scriptSnippet)}
                className="absolute top-3 right-3 h-7 bg-white/5 hover:bg-white/10 text-[8px] font-black uppercase tracking-widest"
              >
                Copy Snippet
              </Button>
            </div>
          </div>
        </div>

        {/* 2. Nexus Relay Subsystem */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Zap className="w-4 h-4 text-accent" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-widest text-foreground">Nexus Relay (Webhooks)</h3>
          </div>
          <div className="bg-card/40 backdrop-blur-3xl p-8 rounded-[2rem] border border-border space-y-6">
            <p className="text-[11px] text-muted-foreground/60 font-medium">
              Outbound telemetry signals. We push real-time event payloads to your configured endpoint whenever a partner completes an objective.
            </p>
            <div className="relative group">
              <pre className="p-5 bg-black/40 rounded-2xl border border-white/5 font-mono text-[10px] leading-relaxed text-success/70 overflow-x-auto">
                {relaySchema}
              </pre>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(relaySchema)}
                className="absolute top-3 right-3 h-7 bg-white/5 hover:bg-white/10 text-[8px] font-black uppercase tracking-widest"
              >
                Copy Schema
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. AI & Advanced Logic */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-orange-500/5 p-8 rounded-3xl border border-orange-500/10 group hover:border-orange-500/30 transition-all duration-500">
          <Sparkles className="w-5 h-5 text-orange-500 mb-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-orange-500 mb-2">AI Forge Subsystem</h4>
          <p className="text-[11px] text-muted-foreground/60 leading-relaxed italic">
            Programmatically generate onboarding sequences based on product URL analysis via the automated Sequence API.
          </p>
        </div>

        <div className="bg-success/5 p-8 rounded-3xl border border-success/10 group hover:border-success/30 transition-all duration-500">
          <Shield className="w-5 h-5 text-success mb-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-success mb-2">Ghost Nudge Logic</h4>
          <p className="text-[11px] text-muted-foreground/60 leading-relaxed italic">
            Enable automated retention loops. Partners who stagnate for &gt;48h are automatically re-activated via re-engagement signals.
          </p>
        </div>

        <div className="bg-accent/5 p-8 rounded-3xl border border-accent/10 group hover:border-accent/30 transition-all duration-500">
          <Code2 className="w-5 h-5 text-accent mb-4" />
          <h4 className="text-[10px] font-black uppercase tracking-widest text-accent mb-2">REST Gateway</h4>
          <p className="text-[11px] text-muted-foreground/60 leading-relaxed italic">
            Direct cloud access to the Nexus Registry. Perform CRUD operations on clients and blueprints through secure bearer authentication.
          </p>
        </div>
      </div>

      {/* Footer Note */}
      <div className="flex items-center justify-center gap-4 pt-10 border-t border-border">
        <div className="flex items-center gap-1.5 grayscale opacity-50">
          <Cpu className="w-4 h-4" />
          <span className="text-[9px] font-black uppercase tracking-widest">Protocol v2.4.0 (Synchronized)</span>
        </div>
      </div>
    </div>
  );
};

export default IntegrationView;
