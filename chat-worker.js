/**
 * Web Worker for handling chatbot logic off the main thread.
 * This prevents the UI (like the fluid animation) from freezing during processing.
 */

/**
 * Finds a direct, simple response from the local knowledge base.
 * This is much faster than an API call for simple queries.
 * @param {string} userInput - The user's message.
 * @returns {string|null} - The response text or null if no match is found.
 */
function findLocalResponse(userInput) {
    const lowerInput = userInput.toLowerCase().trim();
    const knowledgeBase = self.knowledgeBase; // Access knowledgeBase from worker's scope

    if (!knowledgeBase) return null;

    // 1. Direct match in knowledgeBase
    for (const keyword in knowledgeBase) {
        if (keyword !== "default") {
            // Use regex for whole word matching, supporting multiple phrases separated by '|'
            const pattern = keyword.replace(/\|/g, '\\b|\\b');
            const regex = new RegExp(`\\b(${pattern})\\b`, 'i');
            if (regex.test(lowerInput)) {
                return knowledgeBase[keyword];
            }
        }
    }
    return null; // No local response found
}

// Listen for messages from the main thread
self.onmessage = async function(event) {
    const { userInput, chatHistory, knowledgeBase } = event.data;
    // Store knowledgeBase in the worker's scope
    self.knowledgeBase = knowledgeBase;

    // 1. First, try to find a fast, local response for simple queries.
    const localResponse = findLocalResponse(userInput);
    if (localResponse) {
        // If a local response is found, send it back directly.
        self.postMessage({ 
            type: 'local',
            response: localResponse, 
            suggestions: ["What are his main skills?", "Tell me about a project.", "How do I contact him?"]
        });
    } else {
        // If no local response, tell the main thread to initiate a stream.
        self.postMessage({ type: 'stream' });
    }
};