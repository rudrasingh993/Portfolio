document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initTheme();
    initChatbot();

    setTimeout(() => {
        const chatWindow = document.getElementById('chatWindow');
        if (chatWindow && !chatWindow.classList.contains('active')) {
            chatWindow.classList.add('active');
        }
    }, 500);
});

function initNavbar() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when a link is clicked
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }
}

function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    // Load saved theme or use system preference
    const savedTheme = localStorage.getItem('theme');
    const initialTheme = savedTheme || (prefersDark.matches ? 'dark' : 'light');

    setTheme(initialTheme);

    // Theme toggle event
    if (themeToggle) {
        themeToggle.addEventListener('click', function (e) {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            // Create elegant transition effect
            createThemeTransition(e);

            setTimeout(() => {
                setTheme(newTheme);
                localStorage.setItem('theme', newTheme);
            }, 150);
        });
    }

    // Listen for system theme changes
    prefersDark.addListener((e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
}

function createThemeTransition(event) {
    const transition = document.createElement('div');
    const rect = event.target.closest('.theme-toggle').getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    transition.style.cssText = `
        position: fixed;
        top: ${y}px;
        left: ${x}px;
        width: 0;
        height: 0;
        background: var(--accent-primary);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 9999;
        transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        opacity: 0.1;
    `;

    document.body.appendChild(transition);

    requestAnimationFrame(() => {
        const size = Math.max(window.innerWidth, window.innerHeight) * 2.5;
        transition.style.width = size + 'px';
        transition.style.height = size + 'px';
    });

    setTimeout(() => transition.remove(), 800);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
        metaThemeColor.content = theme === 'dark' ? '#0f0f0f' : '#fdfcfb';
    }
}



const knowledgeBase = {
    "name": "Rudra Pratap Singh",
    "hello|hi": "Hello there! I'm Rudra's digital assistant. Feel free to ask me anything about his work and skills.",
    "who are you|what are you": "I am Rudra's portfolio chatbot. I can answer questions about Rudra Pratap Singh: his skills, projects, goals, devices, and preferences.",
    "who is rudra|who's rudra": "Rudra Pratap Singh is a passionate AI/ML enthusiast and creative web developer building portfolio projects, games, and AI features. He's focused on learning and making practical projects for his B.Tech / AI career path.",
    "email": "rudrasingh14513@gmail.com",
    "contact|how to contact": "The best way to contact Rudra is via the contact form on his site or by email at rudrasingh14513@gmail.com.",

    // Skills & technical profile
    "skills|what are your skills": "Rudra is a versatile developer with a strong foundation in both frontend and backend technologies. His toolkit includes React, Next.js, Node.js, Python, FastAPI, and various databases. He's also proficient in design tools like Figma. For a detailed list, check out the 'Skills' section!",
    "technical craft": "Rudra writes clean, maintainable code and prefers minimal, thoughtful design — 'less is more'.",

    // Projects & portfolio
    "what is this website": "This is Rudra Pratap Singh's personal portfolio showcasing his projects, skills, and creative journey.",
    "projects|what are the projects": "Rudra is building projects including games, AI-powered chatbots, e-commerce demos, and portfolio showcase apps. Several items are in progress and will be posted soon.",
    "portfolio features": "Features planned: AI chatbot, special admin login, showcase of games and e-commerce projects, and polished UI/UX for each project.",

    // Career & education
    "education status": "Rudra completed 12th grade studies and took a gap year (2024–2025) to focus on skills, exam prep (JEE, BITSAT, VITJEE), and portfolio development.",
    "career goals": "Rudra aims to pursue AI/ML in B.Tech, build an AI/ML portfolio, learn model-building, and ultimately work towards building his own LLM and a semiconductor plant in India.",
    "roadmap": "Interested in AI/ML and Data Science — focus on math, Python, ML libraries, project-based portfolio, internships, and building demonstrable systems.",

    // Devices / hardware / audio
    "devices": "Primary phone: Realme Narzo 60 Pro. Also owns Samsung Galaxy J7 Prime (SM-G610F/DD, rooted). Audio gear: Sony WH-1000XM5 and Audio-Technica M50xBT2.",
    "headphones": "Rudra prefers high-quality sound with deep bass; owns Sony WH-1000XM5 and Audio-Technica M50xBT2.",

    // Personal & preferences
    "name prefer": "Rudra (Rudra Pratap Singh)",
    "diet": "Vegetarian.",
    "fitness level": "Beginner in gym training; prefers a mix of machines and free weights.",
    "gym schedule": "Usually goes to the gym 4:00 PM to 5:30 PM on all days except Sundays and Wednesdays.",
    "supplements": "Started taking creatine on 2025-02-21, taken pre-workout.",
    "body stats": "Height: 6'2\". Weight: ~87 kg (last recorded 2024-11-29). On a calorie-deficit diet for weight loss.",
    "beard": "Patchy beard growth that curls; prefers to keep beard short.",
    "age & birthday": "Birthday: December 17. (Age recorded in convo: 18 on 2024-11-29.)",

    // Skin & grooming
    "skin type": "Oily, sweaty skin with concerns: tan, acne spots, occasional pimples, persistently oily.",
    "skincare products": "Uses Mamaearth Ubtan Face Wash, Mamaearth Vitamin C Daily Glow Face Serum, Mamaearth Tea Tree Face Serum, Rose Water, Lakme 50 PA+++ Gel Light Sunscreen. Also has Nivea moisturizer cream and a Beardo activated charcoal peel-off mask.",
    "skincare preferences": "Prefers budget-friendly options. Likes Minimalist 2% Salicylic Acid Face Wash and is considering Minimalist B5 Moisturizer.",

    // UX / product preferences
    "product preferences": "Budget-friendly skincare; high-quality audio with deep bass; accessible, practical web projects.",

    // Development preferences & projects details
    "game target audience": "Teens.",
    "game concept": "Web-based simulation/adventure game with a funny theme that teaches basic Python programming.",
    "captcha system": "Developing a CAPTCHA that presents calculus and trigonometry questions and shows a new question after successful completion.",
    "web goals": "Wants portfolio to auto-update on new GitHub commits and be hosted on Vercel. Uses modern web stacks and cares about clean UI and OG tags.",

    // Tools & coding notes encountered in convo
    "recent technical issues": "Examples discussed: Gemini CLI node engine error (requires Node >=20), MusicKit CSP frame-ancestors issue, Vercel output directory config errors.",
    "tech interests": "AI/ML model building, LLMs, portfolio sites, game dev, and learning dev tooling.",

    // Social & content creation
    "social goals": "Wants to start Instagram and YouTube, learn photo/video editing, and build a presence while making technical content.",
    "video editing": "Looking for good, free, simple video editing platforms for personal use.",

    // Fallbacks & fun bits
    "tell me a joke": "Why don't scientists trust atoms? Because they make up everything!",
    "meaning of life": "Rudra believes in living a life of purpose, passion, and continuous learning.",

    // Default fallback
    "default": "I'm sorry—I can only answer questions about Rudra Pratap Singh's portfolio and preferences. If you want to update anything, tell me what to change."
};

