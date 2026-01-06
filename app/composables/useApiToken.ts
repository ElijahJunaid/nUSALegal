interface CachedToken {
  token: string;
  expiresAt: number;
  endpoint: string;
}

const tokenCache = new Map<string, CachedToken>();

export function useApiToken() {
  const getToken = async (endpoint: string): Promise<string> => {
    const cached = tokenCache.get(endpoint);

    if (cached && cached.expiresAt > Date.now() + 30000) {
      return cached.token;
    }

    try {
      const response = await $fetch('/api/auth/token', {
        method: 'POST',
        body: { endpoint }
      });

      const cachedToken: CachedToken = {
        token: response.token,
        expiresAt: Date.now() + (4 * 60 * 1000), // 4 minutos
        endpoint
      };

      tokenCache.set(endpoint, cachedToken);

      return response.token;
    } catch (error) {
      console.error('Failed to get API token:', error);
      throw error;
    }
  };

  const clearCache = (endpoint?: string) => {
    if (endpoint) {
      tokenCache.delete(endpoint);
    } else {
      tokenCache.clear();
    }
  };

  return {
    getToken,
    clearCache
  };
}
