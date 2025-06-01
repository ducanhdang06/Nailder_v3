// Purpose: Manages all design data fetching logic and state

// Handles API calls to fetch designs with throttling and deduplication
// Manages loading, error, and refresh states
// Implements batch fetching with pagination
// Provides methods for refreshing and loading more designs
// Encapsulates all network-related logic and caching behavior

import { useState, useCallback, useRef, useEffect } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { API_BASE_URL } from '../config';

const MIN_FETCH_INTERVAL = 5000;

export const useDesignFeed = () => {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  
  const fetchingRef = useRef(false);
  const lastFetchTimeRef = useRef(0);

  const fetchDesigns = useCallback(async (isRefresh = false) => {
    if (fetchingRef.current) {
      console.log("🚫 Fetch already in progress, skipping...");
      return;
    }
    
    const now = Date.now();
    if (!isRefresh && (now - lastFetchTimeRef.current) < MIN_FETCH_INTERVAL) {
      console.log("⏰ Fetch throttled, too soon since last fetch");
      return;
    }
    
    try {
      fetchingRef.current = true;
      lastFetchTimeRef.current = now;
      
      if (isRefresh) {
        setRefreshing(true);
        setHasReachedEnd(false);
      }
      
      const token = (await fetchAuthSession()).tokens?.idToken?.toString();
      const batchSize = 20;
      
      const res = await fetch(`${API_BASE_URL}/api/feed/unseen?limit=${batchSize}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log(`✅ Successfully fetched ${data.length} designs`);
      
      if (isRefresh) {
        setDesigns(data);
      } else {
        setDesigns(prev => {
          const existingIds = new Set(prev.map(d => d.id));
          const newDesigns = data.filter(d => !existingIds.has(d.id));
          return [...prev, ...newDesigns];
        });
      }
      
      if (data.length < batchSize) {
        setHasReachedEnd(true);
      }
      
      setError(null);
    } catch (err) {
      console.error("❌ Failed to fetch designs:", err);
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
      fetchingRef.current = false;
    }
  }, []);

  const refresh = useCallback(() => {
    fetchDesigns(true);
  }, [fetchDesigns]);

  const loadMore = useCallback(() => {
    if (hasReachedEnd || fetchingRef.current) return;
    
    const now = Date.now();
    if ((now - lastFetchTimeRef.current) < MIN_FETCH_INTERVAL) return;
    
    setTimeout(() => {
      if (!fetchingRef.current && !hasReachedEnd) {
        fetchDesigns(false);
      }
    }, 1000);
  }, [fetchDesigns, hasReachedEnd]);

  useEffect(() => {
    fetchDesigns(true);
  }, []);

  return {
    designs,
    loading,
    error,
    refreshing,
    hasReachedEnd,
    refresh,
    loadMore,
    setError
  };
};