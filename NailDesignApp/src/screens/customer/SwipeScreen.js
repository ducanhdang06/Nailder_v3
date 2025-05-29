import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, ActivityIndicator, Text } from "react-native";
import TinderSwipeCards from "../../components/TinderSwipeCards";
import { API_BASE_URL } from "../../config";
import { fetchAuthSession } from "aws-amplify/auth";

const SwipeScreen = () => {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDesigns = useCallback(async () => {
    try {
      const token = (await fetchAuthSession()).tokens?.idToken?.toString();
      
      const res = await fetch(`${API_BASE_URL}/api/feed/unseen`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Number of unseen designs fetched: ", data.length);
      setDesigns(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch designs:", err);
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDesigns();
  }, [fetchDesigns]);

  const postSwipe = useCallback(async (designId, liked) => {
    try {
      const token = (await fetchAuthSession()).tokens?.idToken?.toString();
      
      const res = await fetch(`${API_BASE_URL}/api/matches`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ design_id: designId, liked }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
    } catch (err) {
      console.error("Failed to record swipe:", err);
      // You might want to show a toast or some user feedback here
    }
  }, []);

  const handleSwipeLeft = useCallback((design) => {
    console.log("Swiped left on:", design.title);
    postSwipe(design.id, false);
    
    // Remove the swiped design from the local state
    setDesigns(prevDesigns => prevDesigns.filter(d => d.id !== design.id));
  }, [postSwipe]);

  const handleSwipeRight = useCallback((design) => {
    console.log("Swiped right on:", design.title);
    postSwipe(design.id, true);
    
    // Remove the swiped design from the local state
    setDesigns(prevDesigns => prevDesigns.filter(d => d.id !== design.id));
  }, [postSwipe]);

  const handleSwipeUp = useCallback((design) => {
    console.log("Super liked:", design.title);
    // TODO: Implement super like API call
    postSwipe(design.id, true); // For now, treat as regular like
    
    // Remove the swiped design from the local state
    setDesigns(prevDesigns => prevDesigns.filter(d => d.id !== design.id));
  }, [postSwipe]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDesigns();
  }, [fetchDesigns]);

  const handleNoMoreCards = useCallback(() => {
    // Called when user has swiped through all cards
    console.log("No more cards available");
    // You might want to show a message or fetch more designs
    fetchDesigns();
  }, [fetchDesigns]);

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading designs...</Text>
      </View>
    );
  }

  if (error && !refreshing) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load designs</Text>
        <Text style={styles.errorSubtext}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TinderSwipeCards
        designs={designs}
        onSwipeLeft={handleSwipeLeft}
        onSwipeRight={handleSwipeRight}
        onSwipeUp={handleSwipeUp}
        onRefresh={handleRefresh}
        onNoMoreCards={handleNoMoreCards}
        refreshing={refreshing}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff4444',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default SwipeScreen;
