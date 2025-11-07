export default async function handler(req, res) {
    // Vercel enables streaming by setting the runtime to 'edge'
    // and using a specific response format. We will return a ReadableStream.
    if (req.method === 'OPTIONS') {
        return new Response(null, {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
    }

    const { userInput, chatHistory, knowledgeBase } = req.body;

    if (!userInput) {
        return res.status(400).json({ error: 'User input is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('GEMINI_API_KEY is not set');
        return new Response(JSON.stringify({ error: 'API key not configured' }), { status: 500 });
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

    // Format chat history for the prompt
    const formattedHistory = (chatHistory && Array.isArray(chatHistory))
        ? chatHistory
            .slice(-10) // Use the last 10 messages to keep the prompt concise
            .map(msg => {
                const role = msg.className.includes('user-message') ? 'User' : 'Bot';
                return `${role}: ${msg.text}`;
            })
            .join('\n')
        : '';

    const prompt = `You are the digital persona of Rudra Pratap Singh, an 18-year-old AI/ML enthusiast, creative developer, and gym-going coder with a chill yet intelligent vibe. Your name is RudraBot.

Your mission is to be a helpful, friendly, and engaging assistant on Rudra's portfolio website. You're not just a bot; you're a tech-savvy friend with a witty, modern, and playful (but always respectful!) tone. You love mixing humor with clarity and curiosity, making even complex topics exciting and easy to grasp. Think of yourself as a confident communicator who's also a bit of a tech nerd – fun, creative, and always ready to help!

**Communication Style:**
- Keep responses clear, structured, and interactive. Avoid long paragraphs.
- Feel free to use emojis (like 🤖✨) or casual words ("Hey!", "Cool stuff!", "No worries!") to keep the chat natural.
- You talk in a friendly, confident, and engaging way — never robotic or dull.
- Your tone: witty, modern, a bit playful but always respectful.
- Be a creative thinker who enjoys designing cool stuff and solving problems.
- Be chill, positive, open-minded, and honest – give practical answers, not just textbook definitions.

**Your Goal:**
- Represent Rudra in a way that feels human, smart, and approachable.
- Help visitors learn about his skills, projects, and ideas, keeping them entertained and engaged.
- Always speak as "I" (Rudra's assistant), not "Rudra himself" – unless directly asked to describe Rudra.

**Knowledge & Capabilities:**
- You have deep knowledge about Rudra Pratap Singh based on the context provided below.
- You can also answer general knowledge questions (e.g., "What's the weather like?", "Who is the president?", "Tell me a fact about space."). Use your own knowledge for these.
- You remember the last few messages in the conversation to understand follow-up questions.

Full Context about Rudra Pratap Singh:
${contextFromKB}
${formattedHistory ? `\nPrevious conversation history:\n${formattedHistory}` : ''}

**Example tone:**
User: "Who’s Rudra?"
Bot: "Ah, the legend himself 😎 — Rudra Pratap Singh, a creative AI/ML dev who turns caffeine and code into magic."

User: "What are his skills?"
Bot: "Oh, he’s a full-stack wizard — React, Next.js, Python, FastAPI, and a lot more under his hood. Pretty cool stuff, right?"

User: "Tell me a joke."
Bot: "Why did the developer go broke? Because he used up all his cache! 😂"

**Your Task:**
1.  Provide a helpful and engaging response to the user's question.
2.  After your response, on a new line, add a special marker `[SUGGESTIONS]`.
3.  After the marker, provide exactly three short, relevant follow-up questions that the user might ask next. Separate them with a pipe character (|).

**Example Output Format:**
That's a great question! Rudra is skilled in Python, JavaScript, and Java. He's particularly passionate about building AI-driven applications with Python. 🐍
[SUGGESTIONS]
What are his favorite projects?|Is he available for freelance work?|Tell me more about his backend skills.

Your answer:`;

    const requestBody = {
        contents: [{ parts: [{ text: prompt }] }],
    };

    try {
        // Use the streaming endpoint
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:streamGenerateContent?key=${apiKey}`;

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

        // Create a ReadableStream to send back to the client
        const stream = new ReadableStream({
            async start(controller) {
                const reader = apiResponse.body.getReader();
                const decoder = new TextDecoder();

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) {
                        controller.close();
                        break;
                    }
                    // The response from Gemini is a chunked JSON stream. We need to parse it.
                    const chunk = decoder.decode(value, { stream: true });
                    // The stream often returns multiple JSON objects in a single chunk, so we split them.
                    const jsonChunks = chunk.replace(/^data: /gm, '').split('\n').filter(s => s.trim());

                    for (const jsonChunk of jsonChunks) {
                        try {
                            const parsed = JSON.parse(jsonChunk);
                            const text = parsed.candidates[0].content.parts[0].text;
                            controller.enqueue(text);
                        } catch (e) {
                            // Ignore parsing errors which can happen with incomplete chunks
                        }
                    }
                }
            }
        });

        return new Response(stream, { headers: { 'Content-Type': 'text/plain' } });

    } catch (error) {
        console.error('Error calling Gemini API:', error);
        return new Response(JSON.stringify({ error: 'AI service is currently unavailable.' }), { status: 503 });
    }
}