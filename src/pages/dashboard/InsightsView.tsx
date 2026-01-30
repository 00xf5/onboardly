import { store } from '@/lib/store';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { AlertTriangle, TrendingUp, Zap, Info } from 'lucide-react';
import { Tooltip as UiTooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const InsightsView = () => {
  const activationTrend = store.getActivationRateTrend('default-proj');
  const recommendations = store.getRecommendations('default-proj');

  const getImpactIcon = (impact: 'high' | 'medium' | 'low') => {
    switch (impact) {
      case 'high': return <AlertTriangle className="w-5 h-5 text-accent" />;
      case 'medium': return <TrendingUp className="w-5 h-5 text-yellow-400" />;
      case 'low': return <Zap className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-10">
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center">Activation Rate Trend <UiTooltip><TooltipTrigger asChild><Info className="w-4 h-4 ml-2 text-white/30" /></TooltipTrigger><TooltipContent><p>Daily activation rate over the last 7 days.</p></TooltipContent></UiTooltip></h2>
          <div className="bg-white/5 p-4 rounded-lg h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activationTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6B4A" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#FF6B4A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="date" stroke="rgba(255, 255, 255, 0.3)" fontSize={12} />
                <YAxis stroke="rgba(255, 255, 255, 0.3)" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(26, 27, 35, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(4px)' }} />
                <Area type="monotone" dataKey="rate" stroke="#FF6B4A" strokeWidth={2} fillOpacity={1} fill="url(#colorRate)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Actionable Recommendations</h2>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="bg-white/[0.02] border border-white/5 p-5 rounded-xl flex items-start space-x-4 hover:border-accent/30 transition-colors group">
                <div className="bg-white/5 p-3 rounded-lg group-hover:bg-accent/10 transition-colors">{getImpactIcon(rec.impact)}</div>
                <div>
                  <h3 className="font-bold text-white group-hover:text-accent transition-colors">{rec.title}</h3>
                  <p className="text-sm text-white/40 mt-1">{rec.description}</p>
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
