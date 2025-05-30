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

      console.log(`Swipe recorded: ${designId} - ${liked ? 'liked' : 'passed'}`);
    } catch (err) {
      console.error("Failed to record swipe:", err);
      // You might want to show a toast or some user feedback here
    }
  }, []);

  const handleSwipeLeft = useCallback((design) => {
    console.log("Swiped left on:", design.title);
    postSwipe(design.id, false);
  }, [postSwipe]);

  const handleSwipeRight = useCallback((design) => {
    console.log("Swiped right on:", design.title);
    postSwipe(design.id, true);
  }, [postSwipe]);

  const handleSwipeUp = useCallback((design) => {
    console.log("Super liked:", design.title);
    postSwipe(design.id, true); // For now, treat as regular like
  }, [postSwipe]);

  const handleNoMoreCards = useCallback(() => {
    console.log("No more cards available - will fetch new designs after delay");
    // Add a small delay to prevent state conflicts
    setTimeout(() => {
      setRefreshing(true);
      fetchDesigns();
    }, 1000); // 1 second delay to show the "no more cards" message
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
        <Text style={styles.retryText} onPress={() => {
          setError(null);
          setLoading(true);
          fetchDesigns();
        }}>
          Tap to retry
        </Text>
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
    marginBottom: 16,
  },
  retryText: {
    fontSize: 16,
    color: '#007AFF',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default SwipeScreen;
