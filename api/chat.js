export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*'); // Adjust for production if needed
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { userInput } = req.body;

    if (!userInput) {
        return res.status(400).json({ error: 'User input is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('GEMINI_API_KEY environment variable is not set');
        return res.status(500).json({ error: 'API key not configured on server' });
    }

    const models = ['gemini-flash-latest', 'gemini-pro-latest'];
    const apiVersions = ['v1beta', 'v1'];

    const prompt = `You are a helpful and friendly chatbot on Rudra Pratap Singh's portfolio website. Your name is RudraBot. Please answer the user's question based on the provided context about Rudra, or from your general knowledge if the question is not about Rudra. Keep your answers concise and engaging.

Context about Rudra Pratap Singh:
- He is an AI/ML enthusiast and creative developer.
- His skills include Frontend (React, Next.js, Tailwind CSS), Backend (Node.js, Express, Python, FastAPI, PostgreSQL, MongoDB), Design Tools (Figma, Adobe XD), and Programming Languages (Python, Java, C++).
- His email is rudrasingh14513@gmail.com.
- He is passionate about exploring emerging tech and crafting designs that connect people in smarter ways.
- If the user's question can be answered by the context provided, please use it. Otherwise, use your general knowledge.

User's question: "${userInput}"

Your answer:`;

    const requestBody = {
        contents: [{ parts: [{ text: prompt }] }],
    };

    let lastError = null;

    for (const version of apiVersions) {
        for (const model of models) {
            try {
                const API_URL = `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent?key=${apiKey}`;
                
                const apiResponse = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestBody),
                });

                if (!apiResponse.ok) {
                    const errorData = await apiResponse.json().catch(() => ({}));
                    const errorMsg = errorData.error?.message || 'Unknown API error';
                    throw new Error(`API Error (${apiResponse.status}): ${errorMsg}`);
                }

                const data = await apiResponse.json();

                if (data.candidates && data.candidates.length > 0 && data.candidates[0].content?.parts?.[0]?.text) {
                    const botResponse = data.candidates[0].content.parts[0].text;
                    return res.status(200).json({ response: botResponse });
                } else {
                    throw new Error('Unexpected API response structure');
                }

            } catch (error) {
                lastError = error;
                console.warn(`Model ${model} with ${version} failed:`, error.message);
                continue; // Try next model/version
            }
        }
    }

    // If all attempts fail
    console.error('All API models failed. Last error:', lastError?.message);
    return res.status(503).json({ error: 'AI service is currently unavailable.' });
}