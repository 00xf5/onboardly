import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle, XCircle, SkipForward } from 'lucide-react';

const RecentEvents = ({ user }: { user: any }) => {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.id) return;

    const syncEvents = async () => {
      const { collection, query, where, orderBy, limit, onSnapshot } = await import("firebase/firestore");
      const { db } = await import("@/lib/firebase");

      const q = query(
        collection(db, "events"),
        where("userId", "==", user.id),
        orderBy("timestamp", "desc"),
        limit(10)
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setEvents(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      });
      return unsubscribe;
    };

    let unsubscribe: any;
    syncEvents().then(unsub => unsubscribe = unsub);
    return () => unsubscribe && unsubscribe();
  }, []);

  const getEventIcon = (eventName: string) => {
    if (eventName.includes('completed')) return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (eventName.includes('failed')) return <XCircle className="w-4 h-4 text-red-500" />;
    if (eventName.includes('skipped')) return <SkipForward className="w-4 h-4 text-yellow-500" />;
    return <CheckCircle className="w-4 h-4 text-gray-500" />;
  };

  return (
    <div className="bg-card/40 backdrop-blur-3xl p-6 rounded-2xl border border-border mt-8">
      <h2 className="text-sm font-black text-foreground uppercase tracking-widest mb-6">Live Nexus Feed</h2>
      <div className="space-y-5">
        {events.length === 0 ? (
          <p className="text-[10px] text-muted-foreground italic uppercase tracking-tighter">Waiting for partner signals...</p>
        ) : (
          events.slice(0, 5).map((event) => (
            <div key={event.id} className="flex items-center justify-between group">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center transition-colors group-hover:bg-accent/10">
                  {getEventIcon(event.name)}
                </div>
                <div className="ml-3">
                  <p className="text-[11px] font-bold text-foreground group-hover:text-accent transition-colors">{event.name}</p>
                  <p className="text-[9px] text-muted-foreground/30 uppercase font-black tracking-tighter italic">Relay trace: {event.id.slice(0, 8)}</p>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground/40 font-medium italic">{formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentEvents;
