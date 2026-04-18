import { getBSCClient, KNOWN_TOKENS } from '../lib/bscClient';
import { useEffect, useState, useCallback } from 'react';

export const useBSCOracle = (tokenAddress = null, refreshInterval = 15000) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [liveEvents, setLiveEvents] = useState([]);
  
  const fetchData = useCallback(async () => {
    setIsFetching(true);
    try {
      const client = getBSCClient();
      const address = tokenAddress || KNOWN_TOKENS.CAKE;
      const result = await client.getOracleData(address);
      setData(result);
      setError(null);
      console.log('[Oracle] Data fetched successfully:', result);
    } catch (err) {
      console.error('[Oracle] Fetch failed:', err);
      setError(err);
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  }, [tokenAddress]);
  
  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  // Refresh interval
  useEffect(() => {
    if (!refreshInterval) return;
    
    const interval = setInterval(() => {
      console.log('[Oracle] Refreshing data...');
      fetchData();
    }, refreshInterval);
    
    return () => clearInterval(interval);
  }, [fetchData, refreshInterval]);
  
  // Mempool watching
  useEffect(() => {
    const address = tokenAddress || (data?.tokenAddress) || KNOWN_TOKENS.CAKE;
    
    console.log('[Oracle] Setting up mempool watch for:', address);
    
    const client = getBSCClient();
    
    client.watchTokenMempool(address, (event) => {
      console.log('[Oracle] Mempool event received:', event);
      setLiveEvents(prev => [event, ...prev].slice(0, 50));
    });
    
    return () => {
      console.log('[Oracle] Cleaning up mempool watch');
      client.unwatchToken(address);
    };
  }, [tokenAddress, data?.tokenAddress]);
  
  return {
    data,
    isLoading,
    isFetching,
    error,
    refetch: fetchData,
    liveEvents,
    isLive: liveEvents.length > 0
  };
};