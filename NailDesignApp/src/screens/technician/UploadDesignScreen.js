import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Alert,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { uploadData, getUrl } from "aws-amplify/storage";
import { fetchAuthSession } from "aws-amplify/auth";
import { API_BASE_URL } from "../../config";
import authStyles from "../../styles/authStyles";
import uploadStyles from "../../styles/uploadStyles";

const UploadDesignScreen = () => {
  const [mainImage, setMainImage] = useState(null);
  const [extraImages, setExtraImages] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);

  const CLOUDFRONT_DOMAIN = "https://djuov8miln44j.cloudfront.net"; // change the cloudfront domain if needed

  const pickImage = async (setImage) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const pickExtraImage = async () => {
    if (extraImages.length >= 4) {
      Alert.alert("Limit reached", "You can upload up to 4 extra images.");
      return;
    }
    await pickImage((img) => setExtraImages([...extraImages, img]));
  };

  const uploadToS3 = async (file) => {
    try {
      // Convert file to blob
      const response = await fetch(file.uri);
      const blob = await response.blob();

      // Generate unique filename
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 15);
      const fileExtension = file.fileName
        ? file.fileName.split(".").pop()
        : file.type?.includes("image")
        ? "jpg"
        : "jpg";
      const filename = `designs/${timestamp}-${randomId}.${fileExtension}`;

      // Upload to S3 with guest access (public)
      const result = await uploadData({
        key: filename,
        data: blob,
        options: {
          contentType: file.type || "image/jpeg",
          contentDisposition: "inline",
          accessLevel: "guest", // This makes it publicly accessible
        },
      }).result;

      console.log("Upload successful:", result);

      // Get the public URL using Amplify's getUrl
      const publicUrl = `${CLOUDFRONT_DOMAIN}/public/${filename}`;

      return {
        key: filename,
        url: publicUrl,
        success: true,
      };
    } catch (error) {
      console.error("S3 Upload Error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  };

  const addTag = () => {
    const cleaned = tagInput.trim();
    if (cleaned && !tags.includes(cleaned)) {
      setTags([...tags, cleaned]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async () => {
    if (!mainImage) {
      Alert.alert("Missing Main Image", "Please upload a main image.");
      return;
    }

    if (!title || title.length > 50) {
      Alert.alert(
        "Title required",
        "Title is required and must be under 50 characters."
      );
      return;
    }

    if (description.length > 300) {
      Alert.alert(
        "Description too long",
        "Description must be under 300 characters."
      );
      return;
    }

    try {
      console.log("Uploading main image...");
      const mainResult = await uploadToS3(mainImage);

      // Check if upload was successful
      if (!mainResult.success) {
        Alert.alert(
          "Upload Failed",
          mainResult.error || "Failed to upload main image"
        );
        return;
      }

      console.log("Main image uploaded:", mainResult.url);

      console.log(`Uploading ${extraImages.length} extra images...`);
      const extraResults = await Promise.all(
        extraImages.map(async (img, index) => {
          console.log(`Uploading extra image ${index + 1}...`);
          const result = await uploadToS3(img);
          console.log(`Extra image ${index + 1} uploaded:`, result);
          return result;
        })
      );

      // Check if any extra image uploads failed
      const failedUploads = extraResults.filter((result) => !result.success);
      if (failedUploads.length > 0) {
        Alert.alert("Upload Failed", "Some extra images failed to upload");
        return;
      }

      // Extract URLs from successful results
      const extraUrls = extraResults.map((result) => result.url);

      // Update database via backend
      const token = (await fetchAuthSession()).tokens?.idToken?.toString();

      if (!token) {
        Alert.alert("Authentication Error", "Please log in again");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/designs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          image_url: mainResult.url, // Use the URL from the result object
          tags, // array of tags (e.g., ['spring', 'pink'])
          extra_images: extraUrls, // array of extra image S3 URLs
        }),
      });

      if (res.ok) {
        Alert.alert("Success", "Design uploaded!", [
          {
            text: "OK",
            onPress: () => {
              // Clear the form
              setMainImage(null);
              setExtraImages([]);
              setDescription("");
              setTitle("");
              setTagInput("");
              setTags([]);
            },
          },
        ]);
        // Optionally reset state or navigate
      } else {
        const error = await res.json();
        Alert.alert("❌ Upload Failed", error.error || "Unknown error.");
      }
    } catch (err) {
      console.error("Submit error:", err);
      Alert.alert(
        "Upload failed",
        err.message || "An unexpected error occurred"
      );
    }
  };

  return (
    <SafeAreaView style={authStyles.safeArea}>
      {/* Page Name/Header */}
      <View style={uploadStyles.pageHeader}>
        <Text style={uploadStyles.pageHeaderTitle}>Upload Design</Text>
      </View>
      <ScrollView contentContainerStyle={uploadStyles.scrollContainer}>
        <View style={uploadStyles.containerWithoutCard}>
          {/* Main Image Section */}
          <View style={authStyles.inputContainer}>
            <Text style={authStyles.label}>Main Image *</Text>
            {mainImage && (
              <View style={uploadStyles.imagePreviewContainer}>
                <Image
                  source={{ uri: mainImage.uri }}
                  style={uploadStyles.mainImagePreview}
                />
              </View>
            )}
            <TouchableOpacity
              style={uploadStyles.secondaryButton}
              onPress={() => pickImage(setMainImage)}
            >
              <Text style={uploadStyles.secondaryButtonText}>
                {mainImage ? "Change Main Image" : "Select Main Image"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Extra Images Section */}
          <View style={authStyles.inputContainer}>
            <Text style={authStyles.label}>Additional Images (Optional)</Text>
            <Text style={uploadStyles.helperText}>
              You can add up to 4 extra images
            </Text>
            {extraImages.length > 0 && (
              <ScrollView
                horizontal
                style={uploadStyles.extraImagesContainer}
                showsHorizontalScrollIndicator={false}
              >
                {extraImages.map((img, index) => (
                  <View key={index} style={uploadStyles.extraImageWrapper}>
                    <Image
                      source={{ uri: img.uri }}
                      style={uploadStyles.extraImagePreview}
                    />
                    <TouchableOpacity
                      style={uploadStyles.removeImageButton}
                      onPress={() =>
                        setExtraImages(
                          extraImages.filter((_, i) => i !== index)
                        )
                      }
                    >
                      <Text style={uploadStyles.removeImageText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}
            <TouchableOpacity
              style={uploadStyles.secondaryButton}
              onPress={pickExtraImage}
              disabled={extraImages.length >= 4}
            >
              <Text
                style={[
                  uploadStyles.secondaryButtonText,
                  extraImages.length >= 4 && uploadStyles.disabledText,
                ]}
              >
                Add Extra Image ({extraImages.length}/4)
              </Text>
            </TouchableOpacity>
          </View>

          {/* Title Input */}
          <View style={authStyles.inputContainer}>
            <Text style={authStyles.label}>Design Title *</Text>
            <TextInput
              maxLength={50}
              placeholder="Enter a catchy title for your design"
              value={title}
              onChangeText={setTitle}
              placeholderTextColor="#9ca3af"
              style={authStyles.input}
            />
            <Text style={uploadStyles.characterCount}>{title.length}/50</Text>
          </View>

          {/* Description Input */}
          <View style={authStyles.inputContainer}>
            <Text style={authStyles.label}>Description</Text>
            <TextInput
              maxLength={300}
              placeholder="Describe your design, techniques used, inspiration..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              placeholderTextColor="#9ca3af"
              style={[authStyles.input, uploadStyles.textArea]}
            />
            <Text style={uploadStyles.characterCount}>
              {description.length}/300
            </Text>
          </View>

          {/* Tags Section */}
          <View style={authStyles.inputContainer}>
            <Text style={authStyles.label}>Tags</Text>
            <Text style={uploadStyles.helperText}>
              Add tags to help others discover your design
            </Text>

            <View style={uploadStyles.tagInputContainer}>
              <TextInput
                maxLength={10}
                placeholder="Add tag (e.g. 'spring', 'glitter')"
                value={tagInput}
                onChangeText={setTagInput}
                placeholderTextColor="#9ca3af"
                style={[authStyles.input, uploadStyles.tagInput]}
                onSubmitEditing={addTag}
              />
              <TouchableOpacity
                onPress={addTag}
                style={uploadStyles.addTagButton}
              >
                <LinearGradient
                  colors={["#fb7185", "#ec4899"]}
                  style={uploadStyles.addTagGradient}
                >
                  <Text style={uploadStyles.addTagText}>Add</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {tags.length > 0 && (
              <View style={uploadStyles.tagsContainer}>
                {tags.map((tag, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => removeTag(tag)}
                    style={uploadStyles.tagChip}
                  >
                    <Text style={uploadStyles.tagText}>#{tag}</Text>
                    <Text style={uploadStyles.removeTagText}> ✕</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={authStyles.primaryButton}
            onPress={handleSubmit}
          >
            <LinearGradient
              colors={["#fb7185", "#ec4899"]}
              style={authStyles.buttonGradient}
            >
              <Text style={authStyles.primaryButtonText}>Upload Design</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UploadDesignScreen;
