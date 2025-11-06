const knowledgeBase = {
    "hello": "Hello there! I'm Rudra's digital assistant. Feel free to ask me anything about his work and skills.",
    "hi": "Hello there! I'm Rudra's digital assistant. Feel free to ask me anything about his work and skills.",
    "who are you": "I am a chatbot for Rudra Pratap Singh's portfolio. I can answer questions about his skills, projects, and experience.",
    "who is rudra": "Rudra Pratap Singh is a passionate AI/ML enthusiast and a creative developer with a knack for building beautiful and functional web experiences.",
    "what is this website": "This is the personal portfolio of Rudra Pratap Singh. It's a showcase of his skills, projects, and creative journey as a developer.",
    "skills": "Rudra is a versatile developer with a strong foundation in both frontend and backend technologies. His toolkit includes React, Next.js, Node.js, Python, FastAPI, and various databases. He's also proficient in design tools like Figma. For a detailed list, check out the 'Skills' section!",
    "what are your skills": "Rudra is a versatile developer with a strong foundation in both frontend and backend technologies. His toolkit includes React, Next.js, Node.js, Python, FastAPI, and various databases. He's also proficient in design tools like Figma. For a detailed list, check out the 'Skills' section!",
    "projects": "Rudra is currently working on some exciting projects that will be showcased here soon. He believes in quality over quantity, so stay tuned for some impressive work!",
    "what are the projects": "Rudra is currently working on some exciting projects that will be showcased here soon. He believes in quality over quantity, so stay tuned for some impressive work!",
    "contact": "The best way to get in touch with Rudra is through the contact form on this website or by sending an email to rudrasingh14513@gmail.com. He's always open to new opportunities and collaborations.",
    "how to contact": "The best way to get in touch with Rudra is through the contact form on this website or by sending an email to rudrasingh14513@gmail.com. He's always open to new opportunities and collaborations.",
    "email": "You can reach Rudra at rudrasingh14513@gmail.com.",
    "creative journey": "Rudra's creative journey is a tale of curiosity and code. He started with a passion for problem-solving and evolved into a developer who crafts beautiful and intuitive digital experiences. He believes that design is thinking made visual.",
    "technical craft": "Rudra sees code as a craft. He strives to write clean, efficient, and maintainable code that brings designs to life. He's a firm believer in the principle of 'less is more'.",
    "future vision": "Rudra is a lifelong learner who is always exploring new technologies. He's particularly excited about the future of AI and machine learning and how they can be used to create more intelligent and personalized digital experiences.",
    "what are his hobbies": "When he's not coding, Rudra enjoys exploring new technologies, reading about AI, and occasionally getting lost in a good book. He believes in a healthy work-life balance.",
    "tell me a joke": "Why don't scientists trust atoms? Because they make up everything!",
    "what is the meaning of life": "That's a deep question! While I may not have the answer, I can tell you that Rudra believes in living a life of purpose, passion, and continuous learning.",
    "default": "I'm sorry, I can only answer questions about Rudra Pratap Singh's portfolio. If you have a specific question, feel free to ask. For anything else, you can try the contact form."
};

async function getBotResponse(userInput) {
    userInput = userInput.toLowerCase();

    // First, check the local knowledge base
    for (const keyword in knowledgeBase) {
        if (keyword !== "default" && userInput.includes(keyword)) {
            return knowledgeBase[keyword];
        }
    }
    
    // If no match found and it's a simple question, return default
    if (userInput.length < 10) {
        return knowledgeBase["default"];
    }

    try {
        // Fetch the API key from the serverless function
        const apiKeyResponse = await fetch('/api/get-api-key');
        if (!apiKeyResponse.ok) {
            throw new Error(`Failed to fetch API key: ${apiKeyResponse.status}`);
        }
        const apiKeyData = await apiKeyResponse.json();
        
        if (!apiKeyData.apiKey) {
            throw new Error('API key not found in response');
        }
        
        const apiKey = apiKeyData.apiKey;

        // If no local answer, call the Gemini API
        // Try different model names as fallback
        const models = [
            'gemini-1.5-flash',
            'gemini-1.5-pro',
            'gemini-pro'
        ];
        
        const apiVersions = ['v1beta', 'v1'];
        
        const prompt = `You are a helpful and friendly chatbot on Rudra Pratap Singh's portfolio website. Your name is RudraBot. Please answer the user's question based on the provided context about Rudra, or from your general knowledge if the question is not about Rudra. Keep your answers concise and engaging.

Context about Rudra Pratap Singh:
- He is an AI/ML enthusiast and creative developer.
- His skills include Frontend (React, Next.js, Tailwind CSS), Backend (Node.js, Express, Python, FastAPI, PostgreSQL, MongoDB), Design Tools (Figma, Adobe XD), and Programming Languages (Python, Java, C++).
- His email is rudrasingh14513@gmail.com.
- He is passionate about exploring emerging tech and crafting designs that connect people in smarter ways.

User's question: "${userInput}"

Your answer:`;

        const requestBody = JSON.stringify({
            "contents": [{"parts":[{"text": prompt}]}]
        });

        // Try different models and API versions
        let lastError = null;
        for (const version of apiVersions) {
            for (const model of models) {
                try {
                    const API_URL = `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent?key=${apiKey}`;
                    
                    const response = await fetch(API_URL, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: requestBody,
                    });

                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({}));
                        lastError = new Error(`HTTP error! status: ${response.status}, message: ${errorData.error?.message || 'Unknown error'}`);
                        continue; // Try next model
                    }

                    const data = await response.json();
                    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
                        return data.candidates[0].content.parts[0].text;
                    } else {
                        console.error('Unexpected API response structure:', data);
                        lastError = new Error('Unexpected API response structure');
                        continue; // Try next model
                    }
                } catch (fetchError) {
                    lastError = fetchError;
                    continue; // Try next model
                }
            }
        }
        
        // If all models failed, throw the last error
        if (lastError) {
            throw lastError;
        }
        
        return "I'm sorry, I couldn't generate a response at the moment. Please try again later.";
    } catch (error) {
        console.error('Chatbot Error:', error);
        // Return a more helpful error message based on error type
        if (error.message.includes('API key')) {
            return "I'm sorry, there's a configuration issue with the AI service. Please contact the website owner.";
        } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            return "I'm sorry, I'm having trouble connecting to the internet right now. Please check your connection and try again.";
        } else if (error.message.includes('404') || error.message.includes('not found')) {
            return "I'm sorry, the AI model is currently unavailable. Please try asking a question from my knowledge base or contact Rudra directly.";
        } else {
            return "I'm sorry, I'm having trouble processing your request right now. Please try again later or ask a simpler question.";
        }
    }
}