import { Alert } from 'react-native';
import { uploadToS3 } from '../services/s3Services';
import { submitDesign } from '../services/submitDesigns';
import { validateDesignForm } from '../utils/validation';

export const useDesignUpload = () => {
  const handleUpload = async (formData, onSuccess) => {
    const { mainImage, extraImages, title, description, tags } = formData;
    
    // Validate form
    const validation = validateDesignForm(mainImage, title, description);
    if (!validation.isValid) {
      Alert.alert("Validation Error", validation.error);
      return;
    }

    try {
      console.log("Uploading main image...");
      const mainResult = await uploadToS3(mainImage);

      if (!mainResult.success) {
        Alert.alert("Upload Failed", mainResult.error || "Failed to upload main image");
        return;
      }

      console.log("Main image uploaded:", mainResult.url);

      // Upload extra images
      console.log(`Uploading ${extraImages.length} extra images...`);
      const extraResults = await Promise.all(
        extraImages.map(async (img, index) => {
          console.log(`Uploading extra image ${index + 1}...`);
          const result = await uploadToS3(img);
          console.log(`Extra image ${index + 1} uploaded:`, result);
          return result;
        })
      );

      // Check for failed uploads
      const failedUploads = extraResults.filter((result) => !result.success);
      if (failedUploads.length > 0) {
        Alert.alert("Upload Failed", "Some extra images failed to upload");
        return;
      }

      // Extract URLs from successful results
      const extraUrls = extraResults.map((result) => result.url);

      // Submit to backend
      await submitDesign({
        title,
        description,
        image_url: mainResult.url,
        tags,
        extra_images: extraUrls,
      });

      Alert.alert("Success", "Design uploaded!", [
        {
          text: "OK",
          onPress: onSuccess,
        },
      ]);
    } catch (err) {
      console.error("Submit error:", err);
      Alert.alert("Upload failed", err.message || "An unexpected error occurred");
    }
  };

  return { handleUpload };
};