import React from 'react';
import { View, Image, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { detailsStyles } from '../../styles/detailsStyles';

const ImageGallery = ({
  allImages,
  currentImageIndex,
  loadedImages,
  imagesToRender,
  onImageLoad,
  onImageError,
  onFirstImageLoad,
  onPrevious,
  onNext,
  onGoToImage,
  canGoBack,
  canGoForward,
  loadingFirstImage,
}) => {
  return (
    <View style={detailsStyles.imageSection}>
      <View style={detailsStyles.imageContainer}>
        {/* Show loading placeholder for current image if not loaded */}
        {!loadedImages.has(currentImageIndex) && (
          <View style={[detailsStyles.mainImage, detailsStyles.imagePlaceholder]}>
            <ActivityIndicator size="large" color="#fb7185" />
            <Text style={detailsStyles.placeholderText}>Loading image...</Text>
          </View>
        )}
        
        {/* Only render current and adjacent images */}
        {imagesToRender.map((index) => (
          <Image
            key={index}
            source={{ uri: allImages[index] }}
            style={[
              detailsStyles.mainImage,
              {
                position: index === 0 ? 'relative' : 'absolute',
                opacity: currentImageIndex === index && loadedImages.has(index) ? 1 : 0,
                zIndex: currentImageIndex === index ? 1 : 0,
              }
            ]}
            resizeMode="cover"
            onLoad={() => {
              if (index === 0 && loadingFirstImage) {
                onFirstImageLoad();
              }
              onImageLoad(index);
            }}
            onError={(error) => onImageError(index, error)}
          />
        ))}
        
        {/* Navigation Arrows */}
        {allImages.length > 1 && (
          <>
            {/* Left Arrow */}
            {canGoBack && (
              <TouchableOpacity
                style={[detailsStyles.arrowButton, detailsStyles.leftArrow]}
                onPress={onPrevious}
              >
                <Text style={detailsStyles.arrowIcon}>‹</Text>
              </TouchableOpacity>
            )}
            
            {/* Right Arrow */}
            {canGoForward && (
              <TouchableOpacity
                style={[detailsStyles.arrowButton, detailsStyles.rightArrow]}
                onPress={onNext}
              >
                <Text style={detailsStyles.arrowIcon}>›</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
      
      {/* Image indicators */}
      {allImages.length > 1 && (
        <View style={detailsStyles.imageIndicators}>
          {allImages.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                detailsStyles.indicator,
                currentImageIndex === index && detailsStyles.activeIndicator
              ]}
              onPress={() => onGoToImage(index)}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default ImageGallery;