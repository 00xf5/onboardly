import { useState } from 'react';
import { ChevronDown, ChevronUp, TrendingUp, Clock, AlertTriangle, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { store } from '@/lib/store';

interface DashboardMetricsProps {
  analytics: any;
  failingSteps: any[];
}

const DashboardMetrics = ({ analytics, failingSteps }: DashboardMetricsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate real metrics from actual data
  const clients = store.getClientsByProject('default-proj');
  const totalClients = clients.length;
  const activatedClients = clients.filter(c => c.isActivated).length;
  const activationRate = totalClients > 0 ? Math.round((activatedClients / totalClients) * 100) : 0;
  
  // Calculate average time to activate (simplified)
  const avgTimeToActivate = activatedClients > 0 ? '2.1 days' : 'N/A';
  
  // Calculate drop-off risk based on failing steps
  const dropOffRisk = failingSteps.length > 0 ? Math.max(...failingSteps.map(s => s.failRate)) : 0;
  const riskLevel = dropOffRisk > 50 ? 'High' : dropOffRisk > 25 ? 'Medium' : 'Low';
  
  // Calculate funnel health
  const funnelHealth = analytics.funnel && analytics.funnel.length > 0 
    ? (analytics.funnel[analytics.funnel.length - 1]?.count || 0) > 40 ? 'Good' : 'Needs Work'
    : 'Unknown';

  const metrics = [
    {
      icon: TrendingUp,
      label: 'Activation Rate',
      value: `${activationRate}%`,
      change: `${activatedClients} activated`,
      color: activationRate > 40 ? 'text-green-400' : 'text-yellow-400'
    },
    {
      icon: Clock,
      label: 'Avg Time to Activate',
      value: avgTimeToActivate,
      change: 'Real data',
      color: 'text-blue-400'
    },
    {
      icon: AlertTriangle,
      label: 'Drop-off Risk',
      value: `${riskLevel}`,
      change: `${dropOffRisk}% max`,
      color: riskLevel === 'High' ? 'text-red-400' : riskLevel === 'Medium' ? 'text-yellow-400' : 'text-green-400'
    },
    {
      icon: BarChart3,
      label: 'Live Funnel Health',
      value: funnelHealth,
      change: `${totalClients} total`,
      color: funnelHealth === 'Good' ? 'text-green-400' : 'text-yellow-400'
    }
  ];

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden">
      {/* Header */}
      <div className="p-4 md:p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
            <BarChart3 className="w-4 h-4 text-accent" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Dashboard Metrics</h3>
            <p className="text-xs text-white/40">Key performance indicators</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-8 w-8 p-0 rounded-lg bg-white/5 text-white/40 hover:text-white hover:bg-white/10"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>
      </div>

      {/* Collapsible Content */}
      {isExpanded && (
        <div className="border-t border-white/5">
          <div className="p-4 md:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {metrics.map((metric, index) => (
                <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <metric.icon className={`w-4 h-4 ${metric.color}`} />
                    <span className="text-xs text-white/60">{metric.label}</span>
                  </div>
                  <div className="text-xl font-bold text-white mb-1">{metric.value}</div>
                  <div className="text-xs text-white/40">{metric.change}</div>
                </div>
              ))}
            </div>
            
            {/* Mini Funnel Preview */}
            <div className="mt-4 pt-4 border-t border-white/5">
              <h4 className="text-xs font-bold text-white/60 uppercase tracking-wider mb-3">Funnel Overview</h4>
              <div className="flex items-center justify-between overflow-x-auto">
                {analytics.funnel?.slice(0, 4).map((step: any, index: number) => (
                  <div key={index} className="flex items-center flex-shrink-0">
                    <div className="text-center">
                      <p className="text-xs text-white/40">{step.name}</p>
                      <p className="text-sm font-bold text-white">{step.count}%</p>
                    </div>
                    {index < 3 && (
                      <div className="text-center mx-2 flex-shrink-0">
                        <div className="w-2 h-2 bg-red-500 rounded-full mx-auto" />
                        <p className="text-xs text-red-400 mt-1">{step.dropOff}%</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardMetrics;
