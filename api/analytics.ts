import type { VercelRequest, VercelResponse } from '@vercel/node';

// Simple in-memory cache (warm instances only) with TTL
let cache: { ts: number; data: any } | null = null;
const TTL = 30 * 1000; // 30s cache

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Serve cached if fresh
    if (cache && Date.now() - cache.ts < TTL) {
      return res.json({ ok: true, source: 'cache', data: cache.data });
    }

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
        auth: { persistSession: false }
      });

      // Aggregations: clients count, active clients, avg completion
      const { data: clients, error: clientsErr } = await supabase.from('clients').select('id,progress,status');
      if (clientsErr) throw clientsErr;

      const total = clients.length;
      const active = clients.filter((c: any) => c.status === 'in_progress').length;
      const avg = total ? Math.round(clients.reduce((s: any, c: any) => s + (c.progress || 0), 0) / total) : 0;

      const result = { total, active, avg };
      cache = { ts: Date.now(), data: result };
      return res.json({ ok: true, source: 'supabase', data: result });
    }

    // Fallback: use localStorage-like store via reading from local file (not available in serverless), so return a generic response
    const result = { total: 0, active: 0, avg: 0, note: 'No SUPABASE config - enable SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY' };
    cache = { ts: Date.now(), data: result };
    return res.json({ ok: true, source: 'fallback', data: result });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message || String(err) });
  }
}