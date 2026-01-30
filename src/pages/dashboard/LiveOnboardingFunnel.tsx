import { FunnelStepAnalytics } from '@/lib/store';
import { ArrowDown } from 'lucide-react';

const LiveOnboardingFunnel = ({ funnel }: { funnel: FunnelStepAnalytics[] }) => {
  return (
    <div className="bg-white/5 p-6 rounded-lg mb-8">
      <h2 className="text-lg font-bold text-white mb-4">Live Onboarding Funnel</h2>
      <div className="flex items-center justify-between">
        {funnel.map((step, index) => (
          <div key={index} className="flex items-center">
            <div className="text-center">
              <p className="text-sm text-white/50">{step.name}</p>
              <p className="text-2xl font-bold text-white">{step.count}%</p>
            </div>
            {index < funnel.length - 1 && (
              <div className="text-center mx-4">
                <ArrowDown className="w-4 h-4 text-red-500 mx-auto" />
                <p className="text-xs text-red-500 mt-1">{funnel[index + 1].dropOff}%</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveOnboardingFunnel;
