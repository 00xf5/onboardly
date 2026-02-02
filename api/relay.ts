import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { event, payload, userId, webhookUrl } = req.body;

        if (!event || !payload || !userId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const results: any = {
            email: null,
            webhook: null
        };

        // 1. Handle Webhook Relay
        if (webhookUrl) {
            try {
                const webhookRes = await fetch(webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        event,
                        timestamp: new Date().toISOString(),
                        data: payload
                    })
                });
                results.webhook = { success: webhookRes.ok, status: webhookRes.status };
            } catch (error: any) {
                console.error('Webhook relay failed:', error);
                results.webhook = { success: false, error: error.message };
            }
        }

        // 2. Handle Email Relay (e.g. on Task Completion)
        if (event === 'task_completed' && payload.clientEmail) {
            try {
                const emailData = await resend.emails.send({
                    from: 'Onboardly <relay@resend.dev>',
                    to: payload.clientEmail,
                    subject: `Objective Accomplished: ${payload.taskTitle}`,
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
                            <h2 style="color: #f97316; text-transform: uppercase;">Objective Accomplished</h2>
                            <p>Hello <strong>${payload.clientName}</strong>,</p>
                            <p>You have successfully completed the following task in your onboarding sequence:</p>
                            <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f97316;">
                                <strong style="font-size: 18px;">${payload.taskTitle}</strong>
                            </div>
                            <p>Tracking progress: <strong>${payload.progress}%</strong></p>
                            <p>The Nexus is synchronizing your next phases. Stay tuned.</p>
                            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                            <p style="font-size: 12px; color: #999;">© 2026 Onboardly Nexus Relay</p>
                        </div>
                    `
                });
                results.email = { success: true, id: emailData.data?.id };
            } catch (error: any) {
                console.error('Email relay failed:', error);
                results.email = { success: false, error: error.message };
            }
        }

        return res.status(200).json({ success: true, results });
    } catch (error: any) {
        console.error('Relay error:', error);
        return res.status(500).json({ error: error.message || 'Internal relay failure' });
    }
}
