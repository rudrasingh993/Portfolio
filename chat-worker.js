/**
 * Web Worker for handling chatbot logic off the main thread.
 * This prevents the UI (like the fluid animation) from freezing during processing.
 */

// This function is a replica of the one in chatbot.js, now running inside the worker.
function findLocalResponse(userInput, knowledgeBase, localFallbackResponses) {
    const lowerInput = userInput.toLowerCase().trim();

    // 1. Direct match in knowledgeBase
    for (const keyword in knowledgeBase) {
        if (keyword !== "default") {
            const pattern = keyword.replace(/\|/g, '\\b|\\b');
            const regex = new RegExp(`\\b(${pattern})\\b`, 'i');
            if (regex.test(lowerInput)) {
                return knowledgeBase[keyword];
            }
        }
    }

    // 2. Keyword-based fallback responses
    for (const item of localFallbackResponses) {
        for (const keyword of item.keywords) {
            const regex = new RegExp(`\\b${keyword}\\b`, 'i');
            if (regex.test(lowerInput)) {
                return item.response;
            }
        }
    }

    return null; // No local response found
}

async function callApi(userInput) {
    try {
        // In a worker, we can use relative paths. The browser resolves it
        // relative to the main script's location.
        const apiResponse = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userInput }), // We don't need to send the whole KB
        });

        if (!apiResponse.ok) {
            throw new Error(`API Error: ${apiResponse.statusText}`);
        }

        const data = await apiResponse.json();
        return data.response;

    } catch (error) {
        console.error('API call failed in worker:', error);
        // Return a specific error message that the main thread can handle
        throw new Error('API_FETCH_FAILED');
    }
}

// Listen for messages from the main thread
self.onmessage = async function(event) {
    const { userInput, knowledgeBase, localFallbackResponses } = event.data;

    try {
        // 1. Try to find a local response first
        const localResponse = findLocalResponse(userInput, knowledgeBase, localFallbackResponses);
        if (localResponse) {
            self.postMessage({ success: true, response: localResponse });
            return;
        }

        // 2. If no local response, and input is too short, return default.
        if (userInput.trim().length < 5) {
            self.postMessage({ success: true, response: knowledgeBase["default"] });
            return;
        }

        // 3. If still no match, call the external API
        const apiResponse = await callApi(userInput);
        self.postMessage({ success: true, response: apiResponse });

    } catch (error) {
        // If anything fails (local search or API), send an error message back
        self.postMessage({ success: false, error: error.message });
    }
};