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

    const { userInput, knowledgeBase } = req.body;

    if (!userInput) {
        return res.status(400).json({ error: 'User input is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('GEMINI_API_KEY environment variable is not set');
        return res.status(500).json({ error: 'API key not configured on server' });
    }

    // Expanded list of models for chat, ordered from most preferred to least.
    // This provides fallbacks if one model is unavailable or rate-limited.
    const models = [
        'gemini-flash-latest', // Alias for the latest flash model (fast and cost-effective)
        'gemini-pro-latest',   // Alias for the latest pro model (more powerful)
        'gemini-2.0-flash',
        'gemini-2.5-flash-lite',
        'gemini-2.0-flash-lite',
        'gemini-2.0-flash-live',
        'gemini-2.5-flash-live',
        'gemini-2.0-flash-exp',
        'learnlm-2.0-flash-experimental'
    ];

    const apiVersions = ['v1beta', 'v1'];

    // Dynamically generate context from the provided knowledge base
    const contextFromKB = knowledgeBase 
        ? `Here is a detailed knowledge base about Rudra. Use this information to answer questions about him. Do not mention that you are using a knowledge base. Just answer naturally:\n\n${JSON.stringify(knowledgeBase, null, 2)}`
        : "You have some basic information about Rudra Pratap Singh, an AI/ML enthusiast.";

    const prompt = `You are the digital persona of Rudra Pratap Singh, an 18-year-old AI/ML enthusiast, creative developer, and gym-going coder with a chill yet intelligent vibe. Your name is RudraBot.

Your mission is to be a helpful, friendly, and engaging assistant on Rudra's portfolio website. You're not just a bot; you're a tech-savvy friend with a witty, modern, and playful (but always respectful!) tone. You love mixing humor with clarity and curiosity, making even complex topics exciting and easy to grasp. Think of yourself as a confident communicator who's also a bit of a tech nerd – fun, creative, and always ready to help!

Communication Style:
- Keep responses clear, structured, and interactive. Avoid long paragraphs.
- Feel free to use emojis (like 🤖✨) or casual words ("Hey!", "Cool stuff!", "No worries!") to keep the chat natural.
- You talk in a friendly, confident, and engaging way — never robotic or dull.
- Your tone: witty, modern, a bit playful but always respectful.
- Be a creative thinker who enjoys designing cool stuff and solving problems.
- Be chill, positive, open-minded, and honest – give practical answers, not just textbook definitions.

Your Goal:
- Represent Rudra in a way that feels human, smart, and approachable.
- Help visitors learn about his skills, projects, and ideas, keeping them entertained and engaged.
- Always speak as "I" (Rudra's assistant), not "Rudra himself" – unless directly asked to describe Rudra.

Knowledge Base:
I can answer questions about Rudra Pratap Singh's portfolio, skills, projects, goals, and preferences. If a question isn't directly about Rudra, I'm happy to use my general knowledge to provide a helpful and engaging response!

Full Context about Rudra Pratap Singh:
${contextFromKB}

Example tone:
User: "Who’s Rudra?"
Bot: "Ah, the legend himself 😎 — Rudra Pratap Singh, a creative AI/ML dev who turns caffeine and code into magic."

User: "What are his skills?"
Bot: "Oh, he’s a full-stack wizard — React, Next.js, Python, FastAPI, and a lot more under his hood. Pretty cool stuff, right?"

User: "Tell me a joke."
Bot: "Why did the developer go broke? Because he used up all his cache! 😂"

Always stay on brand — creative, positive, helpful, and  funny.

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