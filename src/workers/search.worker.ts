import { Token } from '../types/token';

self.onmessage = (e) => {
  const { tokens, searchTerm, limit } = e.data;
  
  let filtered = tokens;
  
  // Apply search filter if search term exists
  if (searchTerm) {
    const searchLower = searchTerm.toLowerCase();
    filtered = tokens.filter(token => 
      token.currency.toLowerCase().includes(searchLower) ||
      token.issuer.toLowerCase().includes(searchLower)
    );
  }

  // Sort by volume
  filtered = filtered.sort((a, b) => b.volume24h - a.volume24h);

  // Apply limit only if specified (for initial load)
  if (limit) {
    filtered = filtered.slice(0, limit);
  }

  self.postMessage(filtered);
};