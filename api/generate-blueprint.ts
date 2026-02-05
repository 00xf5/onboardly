export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { url, description } = req.body;

        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        
        // If no API key, return high-performance mock data
        if (!GEMINI_API_KEY) {
            console.warn('GEMINI_API_KEY not found, returning mock blueprint');
            const mockTasks = [
                { title: "Initialize Security Protocols", type: "Tech" },
                { title: "Review Master Service Agreement", type: "Legal" },
                { title: "Upload Brand Identity Assets", type: "Assets" },
                { title: "Sync Neural Gateway Context", type: "Tech" },
                { title: "Execute Final Strategy Sync", type: "Meeting" }
            ];
            return res.status(200).json({ success: true, tasks: mockTasks });
        }

        const prompt = `
            You are a SaaS Growth Engineer. Analyze this product/URL: ${url}
            ${description ? `Context: ${description}` : ''}
            
            Generate a high-performance 5-step onboarding sequence designed to reduce time-to-value.
            Each step must have a title and a type (Legal, Assets, Tech, Meeting, or Profile).
            
            Return ONLY a valid JSON array of objects with the following structure:
            [
                {"title": "Step Name", "type": "Legal"},
                ...
            ]
        `;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.7,
                    response_mime_type: "application/json",
                }
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'AI Generation failed');
        }

        const content = data.candidates[0].content.parts[0].text;
        const tasks = JSON.parse(content);

        return res.status(200).json({ success: true, tasks });
    } catch (error: any) {
        console.error('AI Blueprint Error:', error);
        return res.status(500).json({ error: error.message });
    }
}

