import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, TrendingUp, Zap, Info } from 'lucide-react';
import { Tooltip as UiTooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const InsightsView = ({ user }: { user: any }) => {
  const activationTrend = [
    { date: 'Mon', rate: 45 },
    { date: 'Tue', rate: 52 },
    { date: 'Wed', rate: 48 },
    { date: 'Thu', rate: 61 },
    { date: 'Fri', rate: 55 },
    { date: 'Sat', rate: 67 },
    { date: 'Sun', rate: 72 },
  ];

  const recommendations = [
    { impact: 'high', title: 'Automate Doc Verification', description: 'Clients are spending 45% of their time in the "Legal" stage. Automating PDF parsing could reduce activation time by 2 days.', impactType: 'high' } as any,
    { impact: 'medium', title: 'Increase Engagement on Step 2', description: 'Step 2 has a 25% drop-off. Consider adding a video guide to explain the technical setup.', impactType: 'medium' },
    { impact: 'low', title: 'Optimize Email Timing', description: 'Emails sent at 10 AM local time have a 15% higher open rate.', impactType: 'low' }
  ];

  const getImpactIcon = (impact: 'high' | 'medium' | 'low') => {
    switch (impact) {
      case 'high': return <AlertTriangle className="w-5 h-5 text-accent" />;
      case 'medium': return <TrendingUp className="w-5 h-5 text-yellow-400" />;
      case 'low': return <Zap className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-10 animate-in fade-in duration-500">
        <div>
          <h2 className="text-sm font-black text-foreground uppercase tracking-widest mb-6 flex items-center">
            Activation Rate Trend
            <UiTooltip>
              <TooltipTrigger asChild>
                <Info className="w-3.5 h-3.5 ml-2 text-muted-foreground/30 hover:text-accent transition-colors cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent className="bg-card border-border text-foreground">
                <p className="text-[10px] uppercase font-black tracking-widest">Daily activation rate over the last 7 days.</p>
              </TooltipContent>
            </UiTooltip>
          </h2>
          <div className="bg-card/95 dark:bg-card/40 backdrop-blur-xl p-6 rounded-2xl border border-border h-80 shadow-lg">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activationTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-muted-foreground/5" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="currentColor"
                  className="text-muted-foreground/30"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  stroke="currentColor"
                  className="text-muted-foreground/30"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  dx={-10}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Area type="monotone" dataKey="rate" stroke="hsl(var(--accent))" strokeWidth={3} fillOpacity={1} fill="url(#colorRate)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-black text-foreground uppercase tracking-widest mb-6">Actionable Recommendations</h2>
          <div className="grid gap-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="bg-card/95 dark:bg-card/40 backdrop-blur-xl border border-border p-5 rounded-2xl flex items-start space-x-4 hover:border-accent/30 transition-all duration-300 group shadow-sm hover:shadow-md">
                <div className="bg-muted p-3 rounded-xl group-hover:bg-accent/10 transition-colors">
                  {getImpactIcon(rec.impact)}
                </div>
                <div className="flex-1">
                  <h3 className="text-xs font-black text-foreground uppercase tracking-tight group-hover:text-accent transition-colors">{rec.title}</h3>
                  <p className="text-[11px] text-muted-foreground/60 mt-1 font-medium leading-relaxed">{rec.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default InsightsView;
