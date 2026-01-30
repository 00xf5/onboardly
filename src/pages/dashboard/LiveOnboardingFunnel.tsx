import { FunnelStepAnalytics } from '@/lib/store';
import { ArrowDown } from 'lucide-react';

const LiveOnboardingFunnel = ({ funnel }: { funnel: FunnelStepAnalytics[] }) => {
  return (
    <div className="bg-white/5 p-4 md:p-6 rounded-lg mb-8 overflow-x-auto">
      <h2 className="text-lg font-bold text-white mb-4">Live Onboarding Funnel</h2>
      <div className="flex items-center justify-between min-w-max md:min-w-0">
        {funnel.map((step, index) => (
          <div key={index} className="flex items-center flex-shrink-0">
            <div className="text-center">
              <p className="text-xs md:text-sm text-white/50">{step.name}</p>
              <p className="text-lg md:text-2xl font-bold text-white">{step.count}%</p>
            </div>
            {index < funnel.length - 1 && (
              <div className="text-center mx-2 md:mx-4 flex-shrink-0">
                <ArrowDown className="w-3 h-3 md:w-4 md:h-4 text-red-500 mx-auto" />
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