async function getBotResponse(userInput, chatHistory) {
    return new Promise((resolve, reject) => {
        const worker = new Worker('chat-worker.js');

        worker.onmessage = (event) => {
            resolve(event.data);
            worker.terminate();
        };

        worker.onerror = (error) => {
            console.error('Error in chat worker:', error);
            reject(new Error("Worker error: " + error.message));
            worker.terminate();
        };

        // Send the user input and history to the worker to start processing
        worker.postMessage({ userInput, chatHistory, knowledgeBase });
    });
}

function initChatbot() {
    const chatIcon = document.getElementById('chatIcon');
    const chatWindow = document.getElementById('chatWindow');
    const chatClose = document.getElementById('chatClose');
    const chatClear = document.getElementById('chatClear');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');

    const CHAT_HISTORY_KEY = 'rudra_chat_history';
    let chatHistory = [];

    // Saves the current chat history to localStorage
    function saveHistory() {
        try {
            localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(chatHistory));
        } catch (error) {
            console.error('Could not save chat history:', error);
        }
    }

    // Loads chat history from localStorage and displays it
    function loadHistory() {
        try {
            chatMessages.innerHTML = ''; // Clear any existing messages first
            const savedHistory = localStorage.getItem(CHAT_HISTORY_KEY);
            if (savedHistory && JSON.parse(savedHistory).length > 0) {
                chatHistory = JSON.parse(savedHistory);
                chatHistory.forEach(msg => appendMessage(msg.text, msg.className, false)); // Don't save while loading
            } else {
                // If no history, add and save the initial bot message
                appendMessage('Hello! How can I help you?', 'bot-message');
            }
        } catch (error) {
            console.error('Could not load chat history:', error);
            // Fallback to default message if loading fails
            appendMessage('Hello! How can I help you?', 'bot-message');
        }
    }

    // Display suggested questions as chips in the chat flow
    function showSuggestions(suggestions) {
        // Remove any existing suggestion chips first
        const existingSuggestions = document.querySelector('.message-suggestions');
        if (existingSuggestions) {
            existingSuggestions.remove();
        }

        if (!suggestions || suggestions.length === 0) return;

        const suggestionsContainer = document.createElement('div');
        suggestionsContainer.className = 'message-suggestions';

        suggestions.forEach(suggestionText => {
            const chip = document.createElement('button');
            chip.className = 'suggestion-chip';
            chip.textContent = suggestionText;
            chip.addEventListener('click', () => {
                chatInput.value = suggestionText;
                sendMessage();
            });
            suggestionsContainer.appendChild(chip);
        });

        chatMessages.appendChild(suggestionsContainer);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    if (chatIcon) {
        chatIcon.addEventListener('click', () => {
            chatWindow.classList.toggle('active');
        });
    }

    if (chatClose) {
        chatClose.addEventListener('click', () => {
            chatWindow.classList.remove('active');
        });
    }

    if (chatClear) {
        chatClear.addEventListener('click', () => {
            chatHistory = [];
            saveHistory();
            chatMessages.innerHTML = '';
            // Add and save the initial bot message after clearing
            appendMessage('Hello! How can I help you?', 'bot-message');
            // Show default suggestions after clearing
            showSuggestions([
                "What are his main skills?",
                "Tell me about a project.",
                "How do I contact him?"
            ]);
        });
    }

    if (chatSend) {
        chatSend.addEventListener('click', sendMessage);
    }

    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    async function sendMessage() {
        const userInput = chatInput.value.trim();
        if (userInput === '') return;

        // Remove old suggestions when a new message is sent
        const existingSuggestions = document.querySelector('.message-suggestions');
        if (existingSuggestions) existingSuggestions.remove();

        // Disable input while processing
        chatInput.disabled = true;
        chatSend.disabled = true;

        appendMessage(userInput, 'user-message'); // This will also save the user message
        chatInput.value = '';

        // Show loading indicator
        const loadingMessage = appendMessage('Thinking...', 'bot-message loading-message', false);

        try {
            const workerResponse = await getBotResponse(userInput, chatHistory);

            if (workerResponse.type === 'local') {
                // Handle instant local response
                loadingMessage.remove();
                appendMessage(workerResponse.response, 'bot-message');
                if (workerResponse.suggestions) {
                    showSuggestions(workerResponse.suggestions);
                }
            } else if (workerResponse.type === 'stream') {
                // Handle streaming AI response by calling our secure API endpoint
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userInput,
                        chatHistory,
                        knowledgeBase,
                        suggestions: workerResponse.suggestions
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    loadingMessage.remove();

                    if (data.response) {
                        appendMessage(data.response, 'bot-message');
                    } else {
                        throw new Error("Received an empty response from the AI.");
                    }

                    if (data.suggestions && data.suggestions.length > 0) {
                        showSuggestions(data.suggestions);
                    }
                } else {
                    throw new Error(`API request failed with status ${response.status}`);
                }
            }
        } catch (error) {
            console.error('Chatbot sendMessage error:', error);
            loadingMessage.remove();
            appendMessage("I'm sorry, something went wrong. Please try again.", 'bot-message');
        } finally {
            chatInput.disabled = false;
            chatSend.disabled = false;
            chatInput.focus();
        }
    }

    function appendMessage(text, className, shouldSave = true) {
        const messageContainer = document.createElement('div');
        messageContainer.className = 'message-container';
        const messageElement = document.createElement('div');
        messageElement.className = `message ${className || ''}`;

        // Regex to find markdown-style code blocks
        const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
        let lastIndex = 0;
        let match;

        // Initial render. For streaming, this will be updated by renderMessageContent
        messageElement.textContent = text;
        messageContainer.appendChild(messageElement);

        // Check if the message is from the bot and contains a code block
        if (className.includes('bot-message') && codeBlockRegex.test(text)) {
            // Reset regex for execution
            codeBlockRegex.lastIndex = 0;

            while ((match = codeBlockRegex.exec(text)) !== null) {
                // Add text before the code block
                if (match.index > lastIndex) {
                    const textNode = document.createElement('p');
                    textNode.textContent = text.substring(lastIndex, match.index);
                    messageElement.appendChild(textNode);
                }

                const [fullMatch, language, code] = match;

                // Create container for the code block
                const codeContainer = document.createElement('div');
                codeContainer.className = 'code-block-container';

                const pre = document.createElement('pre');
                const codeEl = document.createElement('code');
                if (language) {
                    codeEl.className = `language-${language}`;
                }
                codeEl.textContent = code.trim();
                pre.appendChild(codeEl);

                // Create copy button
                const copyButton = document.createElement('button');
                copyButton.className = 'copy-code-btn';
                copyButton.innerHTML = '<i class="fas fa-copy"></i> Copy';
                copyButton.addEventListener('click', () => {
                    navigator.clipboard.writeText(code.trim()).then(() => {
                        copyButton.innerHTML = '<i class="fas fa-check"></i> Copied!';
                        setTimeout(() => {
                            copyButton.innerHTML = '<i class="fas fa-copy"></i> Copy';
                        }, 2000);
                    });
                });

                codeContainer.appendChild(copyButton);
                codeContainer.appendChild(pre);
                messageElement.appendChild(codeContainer);

                lastIndex = codeBlockRegex.lastIndex;
            }

            // Add any remaining text after the last code block
            if (lastIndex < text.length) {
                const textNode = document.createElement('p');
                textNode.textContent = text.substring(lastIndex);
                messageElement.appendChild(textNode);
            }
        } else {
            // If no code block, just set the text content
            messageElement.textContent = text;
        }

        if (className.includes('bot-message') && !className.includes('loading-message')) {
            const copyButton = document.createElement('button');
            copyButton.className = 'copy-response-btn';
            copyButton.innerHTML = '<i class="fas fa-copy"></i> Copy';
            copyButton.title = 'Copy response text';
            copyButton.addEventListener('click', () => {
                // We use the raw 'text' variable to copy content even from code blocks
                navigator.clipboard.writeText(text).then(() => {
                    copyButton.innerHTML = '<i class="fas fa-check"></i> Copied!';
                    setTimeout(() => {
                        copyButton.innerHTML = '<i class="fas fa-copy"></i> Copy';
                    }, 2000);
                });
            });
            messageContainer.appendChild(copyButton);
        }

        chatMessages.appendChild(messageContainer);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Add to history and save, if required
        if (shouldSave) {
            chatHistory.push({ text, className });
            saveHistory();
        }

        return messageContainer; // Return the container so it can be removed if it's a loading message
    }

    /**
     * Renders message content, parsing for code blocks.
     * Can be called repeatedly for streaming text.
     * @param {HTMLElement} messageElement - The .message element to render into.
     * @param {string} text - The full text to render.
     * @param {boolean} isFinal - If true, applies final touches like syntax highlighting.
     */
    function renderMessageContent(messageElement, text, isFinal = false) {
        messageElement.innerHTML = ''; // Clear previous content

        const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
        let lastIndex = 0;
        let match;

        // Use a temporary regex object for each run
        const regex = new RegExp(codeBlockRegex);

        while ((match = regex.exec(text)) !== null) {
            // Add text before the code block
            if (match.index > lastIndex) {
                const textNode = document.createElement('p');
                textNode.textContent = text.substring(lastIndex, match.index);
                messageElement.appendChild(textNode);
            }

            const [fullMatch, language, code] = match;

            const pre = document.createElement('pre');
            // Add the language class for Prism.js. Normalize common names.
            const langClass = language.toLowerCase() || 'none';
            pre.className = `language-${langClass}`;

            const codeEl = document.createElement('code');
            codeEl.textContent = code.trim();
            pre.appendChild(codeEl);

            // On the final render, apply syntax highlighting
            if (isFinal && window.Prism) {
                Prism.highlightElement(codeEl);
            }

            // The copy button is now part of the <pre> element for Prism Toolbar
            if (isFinal) {
                pre.setAttribute('data-prismjs-copy', 'Copy');
                pre.setAttribute('data-prismjs-copy-success', 'Copied!');
            }

            messageElement.appendChild(pre);

            lastIndex = regex.lastIndex;
        }

        // Add any remaining text after the last code block
        if (lastIndex < text.length) {
            const textNode = document.createElement('p');
            textNode.textContent = text.substring(lastIndex);
            messageElement.appendChild(textNode);
        }

        // If the message is empty (e.g., at the start of a stream), add a cursor
        if (text.length === 0) {
            const cursor = document.createElement('span');
            cursor.className = 'typing-cursor';
            messageElement.appendChild(cursor);
        }
    }

    // Load the chat history when the chatbot is initialized
    loadHistory();
    // Show default suggestions on initial load if history is empty
    if (chatHistory.length <= 1) {
        showSuggestions(["What are his main skills?", "Tell me about a project.", "How do I contact him?"]);
    }
}
