// Purpose: Manages all design data fetching logic and state

// Handles API calls to fetch designs with throttling and deduplication
// Manages loading, error, and refresh states
// Implements batch fetching with pagination
// Provides methods for refreshing and loading more designs
// Encapsulates all network-related logic and caching behavior

import { useState, useCallback, useRef, useEffect } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { API_BASE_URL } from '../../config';
import { useUser } from '../../context/userContext';

const MIN_FETCH_INTERVAL = 5000;

export const useDesignFeed = () => {
  const { user } = useUser();
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  
  const fetchingRef = useRef(false);
  const lastFetchTimeRef = useRef(0);
  const hasInitializedRef = useRef(false);

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
      
      if (!token) {
        console.log("❌ No auth token available, skipping fetch");
        return;
      }
      
      const batchSize = 20;
      console.log(`📡 Fetching ${batchSize} designs...`);
      
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
          console.log(`➕ Adding ${newDesigns.length} new unique designs`);
          return [...prev, ...newDesigns];
        });
      }
      
      if (data.length < batchSize) {
        setHasReachedEnd(true);
        console.log("🏁 Reached end of available designs");
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
    console.log("🔄 Manual refresh triggered");
    fetchDesigns(true);
  }, [fetchDesigns]);

  const loadMore = useCallback(() => {
    if (hasReachedEnd || fetchingRef.current) {
      console.log("⚠️ Cannot load more - reached end or fetching in progress");
      return;
    }
    
    const now = Date.now();
    if ((now - lastFetchTimeRef.current) < MIN_FETCH_INTERVAL) {
      console.log("⏰ Load more throttled");
      return;
    }
    
    console.log("⚠️ Running low on cards, attempting to prefetch...");
    setTimeout(() => {
      if (!fetchingRef.current && !hasReachedEnd) {
        console.log("🚀 Executing prefetch...");
        fetchDesigns(false);
      }
    }, 1000);
  }, [fetchDesigns, hasReachedEnd]);

  // Only fetch when user is authenticated and not already initialized
  useEffect(() => {
    if (user && !hasInitializedRef.current) {
      console.log("👤 User authenticated, initializing design feed...");
      hasInitializedRef.current = true;
      fetchDesigns(true);
    }
  }, [user, fetchDesigns]);

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