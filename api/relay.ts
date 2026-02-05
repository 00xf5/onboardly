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
            webhook: null,
            discord: null
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

        // 2. Handle Multi-Channel Re-Engagement (Email & Discord)

        // Channel A: Email (Resend)
        if (payload.clientEmail) {
            try {
                let subject = `Objective Accomplished: ${payload.taskTitle}`;
                let templateBody = `You have successfully completed the following task: <strong>${payload.taskTitle}</strong>`;
                let accentColor = '#f97316';

                if (event === 'reengagement_ping') {
                    subject = `Sequence Stalled: Action Required for ${payload.clientName}`;
                    templateBody = `Your onboarding sequence has stalled at <strong>${payload.taskTitle}</strong>. Resuming the sequence is critical for deployment.`;
                    accentColor = '#3b82f6';
                }

                const emailData = await resend.emails.send({
                    from: 'Onboardly Nexus <relay@resend.dev>',
                    to: payload.clientEmail,
                    subject: subject,
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 24px; background: #fafafa;">
                            <div style="text-align: center; margin-bottom: 20px;">
                                <div style="display: inline-block; padding: 10px; background: ${accentColor}; border-radius: 12px;">
                                    <span style="color: white; font-weight: 900; font-size: 20px; font-style: italic;">ONBOARDLY</span>
                                </div>
                            </div>
                            <h2 style="color: ${accentColor}; text-transform: uppercase; text-align: center; font-size: 18px; letter-spacing: 0.1em;">Mission Briefing</h2>
                            <p>Hello <strong>${payload.clientName}</strong>,</p>
                            <p>${templateBody}</p>
                            <div style="background: white; padding: 20px; border-radius: 16px; margin: 24px 0; border: 1px solid #eee; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                                <div style="font-size: 10px; color: #999; text-transform: uppercase; font-weight: 800; letter-spacing: 0.1em; margin-bottom: 8px;">Current Objective</div>
                                <strong style="font-size: 16px; color: #111;">${payload.taskTitle}</strong>
                                <div style="margin-top: 15px; height: 6px; background: #eee; border-radius: 3px; overflow: hidden;">
                                    <div style="height: 100%; width: ${payload.progress}%; background: ${accentColor};"></div>
                                </div>
                                <div style="margin-top: 8px; font-size: 11px; font-weight: 700; color: ${accentColor}; text-align: right;">Sync Velocity: ${payload.progress}%</div>
                            </div>
                            <div style="text-align: center; margin-top: 30px;">
                                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://onboardly.xyz'}/onboard/${payload.clientSlug || ''}" style="background: #111; color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: 900; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; display: inline-block;">Resume Nexus Sequence</a>
                            </div>
                            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
                            <p style="font-size: 10px; color: #aaa; text-align: center; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em;">© 2026 Onboardly Nexus Relay Subsystem</p>
                        </div>
                    `
                });
                results.email = { success: true, id: emailData.data?.id };
            } catch (error: any) {
                console.error('Email relay failed:', error);
                results.email = { success: false, error: error.message };
            }
        }

        // Channel B: Discord (Webhooks)
        if (payload.discordWebhookUrl) {
            try {
                const color = event === 'reengagement_ping' ? 3447003 : 16348438; // Blue vs Orange
                const discordRes = await fetch(payload.discordWebhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        embeds: [{
                            title: event === 'reengagement_ping' ? '🚨 STalled SEQUENCE DETECTED' : '✅ OBJECTIVE ACCOMPLISHED',
                            description: `**Client:** ${payload.clientName}\n**Task:** ${payload.taskTitle}\n**Progress:** ${payload.progress}%`,
                            color: color,
                            timestamp: new Date().toISOString(),
                            footer: { text: "Onboardly Sentinel Watchdog" }
                        }]
                    })
                });
                results.discord = { success: discordRes.ok };
            } catch (error: any) {
                console.error('Discord relay failed:', error);
                results.discord = { success: false, error: error.message };
            }
        }

        return res.status(200).json({ success: true, results });
    } catch (error: any) {
        console.error('Relay error:', error);
        return res.status(500).json({ error: error.message || 'Internal relay failure' });
    }
}
