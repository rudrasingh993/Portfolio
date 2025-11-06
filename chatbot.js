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
    userInput = userInput.toLowerCase().trim();

    // First, check the local knowledge base with improved matching
    for (const keyword in knowledgeBase) {
        if (keyword !== "default" && userInput.includes(keyword)) {
            return knowledgeBase[keyword];
        }
    }
    
    // If no match found and it's a simple question, return default
    if (userInput.length < 10) {
        return knowledgeBase["default"];
    }

    // Try to use API, but don't fail if it doesn't work - fall back to knowledge base
    let apiResponse = null;
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userInput: userInput }),
        });

        if (!response.ok) {
            // The server will send a detailed error, we can create a generic one for the user
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        apiResponse = data.response;

    } catch (error) {
        // The API call failed, so we will fall back to the local knowledge base.
        console.warn('API call failed, using fallback:', error.message);
        apiResponse = null;
    }
    
    // If API worked, return the response
    if (apiResponse) {
        return apiResponse;
    }
    
    // Fallback to knowledge base with helpful message
    // Try to provide a more contextual response based on keywords
    const fallbackResponses = [
        { keywords: ['portfolio', 'website', 'site', 'page'], response: "This is Rudra Pratap Singh's portfolio website showcasing his skills, projects, and experience as an AI/ML enthusiast and developer. Feel free to explore the different sections to learn more about him!" },
        { keywords: ['skill', 'technology', 'tech', 'language', 'framework', 'tool'], response: "Rudra has expertise in Frontend (React, Next.js, Tailwind CSS), Backend (Node.js, Express, Python, FastAPI, PostgreSQL, MongoDB), Design Tools (Figma, Adobe XD), and Programming Languages (Python, Java, C++). Check out the Skills section for more details!" },
        { keywords: ['project', 'work', 'build', 'create', 'develop'], response: "Rudra is currently working on exciting projects that will be showcased here soon. He believes in quality over quantity, so stay tuned for impressive work! You can check the Projects section for updates." },
        { keywords: ['contact', 'reach', 'email', 'phone', 'message', 'connect'], response: "You can reach Rudra through the contact form on this website or by email at rudrasingh14513@gmail.com. He's always open to new opportunities and collaborations!" },
        { keywords: ['about', 'who', 'what', 'where', 'when', 'why', 'how'], response: "Rudra Pratap Singh is a passionate AI/ML enthusiast and creative developer. He loves building beautiful and functional web experiences. Explore the About section to learn more about his journey!" }
    ];

    const userWords = userInput.split(/\s+/);
    
    for (const item of fallbackResponses) {
        if (userWords.some(word => item.keywords.includes(word))) {
            return item.response;
        }
    }
    
    // Final fallback
    return `I understand you're asking about "${userInput}". While I'm currently operating in a limited mode, I can help you with questions about Rudra's skills, projects, contact information, or his portfolio. Feel free to ask about those topics, or use the contact form to reach out directly!`;
}