import { useState, useEffect } from 'react';
import { store } from '@/lib/store';
import { toast } from 'sonner';

const WebhooksView = () => {
  const [webhookUrl, setWebhookUrl] = useState(() => store.getWebhookUrl());

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWebhookUrl(e.target.value);
    store.saveWebhookUrl(e.target.value);
    toast.success('Webhook URL saved.');
  };

  const handleExport = () => {
    const clients = store.getClients();
    const headers = ['ID', 'Name', 'Email', 'Template', 'Progress', 'Status', 'Last Activity'];
    const csvContent = [
      headers.join(','),
      ...clients.map(c => [c.id, c.name, c.email, c.template, c.progress, c.status, c.lastActivity].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'onboardly-clients.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Client data exported.');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Webhooks & Export</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white/50">Webhook on Activation</label>
          <input 
            type="text" 
            placeholder="https://your-webhook-url.com" 
            className="w-full bg-white/5 p-2 rounded-lg mt-1" 
            value={webhookUrl}
            onChange={handleUrlChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/50">Export to CSV</label>
          <button onClick={handleExport} className="mt-2 bg-accent text-white px-4 py-2 rounded-lg text-sm font-bold">Export Data</button>
        </div>
      </div>
    </div>
  );
};

export default WebhooksView;
