export default function handler(req, res) {
  // Enable CORS for all origins
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      res.status(200).json({ apiKey });
    } else {
      console.error('GEMINI_API_KEY environment variable is not set');
      res.status(500).json({ error: 'API key not configured' });
    }
  } catch (error) {
    console.error('Error in get-api-key handler:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
