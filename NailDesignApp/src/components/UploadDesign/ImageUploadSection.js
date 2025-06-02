import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { authStyles } from '../../styles/authStyles';
import { uploadStyles } from '../../styles/uploadStyles';

export const MainImageSection = ({ mainImage, onPickImage }) => (
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
      onPress={onPickImage}
    >
      <Text style={uploadStyles.secondaryButtonText}>
        {mainImage ? "Change Main Image" : "Select Main Image"}
      </Text>
    </TouchableOpacity>
  </View>
);

export const ExtraImagesSection = ({ 
  extraImages, 
  onPickExtraImage, 
  onRemoveImage 
}) => (
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
              onPress={() => onRemoveImage(index)}
            >
              <Text style={uploadStyles.removeImageText}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    )}
    <TouchableOpacity
      style={uploadStyles.secondaryButton}
      onPress={onPickExtraImage}
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
);