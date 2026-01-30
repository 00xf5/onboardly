import { firestore } from './_firebase.js';

// SendGrid temporarily disabled — stubbed implementations below
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM = process.env.EMAIL_FROM || 'hello@onboardly.app';

if (SENDGRID_API_KEY) {
  console.warn('SENDGRID_API_KEY provided but SendGrid integration is disabled for now.');
}

export async function sendWelcomeEmail(client: any) {
  // Record a skipped transmission entry so UI can reflect an attempted send
  try {
    if (firestore) {
      await firestore.collection('transmissions').add({
        client: client.id || client.email,
        template: 'welcome',
        status: 'skipped',
        reason: 'sendgrid-disabled',
        sentAt: new Date().toISOString()
      });
    }
    return { ok: true, skipped: true };
  } catch (err: any) {
    console.error('sendWelcomeEmail (stub) error', err);
    return { ok: false, error: String(err) };
  }
}

export async function sendReminderEmail(client: any, task: any) {
  try {
    if (firestore) {
      await firestore.collection('transmissions').add({
        client: client.id || client.email,
        template: 'reminder',
        taskId: task.id,
        status: 'skipped',
        reason: 'sendgrid-disabled',
        sentAt: new Date().toISOString()
      });
    }
    return { ok: true, skipped: true };
  } catch (err: any) {
    console.error('sendReminderEmail (stub) error', err);
    return { ok: false, error: String(err) };
  }
}
