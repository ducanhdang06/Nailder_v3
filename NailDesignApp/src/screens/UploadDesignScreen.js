import React, { useState } from "react";
import { View, Text, Button, Image, ScrollView, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { uploadData, getUrl } from "aws-amplify/storage";

const UploadDesignScreen = ({ navigation }) => {
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

  const pickExtraImage = async () => {
    if (extraImages.length >= 4) {
      Alert.alert("Limit reached", "You can upload up to 4 extra images.");
      return;
    }
    await pickImage((img) => setExtraImages([...extraImages, img]));
  };

  const uploadToS3 = async (file) => {
    const response = await fetch(file.uri);
    const blob = await response.blob();
    const filename = `${Date.now()}-${file.fileName || "image"}.jpg`;

    // Upload the file
    const result = await uploadData({
      key: filename,
      data: blob,
      options: {
        contentType: "image/jpeg",
      },
    }).result;

    // Get the URL
    const urlResult = await getUrl({
      key: result.key,
    });

    return urlResult.url.toString();
  };

  const handleSubmit = async () => {
    if (!mainImage) {
      Alert.alert("Missing Main Image", "Please upload a main image.");
      return;
    }

    try {
      console.log("Uploading main image...");
      const mainUrl = await uploadToS3(mainImage);
      console.log("Main image uploaded:", mainUrl);

      console.log(`Uploading ${extraImages.length} extra images...`);
      const extraUrls = await Promise.all(
        extraImages.map(async (img, index) => {
          console.log(`Uploading extra image ${index + 1}...`);
          const url = await uploadToS3(img);
          console.log(`Extra image ${index + 1} uploaded:`, url);
          return url;
        })
      );

      Alert.alert("Success", "Design uploaded!");
    } catch (err) {
      console.error(err);
      Alert.alert("Upload failed", err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text>Main Image:</Text>
      {mainImage && (
        <Image
          source={{ uri: mainImage.uri }}
          style={{ width: 200, height: 200 }}
        />
      )}
      <Button
        title="Select Main Image"
        onPress={() => pickImage(setMainImage)}
      />

      <Text style={{ marginTop: 20 }}>Extra Images:</Text>
      <ScrollView horizontal>
        {extraImages.map((img, index) => (
          <Image
            key={index}
            source={{ uri: img.uri }}
            style={{ width: 100, height: 100, marginRight: 10 }}
          />
        ))}
      </ScrollView>
      <Button title="Add Extra Image" onPress={pickExtraImage} />

      <View style={{ marginTop: 30 }}>
        <Button title="Submit Design" onPress={handleSubmit} />
      </View>
      <Button
        title="Back To Home"
        onPress={() => navigation.navigate("TechnicianHome")}
      />
    </ScrollView>
  );
};

export default UploadDesignScreen;
