import sgMail from '@sendgrid/mail';
import { firestore } from './_firebase';

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM = process.env.EMAIL_FROM || 'hello@onboardly.app';

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
} else {
  console.warn('SENDGRID_API_KEY not configured. Emails will not be sent.');
}

export async function sendWelcomeEmail(client: any) {
  if (!SENDGRID_API_KEY) return Promise.resolve({ ok: false, reason: 'sendgrid not configured' });
  const msg = {
    to: client.email,
    from: FROM,
    subject: `Welcome to Onboardly, ${client.name || ''}`,
    text: `Hi ${client.name || ''},\n\nThanks for starting the onboarding. Your tasks:\n${(client.tasks || []).map((t: any) => `- ${t.title}`).join('\n')}\n\nThanks,\nOnboardly`,
    html: `<p>Hi <strong>${client.name || ''}</strong>,</p><p>Thanks for starting the onboarding. Your tasks:</p><ul>${(client.tasks || []).map((t: any) => `<li>${t.title}</li>`).join('')}</ul><p>Thanks,<br/>Onboardly</p>`
  };
  try {
    await sgMail.send(msg);
    // record transmission
    if (firestore) {
      await firestore.collection('transmissions').add({
        client: client.id || client.email,
        template: 'welcome',
        status: 'sent',
        sentAt: new Date().toISOString()
      });
    }
    return { ok: true };
  } catch (err: any) {
    console.error('sendWelcomeEmail error', err);
    return { ok: false, error: err.message || String(err) };
  }
}

export async function sendReminderEmail(client: any, task: any) {
  if (!SENDGRID_API_KEY) return Promise.resolve({ ok: false, reason: 'sendgrid not configured' });
  const msg = {
    to: client.email,
    from: FROM,
    subject: `Reminder: ${task.title} - ${client.name || ''}`,
    text: `Hi ${client.name || ''},\n\nThis is a friendly reminder to complete: ${task.title}.\n\nThanks,\nOnboardly`,
    html: `<p>Hi <strong>${client.name || ''}</strong>,</p><p>This is a friendly reminder to complete: <strong>${task.title}</strong>.</p><p>Thanks,<br/>Onboardly</p>`
  };
  try {
    await sgMail.send(msg);
    if (firestore) {
      await firestore.collection('transmissions').add({
        client: client.id || client.email,
        template: 'reminder',
        taskId: task.id,
        status: 'sent',
        sentAt: new Date().toISOString()
      });
    }
    return { ok: true };
  } catch (err: any) {
    console.error('sendReminderEmail error', err);
    return { ok: false, error: err.message || String(err) };
  }
}
