export interface FailingStep {
  name: string;
  failRate: number;
}

const FailingSteps = ({ steps }: { steps: FailingStep[] }) => {
  const failingSteps = steps;

  return (
    <div className="bg-card/40 backdrop-blur-xl p-6 rounded-2xl border border-border mb-8 shadow-lg">
      <h2 className="text-sm font-black text-foreground uppercase tracking-widest mb-6">⚠️ Critical Friction Points</h2>
      <div className="space-y-4">
        {failingSteps.length === 0 ? (
          <p className="text-[10px] text-muted-foreground italic uppercase tracking-tighter">No critical friction detected in current flows.</p>
        ) : (
          failingSteps.map((step, index) => (
            <div key={index} className="flex items-center justify-between bg-muted/30 p-4 rounded-xl border border-red-500/10 hover:border-red-500/30 transition-all">
              <p className="text-[11px] font-bold text-foreground uppercase tracking-tighter">
                <span className="text-red-500 mr-2 opacity-50">{index + 1}.</span>
                {step.name}
              </p>
              <p className="text-[10px] text-red-500 font-black uppercase tracking-widest">{step.failRate}% failure</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FailingSteps;
