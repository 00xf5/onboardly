const axios = require('axios');
const { firestore } = require('./_firebase');

module.exports = async function (req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { clientId, plan } = req.body || {};
    if (!clientId || !plan) return res.status(400).json({ error: 'Missing clientId or plan' });

    const priceUsd = process.env.PRICE_USD_PREMIUM ? Number(process.env.PRICE_USD_PREMIUM) : 10;
    const currency = (process.env.CURRENCY || 'USD').toUpperCase();
    const amount = plan === 'premium' ? priceUsd : 0;

    const apiKey = process.env.NOWPAYMENTS_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'NOWPAYMENTS_API_KEY not configured' });

    const callbackHost = process.env.NOWPAYMENTS_IPN_CALLBACK_HOST || process.env.NOWPAYMENTS_WEBHOOK_HOST || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `https://example.com`;
    const ipn_callback_url = `${callbackHost.replace(/\/$/, '')}/api/nowpayments-webhook`;

    const nowpaymentsPayload = { price_amount: amount, price_currency: currency, order_id: `${clientId}:${Date.now()}`, ipn_callback_url, pay_currency: currency };

    const response = await axios.post('https://api.nowpayments.io/v1/invoice', nowpaymentsPayload, { headers: { 'x-api-key': apiKey } });
    const invoice = response.data;

    if (firestore) {
      await firestore.collection('payments').doc(String(invoice.id)).set({ invoice, clientId, plan, createdAt: new Date().toISOString(), status: invoice.status || 'pending' });
    }

    return res.json({ ok: true, invoice });
  } catch (err) {
    console.error('create-payment error', err.response?.data || err.message || err);
    return res.status(500).json({ error: err.response?.data || err.message || String(err) });
  }
};
