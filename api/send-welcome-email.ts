import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, name } = req.body;
    const testTarget = "chiyoalice84@gmail.com";
    const isTest = email === testTarget;

    const { data, error } = await resend.emails.send({
      from: 'Onboardly Nexus <relay@resend.dev>',
      to: isTest ? [testTarget] : [email],
      subject: isTest ? 'Nexus Relay Test: SUCCESS' : `Welcome to Onboardly, ${name}`,
      html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #eee; border-radius: 32px; background: #ffffff; text-align: center;">
                    <div style="margin-bottom: 30px;">
                        <div style="display: inline-block; padding: 12px 24px; background: #f97316; border-radius: 16px; box-shadow: 0 8px 24px rgba(249, 115, 22, 0.2);">
                            <span style="color: white; font-weight: 900; font-size: 24px; font-style: italic; letter-spacing: -0.02em;">ONBOARDLY</span>
                        </div>
                    </div>
                    
                    <h1 style="color: #111; font-size: 28px; font-weight: 900; margin-bottom: 16px; text-transform: uppercase; italic; letter-spacing: -0.02em;">
                        ${isTest ? 'System Verification' : 'Welcome to the Nexus'}
                    </h1>
                    
                    <p style="color: #666; font-size: 16px; line-height: 1.6; margin-bottom: 32px;">
                        ${isTest
          ? 'The Nexus Relay Subsystem has successfully established a secure link with your neural address.'
          : `Hello ${name}, your operational command center is now synchronized and ready for deployment.`}
                    </p>

                    <div style="background: #f9fafb; border-radius: 24px; padding: 30px; margin-bottom: 32px; border: 1px solid #f1f5f9;">
                        <div style="font-size: 10px; font-weight: 900; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 12px;">Operational Status</div>
                        <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                            <span style="width: 8px; height: 8px; background: #10b981; border-radius: 50%; display: inline-block;"></span>
                            <span style="font-weight: 800; font-size: 14px; color: #10b981; text-transform: uppercase; letter-spacing: 0.05em;">All Systems Nominal</span>
                        </div>
                    </div>

                    <a href="https://onboardly.xyz/dashboard" style="display: inline-block; background: #111; color: #fff; padding: 18px 36px; border-radius: 16px; text-decoration: none; font-weight: 900; font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em; transition: all 0.3s ease;">
                        Access Command Gateway
                    </a>

                    <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #f1f5f9;">
                        <p style="font-size: 10px; color: #cbd5e1; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin: 0;">
                            Protocol v2.4.0 • Region: US-EAST
                        </p>
                    </div>
                </div>
            `
    });

    if (error) {
      return res.status(400).json({ error });
    }

    return res.status(200).json({ success: true, id: data?.id });
  } catch (error: any) {
    console.error('Email error:', error);
    return res.status(500).json({ error: error.message });
  }
}
