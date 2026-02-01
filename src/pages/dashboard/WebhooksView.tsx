import React, { useState } from 'react';
import { toast } from 'sonner';

interface WebhooksViewProps {
  clients?: any[];
}

const WebhooksView = ({ clients = [] }: WebhooksViewProps) => {
  const [webhookUrl, setWebhookUrl] = useState(() => localStorage.getItem('onboardly_webhook_url') || '');

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setWebhookUrl(val);
    localStorage.setItem('onboardly_webhook_url', val);
  };

  const handleExport = () => {
    const headers = ['ID', 'Name', 'Email', 'Template', 'Progress', 'Status', 'CreatedAt'];
    const csvContent = [
      headers.join(','),
      ...clients.map(c => [c.id, c.name, c.email, c.template, c.progress, c.status, c.createdAt].join(','))
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
