// api/proxy.js

export default async function handler(req, res) {
    const { query, method } = req;
  
    const key = "80N1Xb27bTOlDym3xytiXndLkmH0TjpE"; // Store this securely in Vercel dashboard
  
    const finalQuery = new URLSearchParams({
      ...query,
      key, // Inject the secret key from env
    }).toString();
  
    const url = `https://app.sizzle.ng/api/v1?${finalQuery}`;
  
    try {
      const response = await fetch(url, {
        method,
      });
  
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: 'Proxy request failed', details: error.message });
    }
  }
  