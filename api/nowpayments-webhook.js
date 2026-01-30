const crypto = require('crypto');
const { firestore } = require('./_firebase');

function verifySignature(secret, body, headerSignature) {
  if (!secret) return true;
  if (!headerSignature) return false;
  const hmac = crypto.createHmac('sha512', secret);
  hmac.update(body);
  const digest = hmac.digest('hex');
  return headerSignature.includes(digest) || digest.includes(headerSignature);
}

module.exports = async function (req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    const headerSig = req.headers['x-nowpayments-signature'] || req.headers['x-nowpayments-hook-signature'] || req.headers['x-hub-signature'];
    const secret = process.env.NOWPAYMENTS_WEBHOOK_SECRET;

    const ok = verifySignature(secret, rawBody, headerSig);
    if (!ok) {
      console.warn('NowPayments webhook signature verification failed');
      return res.status(401).json({ ok: false, error: 'Invalid signature' });
    }

    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const invoiceId = payload.id || (payload.payment && payload.payment.id);
    const status = payload.status;
    const order_id = payload.order_id || payload.ext_order_id || payload.orderId;

    if (!invoiceId) return res.status(400).json({ ok: false, error: 'Missing invoice id' });

    if (firestore) {
      const paymentRef = firestore.collection('payments').doc(String(invoiceId));
      const paymentDoc = await paymentRef.get();
      const paymentData = { status, updatedAt: new Date().toISOString(), raw: payload };
      if (paymentDoc.exists) {
        await paymentRef.update(paymentData);
      } else {
        await paymentRef.set({ invoiceId, status, raw: payload, createdAt: new Date().toISOString() });
      }

      if (['finished', 'confirmed', 'paid'].includes((status || '').toLowerCase())) {
        const clientId = order_id && String(order_id).split(':')[0];
        if (clientId) {
          const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString();
          await firestore.collection('subscriptions').doc(String(clientId)).set({ clientId, status: 'active', plan: 'premium', startsAt: new Date().toISOString(), expiresAt }, { merge: true });
          const clientRef = firestore.collection('clients').doc(String(clientId));
          const clientSnap = await clientRef.get();
          if (clientSnap.exists) {
            await clientRef.update({ plan: 'premium', planStatus: 'active', planExpiresAt: expiresAt });
          }
        }
      }
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error('webhook error', err);
    return res.status(500).json({ ok: false, error: String(err) });
  }
};
