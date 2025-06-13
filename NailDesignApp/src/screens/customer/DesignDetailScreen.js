// screens/DesignDetail/index.js
import React from "react";
import { SafeAreaView, ScrollView } from "react-native";
import { authStyles } from "../../styles/authStyles";
import { LoadingSpinner } from "../../components/LoadingStates";

// Components
import DesignHeader from "../../components/DesignDetails/DesignHeader";
import ImageGallery from "../../components/DesignDetails/ImageGallery";
import DesignInfo from "../../components/DesignDetails/DesignInfo";
import ActionButtons from "../../components/DesignDetails/ActionButtons";
import ConfirmationModal from "../../components/Common/ConfirmationModal";

// Hooks
import { useImageGallery } from "../../hooks/DesignDetails/useImageGallery";
import { useDesignActions } from "../../hooks/DesignDetails/useDesignActions";

// Utils
import { getAllImages } from "../../utils/designHelpers";

const DesignDetailScreen = ({ route, navigation }) => {
  const { design } = route.params;
  
  // Get all images for the gallery
  const allImages = getAllImages(design);
  
  // Image gallery state and handlers
  const {
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
    canGoBack,
    canGoForward,
  } = useImageGallery(allImages, design.id);

  // Design action handlers
  const { 
    handleContactNow, 
    handleUnsave, 
    showConfirmModal, 
    handleCloseModal, 
    performUnsave 
  } = useDesignActions(design, navigation);

  // Navigation handler
  const handleBack = () => navigation.goBack();

  // Show loading state only while first image is loading
  if (loadingFirstImage) {
    return <LoadingSpinner message="Loading design..." />;
  }

  return (
    <SafeAreaView style={authStyles.safeArea}>
      {/* Header with back button */}
      <DesignHeader onBack={handleBack} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <ImageGallery
          allImages={allImages}
          currentImageIndex={currentImageIndex}
          loadedImages={loadedImages}
          imagesToRender={getImagesToRender()}
          onImageLoad={handleImageLoad}
          onImageError={handleImageError}
          onFirstImageLoad={handleFirstImageLoad}
          onPrevious={goToPrevious}
          onNext={goToNext}
          onGoToImage={goToImage}
          canGoBack={canGoBack}
          canGoForward={canGoForward}
          loadingFirstImage={loadingFirstImage}
        />

        {/* Design Information */}
        <DesignInfo design={design} navigation={navigation} />
      </ScrollView>

      {/* Bottom Action Buttons */}
      <ActionButtons 
        onUnsave={handleUnsave}
        onContact={handleContactNow}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        visible={showConfirmModal}
        onClose={handleCloseModal}
        onConfirm={performUnsave}
        title="Unsave Design"
        message={`Are you sure you want to remove "${design.title}" from your saved designs?`}
        confirmText="Yes, Unsave"
        cancelText="Cancel"
        confirmStyle="destructive"
      />
    </SafeAreaView>
  );
};

export default DesignDetailScreen;