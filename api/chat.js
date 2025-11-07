export const config = {
    runtime: 'edge',
};

export default async function handler(req, res) {
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

    const { userInput, chatHistory, knowledgeBase } = await req.json();
    
    // Define default suggestions
    const SUGGESTIONS = [
        "What are his main skills?",
        "Tell me about a project.",
        "How do I contact him?"
    ];

    function generateContextualSuggestions(input) {
        if (input.toLowerCase().includes('project')) {
            return [
                "Tell me more about the chatbot project",
                "What other projects are planned?",
                "What technologies do you use?"
            ];
        }
        if (input.toLowerCase().includes('skill')) {
            return [
                "What programming languages do you know?",
                "Tell me about your web development skills",
                "What frameworks do you use?"
            ];
        }
        return SUGGESTIONS;
    }

    if (!userInput) {
        return new Response(JSON.stringify({ error: 'User input is required' }), { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return new Response(JSON.stringify({ 
            error: 'API key not configured',
            suggestions: SUGGESTIONS
        }), { status: 500 });
    }

    // Expanded list of models for chat, ordered from most preferred to least.
    // This provides fallbacks if one model is unavailable or rate-limited.
    const models = [
        'gemini-2.5-pro',              // Most powerful, high quality
        'gemini-2.5-flash',            // Fast and cost-effective
        'gemini-1.5-flash-latest',     // Alias for the latest flash model
        'gemini-pro-latest',           // Alias for the latest pro model
        'gemini-2.0-flash',
        'gemini-2.5-flash-lite',
        'gemini-2.0-flash-lite',
        'gemini-2.0-flash-live',
        'gemini-2.5-flash-live',
        'gemini-2.0-flash-exp',
        'learnlm-2.0-flash-experimental',
        'gemini-pro',                  // Stable version, good fallback
    ];

    // It's generally best to stick with 'v1beta' for streaming features.
    const apiVersions = ['v1beta'];

    let lastError = null;
    let response = null;


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
2.  After your response, on a new line, add a special marker [SUGGESTIONS].
3.  After the marker, provide exactly three short, relevant follow-up questions that the user might ask next. Separate them with a pipe character (|). Do not add a newline after the suggestions.

**Example Output Format:**
That's a great question! Rudra is skilled in Python, JavaScript, and Java. He's particularly passionate about building AI-driven applications with Python. 🐍
\n[SUGGESTIONS]What are his favorite projects?|Is he available for freelance work?|Tell me more about his backend skills.

Your answer:`;

    const requestBody = {
        contents: [{ parts: [{ text: prompt }] }],
    };

    for (const version of apiVersions) {
        for (const model of models) {
            const API_URL = `https://generativelanguage.googleapis.com/${version}/models/${model}:streamGenerateContent?key=${apiKey}&alt=sse`;
            console.log(`Attempting to call model: ${model} with API version: ${version}`);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15-second timeout

            try {
                const apiResponse = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestBody),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (apiResponse.ok) {
                    // If successful, return the streaming response immediately
                    return new Response(apiResponse.body, {
                        headers: { 'Content-Type': 'text/event-stream' }
                    });
                }

                // If not OK, store the error and try the next model
                const errorData = await apiResponse.json().catch(() => ({}));
                lastError = {
                    status: apiResponse.status,
                    message: errorData.error?.message || `Failed to call ${model}`,
                    model,
                    version
                };
                console.warn(`Failed with model ${model} (${version}): ${lastError.message}`);

            } catch (fetchError) {
                clearTimeout(timeoutId);
                lastError = {
                    status: fetchError.name === 'AbortError' ? 408 : 500,
                    message: fetchError.name === 'AbortError' ? 'Request timed out' : fetchError.message,
                    model,
                    version
                };
                console.warn(`Error with model ${model} (${version}): ${lastError.message}`);
            }
        }
    }

    // If all models fail, return the last recorded error
    console.error('All Gemini models failed. Last error:', lastError);
    return new Response(JSON.stringify({
        error: `AI service is unavailable. Last error: ${lastError.message}`,
        suggestions: generateContextualSuggestions(userInput)
    }), { status: lastError.status || 500 });
}