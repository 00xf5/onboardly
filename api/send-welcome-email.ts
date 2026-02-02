import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: any, res: any) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { email, name } = req.body;

        if (!email || !name) {
            return res.status(400).json({ error: 'Email and name are required' });
        }

        // Send welcome email
        const data = await resend.emails.send({
            from: 'Onboardly <onboarding@resend.dev>',
            to: email,
            subject: 'Welcome to Onboardly! 🎉',
            html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white;">
              
              <!-- Header with gradient -->
              <div style="background: linear-gradient(135deg, #f97316 0%, #fb923c 100%); padding: 40px 30px; text-align: center;">
                <h1 style="margin: 0; color: white; font-size: 32px; font-weight: 900; text-transform: uppercase; font-style: italic;">
                  Welcome to <span style="text-decoration: underline; text-decoration-color: rgba(255,255,255,0.3);">Onboardly</span>
                </h1>
              </div>
              
              <!-- Content -->
              <div style="padding: 40px 30px;">
                <h2 style="margin: 0 0 20px; font-size: 24px; font-weight: bold; color: #1a1a1a;">
                  Hey ${name}! 👋
                </h2>
                
                <p style="margin: 0 0 20px; color: #666; font-size: 16px; line-height: 1.6;">
                  Thanks for joining <strong>Onboardly</strong>! We're thrilled to have you on board. You're now part of a growing community that's transforming how teams onboard their partners and clients.
                </p>
                
                <p style="margin: 0 0 20px; color: #666; font-size: 16px; line-height: 1.6;">
                  Here's what you can do next:
                </p>
                
                <!-- Features list -->
                <div style="background-color: #f9fafb; border-left: 4px solid #f97316; padding: 20px; margin: 0 0 30px;">
                  <ul style="margin: 0; padding: 0 0 0 20px; color: #444;">
                    <li style="margin-bottom: 12px; font-size: 15px;">📋 Create your first onboarding flow</li>
                    <li style="margin-bottom: 12px; font-size: 15px;">🎨 Customize your templates</li>
                    <li style="margin-bottom: 12px; font-size: 15px;">🚀 Invite your team members</li>
                  </ul>
                </div>
                
                <!-- CTA Button -->
                <div style="text-align: center; margin: 0 0 30px;">
                  <a href="https://your-app-url.com/dashboard" 
                     style="display: inline-block; background-color: #f97316; color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px;">
                    Go to Dashboard →
                  </a>
                </div>
                
                <p style="margin: 0; color: #999; font-size: 14px; line-height: 1.6;">
                  Need help getting started? Just reply to this email, and our team will be happy to assist you!
                </p>
              </div>
              
              <!-- Footer -->
              <div style="background-color: #fafafa; padding: 30px; text-align: center; border-top: 1px solid #eee;">
                <p style="margin: 0 0 10px; color: #999; font-size: 12px;">
                  © 2026 Onboardly Nexus. All rights reserved.
                </p>
                <p style="margin: 0; color: #ccc; font-size: 11px;">
                  You received this email because you signed up for Onboardly.
                </p>
              </div>
              
            </div>
          </body>
        </html>
      `
        });

        return res.status(200).json({ success: true, data });
    } catch (error: any) {
        console.error('Email send error:', error);
        return res.status(500).json({ error: error.message || 'Failed to send email' });
    }
}
