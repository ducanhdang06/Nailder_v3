// Purpose: Handles all swipe-related actions and API calls

// Records swipe actions (like/pass) to the backend
// Tracks current swipe position/index
// Provides unified swipe handling for different swipe types
// Manages swipe state and provides reset functionality
// Separates swipe logic from UI concerns

import { useCallback, useState } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { API_BASE_URL } from '../config';

export const useSwipeActions = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

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

      console.log(`💾 Swipe recorded: ${designId} - ${liked ? 'liked' : 'passed'}`);
    } catch (err) {
      console.error("Failed to record swipe:", err);
    }
  }, []);

  const handleSwipe = useCallback((design, liked, swipeType) => {
    console.log(`${swipeType} on: ${design.title}`);
    postSwipe(design.id, liked);
    setCurrentIndex(prev => prev + 1);
  }, [postSwipe]);

  const resetIndex = useCallback(() => {
    setCurrentIndex(0);
  }, []);

  return {
    currentIndex,
    handleSwipe,
    resetIndex
  };
};