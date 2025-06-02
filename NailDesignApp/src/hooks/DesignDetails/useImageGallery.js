import { useState, useEffect } from 'react';

export const useImageGallery = (allImages, designId) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadingFirstImage, setLoadingFirstImage] = useState(true);
  const [loadedImages, setLoadedImages] = useState(new Set());

  // Reset loading state when design changes
  useEffect(() => {
    console.log(`🔄 New design: ${allImages.length} images total`);
    setLoadingFirstImage(true);
    setLoadedImages(new Set());
    setCurrentImageIndex(0);
    
    // Fallback timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.log("⏰ Timeout reached, showing content anyway");
      setLoadingFirstImage(false);
    }, 2000);
    
    return () => clearTimeout(timeout);
  }, [designId]);

  // Log when current index changes
  useEffect(() => {
    console.log(`👆 Switched to image ${currentImageIndex + 1}/${allImages.length}`);
  }, [currentImageIndex, allImages.length]);

  // Handle first image load
  const handleFirstImageLoad = () => {
    console.log("✅ First image loaded, showing content");
    setLoadingFirstImage(false);
    setLoadedImages(prev => new Set([...prev, 0]));
  };

  // Handle any image load
  const handleImageLoad = (index) => {
    console.log(`📸 Image ${index + 1} loaded`);
    setLoadedImages(prev => new Set([...prev, index]));
  };

  // Handle image load errors
  const handleImageError = (index, error) => {
    console.log(`❌ Image ${index + 1} load error:`, error);
    // Still mark as "loaded" to prevent blocking
    setLoadedImages(prev => new Set([...prev, index]));
  };

  // Get images to render (current + adjacent for smooth navigation)
  const getImagesToRender = () => {
    const indicesToRender = new Set();
    
    // Always render current image
    indicesToRender.add(currentImageIndex);
    
    // Preload previous and next images for smooth navigation
    if (currentImageIndex > 0) {
      indicesToRender.add(currentImageIndex - 1);
    }
    if (currentImageIndex < allImages.length - 1) {
      indicesToRender.add(currentImageIndex + 1);
    }
    
    // Also render the first image if not already included (for initial load)
    indicesToRender.add(0);
    
    return Array.from(indicesToRender).sort((a, b) => a - b);
  };

  // Navigation functions
  const goToPrevious = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentImageIndex < allImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const goToImage = (index) => {
    if (index >= 0 && index < allImages.length) {
      setCurrentImageIndex(index);
    }
  };

  return {
    currentImageIndex,
    loadingFirstImage,
    loadedImages,
    handleFirstImageLoad,
    handleImageLoad,
    handleImageError,
    getImagesToRender,
    goToPrevious,
    goToNext,
    goToImage,
    canGoBack: currentImageIndex > 0,
    canGoForward: currentImageIndex < allImages.length - 1,
  };
};