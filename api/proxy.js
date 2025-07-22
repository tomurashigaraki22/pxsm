// api/proxy.js

export default async function handler(req, res) {
    const { method, query } = req;
  
    // const apiKey = "80N1Xb27bTOlDym3xytiXndLkmH0TjpE";
    const apiKey = "72a70e5ad09fa045a7bfe18bc4c932c1"
  
    if (!apiKey) {
      return res.status(500).json({ error: "API key missing in environment variables" });
    }
  
    const action = query.action;
    const queryParams = new URLSearchParams({ ...query, key: apiKey }).toString();
  
    const apiUrl = `https://thekclaut.com/api/v2?${queryParams}`;
  
    try {
      const response = await fetch(apiUrl, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const result = await response.json();
  
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json({ error: "Proxy failed", details: err.message });
    }
  }
  