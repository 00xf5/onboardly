/**
 * Send welcome email to new user via Resend API
 * @param email User's email address
 * @param name User's full name
 * @returns Promise with send result
 */
export async function sendWelcomeEmail(email: string, name: string): Promise<{ success: boolean; error?: string }> {
    try {
        const response = await fetch('/api/send-welcome-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, name }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to send welcome email');
        }

        return { success: true };
    } catch (error: any) {
        console.error('Welcome email error:', error);
        // Don't fail signup if email fails - just log it
        return { success: false, error: error.message };
    }
}
