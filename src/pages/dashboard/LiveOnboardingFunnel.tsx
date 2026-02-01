import { ArrowDown } from 'lucide-react';

export interface FunnelStepAnalytics {
  name: string;
  count: number;
  dropOff: number;
  avgTime?: string;
}

const LiveOnboardingFunnel = ({ funnel }: { funnel: FunnelStepAnalytics[] }) => {
  return (
    <div className="bg-card/40 backdrop-blur-xl p-4 md:p-6 rounded-2xl border border-border mb-8 overflow-x-auto shadow-lg">
      <h2 className="text-sm font-black text-foreground uppercase tracking-widest mb-6">Live Activation Funnel</h2>
      <div className="flex items-center justify-between min-w-max md:min-w-0">
        {(funnel || []).map((step, index) => (
          <div key={index} className="flex items-center flex-shrink-0">
            <div className="text-center bg-muted/30 px-4 py-3 rounded-xl border border-border/50">
              <p className="text-[10px] uppercase font-black text-muted-foreground/40 mb-1">{step.name}</p>
              <p className="text-xl md:text-2xl font-black text-foreground italic">{step.count}%</p>
            </div>
            {index < funnel.length - 1 && (
              <div className="text-center mx-2 md:mx-6 flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 mb-1">
                  <ArrowDown className="w-4 h-4 text-red-500" />
                </div>
                <p className="text-[10px] font-black text-red-500/60 uppercase tracking-tighter">-{funnel[index + 1].dropOff}%</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveOnboardingFunnel;
