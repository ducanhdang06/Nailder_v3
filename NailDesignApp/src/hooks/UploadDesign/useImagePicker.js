// manages image selection and storage
import { useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export const useImagePicker = () => {
  const [mainImage, setMainImage] = useState(null);
  const [extraImages, setExtraImages] = useState([]);

  const pickImage = async (setImage) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const pickMainImage = () => pickImage(setMainImage);

  const pickExtraImage = async () => {
    if (extraImages.length >= 4) {
      Alert.alert("Limit reached", "You can upload up to 4 extra images.");
      return;
    }
    await pickImage((img) => setExtraImages([...extraImages, img]));
  };

  const removeExtraImage = (index) => {
    setExtraImages(extraImages.filter((_, i) => i !== index));
  };

  const clearImages = () => {
    setMainImage(null);
    setExtraImages([]);
  };

  return {
    mainImage,
    extraImages,
    pickMainImage,
    pickExtraImage,
    removeExtraImage,
    clearImages,
  };
};
