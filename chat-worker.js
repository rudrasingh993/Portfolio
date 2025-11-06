// This script runs in a background thread and will not freeze the UI.

self.onmessage = async function(event) {
    const { userInput, knowledgeBase } = event.data;

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userInput, knowledgeBase }),
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        
        // Send the successful response back to the main thread
        self.postMessage({ success: true, response: data.response });

    } catch (error) {
        console.warn('Web Worker API call failed:', error.message);
        
        // Send the error back to the main thread
        self.postMessage({ success: false, error: error.message });
    }
};