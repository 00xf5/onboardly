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
    <div className="bg-white/5 p-6 rounded-lg">
      <h2 className="text-lg font-bold text-white mb-4">Segments</h2>
      <div className="space-y-4">
        {segments.map((segment) => (
          <div key={segment.id} className="flex items-center">
            <Checkbox
              id={segment.id}
              checked={selectedSegments.includes(segment.id)}
              onCheckedChange={() => handleSegmentChange(segment.id)}
            />
            <label htmlFor={segment.id} className="ml-3 block text-sm text-white">
              {segment.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserSegments;
