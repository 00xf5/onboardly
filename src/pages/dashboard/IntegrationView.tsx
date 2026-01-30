const IntegrationView = () => {
  const jsSnippet = `<script>
  (function() {
    var d = document, s = d.createElement('script');
    s.src = 'https://cdn.onboardly.dev/widget.js';
    s.setAttribute('data-project-id', 'YOUR_PROJECT_ID');
    d.body.appendChild(s);
  })();
</script>`;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dev-First Integration</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white/50">JavaScript Snippet</label>
          <textarea readOnly className="w-full bg-white/5 p-2 rounded-lg mt-1 font-mono text-sm" rows={8} value={jsSnippet} />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/50">User ID Mapping</label>
          <p className="text-sm text-white/70 mt-1">To identify users, call <code className="bg-white/10 p-1 rounded">onboardly.identify('USER_ID')</code>.</p>
        </div>
      </div>
    </div>
  );
};

export default IntegrationView;
