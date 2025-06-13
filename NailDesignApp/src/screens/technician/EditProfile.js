import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTechnicianProfile } from "../../context/technicianProfileContext";
import {
  SOCIAL_PLATFORMS,
  SPECIALTY_OPTIONS,
} from "../../constants/socialPlatforms";
import * as ImagePicker from "expo-image-picker";
import { profileServices } from "../../services/profileServices";
import { uploadToS3 } from "../../services/s3Services";

const EditProfile = ({ navigation }) => {
  const { profile, fetchProfile } = useTechnicianProfile();
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    bio: "",
    location: "",
    phone_number: "",
    years_experience: "",
    profile_image_url: "",
    social_links: {},
    specialties: [],
  });

  const [selectedSpecialties, setSelectedSpecialties] = useState(new Set());

  useEffect(() => {
    if (profile) {
      const {
        full_name = "",
        bio = "",
        location = "",
        phone_number = "",
        years_experience = "",
        profile_image_url = "",
        social_links = {},
        specialties = [],
      } = profile;

      setFormData({
        full_name,
        bio,
        location,
        phone_number,
        years_experience: years_experience.toString(),
        profile_image_url,
        social_links,
        specialties,
      });

      setSelectedSpecialties(new Set(specialties));
    }
  }, [profile]);

  const avatarUrl = formData.profile_image_url.trim()
    ? formData.profile_image_url
    : `https://avatar.iran.liara.run/username?username=${encodeURIComponent(
        formData.full_name || "unknown"
      )}`;

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSocialLinkChange = (platform, value) => {
    setFormData((prev) => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [platform]: value,
      },
    }));
  };

  const toggleSpecialty = (specialty) => {
    const newSelected = new Set(selectedSpecialties);
    
    if (newSelected.has(specialty)) {
      // Removing a specialty
      newSelected.delete(specialty);
    } else {
      // Adding a specialty - check the limit
      if (newSelected.size >= 3) {
        Alert.alert(
          "Maximum Reached", 
          "You can select up to 3 specialties only. Please remove one to add another.",
          [{ text: "OK" }]
        );
        return;
      }
      newSelected.add(specialty);
    }
    
    setSelectedSpecialties(newSelected);
    setFormData(prev => ({
      ...prev,
      specialties: Array.from(newSelected)
    }));
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "We need access to your photo library.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: [ImagePicker.MediaType.IMAGE],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      handleInputChange("profile_image_url", result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!formData.full_name.trim()) {
      Alert.alert("Error", "Please enter your full name");
      return;
    }

    if (formData.years_experience && isNaN(formData.years_experience)) {
      Alert.alert(
        "Error",
        "Please enter a valid number for years of experience"
      );
      return;
    }

    setIsSaving(true);

    try {
      let profileImageUrl = formData.profile_image_url;

      // If image is a local file (not a remote URL), upload to S3
      if (profileImageUrl && profileImageUrl.startsWith("file://")) {
        const uploadResult = await uploadToS3({ uri: profileImageUrl });

        if (!uploadResult.success) {
          throw new Error("Image upload failed");
        }

        profileImageUrl = uploadResult.url;
      }

      const updatedData = {
        ...formData,
        profile_image_url: profileImageUrl,
        years_experience: formData.years_experience
          ? parseInt(formData.years_experience)
          : 0,
      };

      await profileServices.updateMyProfile(updatedData);

      // Refetch the profile data to update the context
      await fetchProfile();

      Alert.alert("Success", "Profile updated successfully!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error("Error saving profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      "Discard Changes?",
      "Are you sure you want to discard changes?",
      [
        { text: "Keep Editing", style: "cancel" },
        {
          text: "Discard",
          style: "destructive",
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const renderSpecialtyChip = (specialty) => {
    const isSelected = selectedSpecialties.has(specialty);
    const isDisabled = !isSelected && selectedSpecialties.size >= 3;
    
    return (
      <TouchableOpacity
        key={specialty}
        style={[
          styles.specialtyChip,
          isSelected && styles.specialtyChipSelected,
          isDisabled && styles.specialtyChipDisabled,
        ]}
        onPress={() => toggleSpecialty(specialty)}
        disabled={isDisabled}
      >
        <Text
          style={[
            styles.specialtyChipText,
            isSelected && styles.specialtyChipTextSelected,
            isDisabled && styles.specialtyChipTextDisabled,
          ]}
        >
          {specialty}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={isSaving}
        >
          <LinearGradient
            colors={["#fb7185", "#f472b6"]}
            style={styles.saveButtonGradient}
          >
            {isSaving ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.saveButtonText}>Save</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Image Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profile Photo</Text>
            <View style={styles.profileImageSection}>
              <Image source={{ uri: avatarUrl }} style={styles.profileImage} />
              <TouchableOpacity
                style={styles.changePhotoButton}
                onPress={pickImage}
              >
                <LinearGradient
                  colors={["#fb7185", "#f472b6"]}
                  style={styles.changePhotoGradient}
                >
                  <Text style={styles.changePhotoText}>Change Photo</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          {/* Basic Info Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Bio</Text>
              <TextInput
                style={[styles.textInput, styles.textAreaInput]}
                value={formData.bio}
                onChangeText={(value) => handleInputChange("bio", value)}
                placeholder="Tell clients about yourself..."
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Years of Experience</Text>
              <TextInput
                style={styles.textInput}
                value={formData.years_experience}
                onChangeText={(value) =>
                  handleInputChange("years_experience", value)
                }
                placeholder="e.g., 5"
                placeholderTextColor="#9ca3af"
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Contact Info Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>📍 Location</Text>
              <TextInput
                style={styles.textInput}
                value={formData.location}
                onChangeText={(value) => handleInputChange("location", value)}
                placeholder="City, State"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>📞 Phone Number</Text>
              <TextInput
                style={styles.textInput}
                value={formData.phone_number}
                onChangeText={(value) =>
                  handleInputChange("phone_number", value)
                }
                placeholder="(555) 123-4567"
                placeholderTextColor="#9ca3af"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Social Media Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Social Media</Text>
            {Object.entries(SOCIAL_PLATFORMS).map(([platform, icon]) => (
              <View key={platform} style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {icon} {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.social_links[platform] || ""}
                  onChangeText={(value) =>
                    handleSocialLinkChange(platform, value)
                  }
                  placeholder={
                    platform === "website"
                      ? "https://yourwebsite.com"
                      : `@${platform}handle`
                  }
                  placeholderTextColor="#9ca3af"
                  autoCapitalize="none"
                />
              </View>
            ))}
          </View>

          {/* Specialties Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Specialties</Text>
            <Text style={styles.sectionSubtitle}>
              Select up to 3 nail services you specialize in ({selectedSpecialties.size}/3)
            </Text>
            <View style={styles.specialtiesContainer}>
              {SPECIALTY_OPTIONS.map(renderSpecialtyChip)}
            </View>
          </View>

          {/* Bottom spacing */}
          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
  },
  cancelButton: {
    paddingVertical: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#6b7280",
    fontWeight: "500",
  },
  saveButton: {
    borderRadius: 20,
    overflow: "hidden",
  },
  saveButtonGradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 60,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: "#fff",
    marginBottom: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 16,
  },
  profileImageSection: {
    alignItems: "center",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f3f4f6",
    borderWidth: 4,
    borderColor: "#fef3f4",
    marginBottom: 16,
  },
  changePhotoButton: {
    borderRadius: 20,
    overflow: "hidden",
  },
  changePhotoGradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  changePhotoText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111827",
  },
  textAreaInput: {
    height: 100,
    paddingTop: 12,
  },
  specialtiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  specialtyChip: {
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8,
  },
  specialtyChipSelected: {
    backgroundColor: "#fef3f4",
    borderColor: "#fb7185",
  },
  specialtyChipDisabled: {
    backgroundColor: "#f3f4f6",
    borderColor: "#e5e7eb",
    opacity: 0.5,
  },
  specialtyChipText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  specialtyChipTextSelected: {
    color: "#fb7185",
    fontWeight: "600",
  },
  specialtyChipTextDisabled: {
    color: "#9ca3af",
    fontWeight: "400",
  },
});

export default EditProfile;
