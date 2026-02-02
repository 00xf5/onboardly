/**
 * Dispatches an event to the Vercel Relay API for email and webhook processing.
 */
export async function triggerRelay(params: {
    event: string;
    payload: any;
    userId: string;
    webhookUrl?: string | null;
}) {
    try {
        const response = await fetch('/api/relay', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params),
        });

        const data = await response.json();

        if (!response.ok) {
            console.warn('Relay partial failure:', data.error);
        }

        return data;
    } catch (error) {
        console.error('Relay dispatch error:', error);
        return { success: false, error };
    }
}
