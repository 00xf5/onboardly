export interface FailingStep {
  name: string;
  failRate: number;
}

const FailingSteps = ({ steps }: { steps: FailingStep[] }) => {
  const failingSteps = steps;

  return (
    <div className="bg-white/5 p-6 rounded-lg mb-8">
      <h2 className="text-lg font-bold text-white mb-4">⚠️ Failing Steps</h2>
      <div className="space-y-4">
        {failingSteps.map((step, index) => (
          <div key={index} className="flex items-center justify-between bg-white/5 p-4 rounded-lg">
            <p className="text-white">{index + 1}. {step.name}</p>
            <p className="text-red-500 font-bold">{step.failRate}% fail</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FailingSteps;
