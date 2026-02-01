import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';

const UserSegments = () => {
  const segments = [
    { id: 'new_user', label: 'New Users' },
    { id: 'returning_inactive', label: 'Returning (Inactive)' },
    { id: 'power_user', label: 'Power Users' },
    { id: 'churn_risk', label: 'Churn Risk' },
  ];

  const [selectedSegments, setSelectedSegments] = useState<string[]>(['new_user']);

  const handleSegmentChange = (segmentId: string) => {
    setSelectedSegments(prev =>
      prev.includes(segmentId)
        ? prev.filter(id => id !== segmentId)
        : [...prev, segmentId]
    );
  };

  return (
    <div className="bg-card/40 backdrop-blur-xl p-6 rounded-2xl border border-border shadow-lg">
      <h2 className="text-sm font-black text-foreground uppercase tracking-widest mb-6">User Quadrants</h2>
      <div className="space-y-4">
        {segments.map((segment) => (
          <div key={segment.id} className="flex items-center group cursor-pointer" onClick={() => handleSegmentChange(segment.id)}>
            <Checkbox
              id={segment.id}
              checked={selectedSegments.includes(segment.id)}
              onCheckedChange={() => handleSegmentChange(segment.id)}
              className="border-muted-foreground/30 data-[state=checked]:bg-accent data-[state=checked]:border-accent"
            />
            <label htmlFor={segment.id} className="ml-3 block text-[11px] font-bold text-muted-foreground/60 group-hover:text-foreground transition-colors cursor-pointer uppercase tracking-tighter">
              {segment.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserSegments;
