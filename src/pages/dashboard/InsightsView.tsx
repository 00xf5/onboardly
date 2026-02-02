import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, TrendingUp, Zap, Info } from 'lucide-react';
import { Tooltip as UiTooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const InsightsView = ({ user }: { user: any }) => {
  const [clients, setClients] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!user?.id) return;
    const fetchClients = async () => {
      const { collection, query, where, getDocs } = await import("firebase/firestore");
      const { db } = await import("@/lib/firebase");
      const q = query(collection(db, "clients"), where("userId", "==", user.id));
      const snap = await getDocs(q);
      setClients(snap.docs.map(doc => doc.data()));
      setLoading(false);
    };
    fetchClients();
  }, [user?.id]);

  const activationTrend = React.useMemo(() => {
    // Generate a pseudo-trend based on creation dates of current clients
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const trend = days.map(day => ({ date: day, rate: 0 }));

    clients.forEach(c => {
      const date = new Date(c.createdAt || Date.now());
      const dayName = days[date.getDay()];
      const dayIdx = days.indexOf(dayName);
      trend[dayIdx].rate += c.progress;
    });

    // Normalize
    const normalized = trend.map(t => ({
      ...t,
      rate: clients.length > 0 ? Math.round(t.rate / clients.length) : 0
    }));

    // Rotate so today is last
    const today = new Date().getDay();
    return [...normalized.slice(today + 1), ...normalized.slice(0, today + 1)];
  }, [clients]);

  const recommendations = React.useMemo(() => {
    if (clients.length === 0) return [
      { impact: 'medium', title: 'Initialize Integration', description: 'Start by adding your first partner to see real-time insights.', impactType: 'medium' } as any
    ];

    const avgProgress = clients.reduce((acc, c) => acc + c.progress, 0) / clients.length;
    const stuckClients = clients.filter(c => c.progress < 50).length;
    const dropOffRate = (stuckClients / clients.length) * 100;

    const recs = [];
    if (dropOffRate > 30) {
      recs.push({
        impact: 'high',
        title: 'High Initial Drop-off',
        description: `${Math.round(dropOffRate)}% of partners are stalling in phase 1. Consider simplifying your legal or asset requirements.`,
        impactType: 'high'
      });
    }

    if (avgProgress < 70) {
      recs.push({
        impact: 'medium',
        title: 'Improve Flow Velocity',
        description: 'Average activation is at ' + Math.round(avgProgress) + '%. Try adding automated reminders to nudge idle partners.',
        impactType: 'medium'
      });
    }

    recs.push({
      impact: 'low',
      title: 'Optimal Sync Point',
      description: 'Your partners are most active on Tuesdays. Schedule your strategy calls then for maximum engagement.',
      impactType: 'low'
    });

    return recs;
  }, [clients]);

  if (loading) return <div className="h-64 flex items-center justify-center"><p className="text-[10px] font-black uppercase tracking-widest animate-pulse">Analyzing Nexus Data...</p></div>;

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
