import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { authStyles } from "../../styles/authStyles";
import { uploadStyles } from "../../styles/uploadStyles";

// Hooks
import { useImagePicker } from "../../hooks/useImagePicker";
import { useFormData } from "../../hooks/useFormData";
import { useDesignUpload } from "../../hooks/useDesignUpload";

// Components
import { MainImageSection, ExtraImagesSection } from "../../components/UploadDesign/ImageUploadSection";
import { TitleInput, DescriptionInput } from "../../components/UploadDesign/FormInputs";
import { TagsSection } from "../../components/UploadDesign/TagSection";

const UploadDesignScreen = () => {
  // Custom hooks
  const imageHook = useImagePicker();
  const formHook = useFormData();
  const { handleUpload } = useDesignUpload();

  const onSubmit = () => {
    const formData = {
      mainImage: imageHook.mainImage,
      extraImages: imageHook.extraImages,
      title: formHook.title,
      description: formHook.description,
      tags: formHook.tags,
    };

    const onSuccess = () => {
      imageHook.clearImages();
      formHook.clearForm();
    };

    handleUpload(formData, onSuccess);
  };

  return (
    <SafeAreaView style={authStyles.safeArea}>
      <View style={uploadStyles.pageHeader}>
        <Text style={uploadStyles.pageHeaderTitle}>Upload Design</Text>
      </View>
      
      <ScrollView contentContainerStyle={uploadStyles.scrollContainer}>
        <View style={uploadStyles.containerWithoutCard}>
          <MainImageSection
            mainImage={imageHook.mainImage}
            onPickImage={imageHook.pickMainImage}
          />

          <ExtraImagesSection
            extraImages={imageHook.extraImages}
            onPickExtraImage={imageHook.pickExtraImage}
            onRemoveImage={imageHook.removeExtraImage}
          />

          <TitleInput
            title={formHook.title}
            setTitle={formHook.setTitle}
          />

          <DescriptionInput
            description={formHook.description}
            setDescription={formHook.setDescription}
          />

          <TagsSection
            tagInput={formHook.tagInput}
            setTagInput={formHook.setTagInput}
            tags={formHook.tags}
            onAddTag={formHook.addTag}
            onRemoveTag={formHook.removeTag}
          />

          <TouchableOpacity
            style={authStyles.primaryButton}
            onPress={onSubmit}
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
