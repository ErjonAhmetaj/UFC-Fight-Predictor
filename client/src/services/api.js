const BASE_URL = 'http://localhost:5050/api';

const fetchWithTimeout = async (url, options = {}) => {
  const { timeout = 8000, ...restOptions } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...restOptions,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw error;
  } finally {
    clearTimeout(id);
  }
};

export const api = {
  // Get all fighters
  getFighters: async () => {
    try {
      return await fetchWithTimeout(`${BASE_URL}/fighters`);
    } catch (error) {
      console.error('Error fetching fighters:', error);
      throw new Error('Failed to fetch fighters. Please check your connection and try again.');
    }
  },

  // Get fighter by ID
  getFighterById: async (id) => {
    try {
      return await fetchWithTimeout(`${BASE_URL}/fighters/${id}`);
    } catch (error) {
      console.error('Error fetching fighter:', error);
      throw new Error('Failed to fetch fighter details. Please try again later.');
    }
  },

  // Get upcoming fights
  getUpcomingFights: async () => {
    try {
      return await fetchWithTimeout(`${BASE_URL}/fights/upcoming`);
    } catch (error) {
      console.error('Error fetching upcoming fights:', error);
      throw new Error('Failed to fetch upcoming fights. Please try again later.');
    }
  },

  // Get fighter stats
  getFighterStats: async (id) => {
    try {
      return await fetchWithTimeout(`${BASE_URL}/fighters/${id}/stats`);
    } catch (error) {
      console.error('Error fetching fighter stats:', error);
      throw new Error('Failed to fetch fighter statistics. Please try again later.');
    }
  },

  // Get fighter's recent fights
  getFighterRecentFights: async (id) => {
    try {
      return await fetchWithTimeout(`${BASE_URL}/fighters/${id}/fights`);
    } catch (error) {
      console.error('Error fetching fighter fights:', error);
      throw new Error('Failed to fetch fighter history. Please try again later.');
    }
  }
};