import { useState, useEffect } from 'react';
import { store } from '@/lib/store';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle, XCircle, SkipForward } from 'lucide-react';

const RecentEvents = () => {
  const [events, setEvents] = useState(() => store.getEventsForProject('default-proj'));

  useEffect(() => {
    const handler = () => setEvents(store.getEventsForProject('default-proj'));
    window.addEventListener('onboardly:events:updated', handler as EventListener);
    return () => window.removeEventListener('onboardly:events:updated', handler as EventListener);
  }, []);

  const getEventIcon = (eventName: string) => {
    if (eventName.includes('completed')) return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (eventName.includes('failed')) return <XCircle className="w-4 h-4 text-red-500" />;
    if (eventName.includes('skipped')) return <SkipForward className="w-4 h-4 text-yellow-500" />;
    return <CheckCircle className="w-4 h-4 text-gray-500" />;
  };

  return (
    <div className="bg-white/5 p-6 rounded-lg mt-8">
      <h2 className="text-lg font-bold text-white mb-4">Recent Events</h2>
      <div className="space-y-4">
        {events.slice(0, 5).map((event) => (
          <div key={event.id} className="flex items-center justify-between">
            <div className="flex items-center">
              {getEventIcon(event.name)}
              <p className="ml-3 text-white text-sm">{event.name}</p>
            </div>
            <p className="text-sm text-white/50">{formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentEvents;
