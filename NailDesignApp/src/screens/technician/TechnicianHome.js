import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import { signOut } from "aws-amplify/auth";
import { useUser } from "../../context/userContext";
import { authStyles } from "../../styles/authStyles";
import { uploadStyles } from "../../styles/uploadStyles";
import { LinearGradient } from "expo-linear-gradient";
import { useTechnicianProfile } from "../../context/technicianProfileContext";
import {
  SOCIAL_PLATFORMS,
  PLATFORM_URLS,
} from "../../constants/socialPlatforms";
import { Linking } from "react-native";
import { formatTimeAgo } from "../../utils/formatTimeAgo";

const TechnicianHome = ({ navigation }) => {
  const { profile, isLoading } = useTechnicianProfile();
  const { user } = useUser();
  const avatarUrl =
  !profile?.profile_image_url
    ? `https://avatar.iran.liara.run/username?username=${profile.full_name || "unknown"}`
    : profile.profile_image_url;

  const handleEditProfile = () => {
    navigation.navigate("EditProfile", { profile });
  };

  const handleDesignPress = (design) => {
    navigation.navigate("DesignDetail", { design });
  };

  const renderTopDesign = ({ item, index }) => (
    <TouchableOpacity
      style={styles.topDesignCard}
      onPress={() => handleDesignPress(item)}
    >
      <Image source={{ uri: item.image_url }} style={styles.topDesignImage} />
      <View style={styles.topDesignRank}>
        <Text style={styles.topDesignRankText}>#{index + 1}</Text>
      </View>
      <View style={styles.topDesignOverlay}>
        <Text style={styles.topDesignTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <View style={styles.topDesignLikes}>
          <Text style={styles.likesIcon}>❤️</Text>
          <Text style={styles.likesText}>{item.likes.toLocaleString()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderRecentDesign = ({ item }) => (
    <TouchableOpacity
      style={styles.recentDesignCard}
      onPress={() => handleDesignPress(item)}
    >
      <Image
        source={{ uri: item.image_url }}
        style={styles.recentDesignImage}
      />
      <View style={styles.recentDesignInfo}>
        <Text style={styles.recentDesignTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.recentDesignFooter}>
          <View style={styles.recentDesignLikes}>
            <Text style={styles.likesIcon}>❤️</Text>
            <Text style={styles.likesText}>{item.likes}</Text>
          </View>
          <Text style={styles.recentDesignDate}>{item.createdAt}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={authStyles.safeArea}>
      {/* Header with Edit Button */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
          <LinearGradient
            colors={["#fb7185", "#f472b6"]}
            style={styles.editButtonGradient}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{uri: avatarUrl}}
              style={styles.profileImage}
            />
          </View>

          <Text style={styles.fullName}>{profile?.full_name}</Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {profile?.total_likes.toLocaleString()}
              </Text>
              <Text style={styles.statLabel}>Total Likes</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{profile?.total_designs}</Text>
              <Text style={styles.statLabel}>Posted Designs</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {profile?.years_experience}+
              </Text>
              <Text style={styles.statLabel}>Years Exp.</Text>
            </View>
          </View>
        </View>

        {/* Bio Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Me</Text>
          <Text style={styles.bioText}>{profile.bio ? profile.bio : "This technician hasn't added a bio yet."}</Text>
        </View>

        {/* Specialties Section */}
        {profile?.specialties && profile.specialties.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>✨ My Specialties</Text>
            <View style={styles.specialtiesContainer}>
              {profile.specialties.map((specialty, index) => (
                <View key={specialty} style={styles.specialtyChip}>
                  <LinearGradient
                    colors={["#fb7185", "#f472b6"]}
                    style={styles.specialtyGradient}
                  >
                    <Text style={styles.specialtyText}>{specialty}</Text>
                  </LinearGradient>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Contact Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.contactItem}>
            <Text style={styles.contactIcon}>📍</Text>
            <Text style={styles.contactText}>{profile.location ? profile.location : "Location not provided"}</Text>
          </View>
          <View style={styles.contactItem}>
            <Text style={styles.contactIcon}>📞</Text>
            <Text style={styles.contactText}>{profile.phone_number ? profile.phone_number : "Phone number not provided"}</Text>
          </View>
        </View>

        {/* Social Links Section */}
        {profile?.social_links &&
          Object.keys(profile.social_links).length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Social Media</Text>
              <View style={styles.socialLinks}>
                {Object.entries(SOCIAL_PLATFORMS).map(([platform, icon]) => {
                  const link = profile.social_links[platform];
                  if (!link) return null;

                  const url =
                    PLATFORM_URLS[platform]?.(link) ||
                    `https://${link.replace("@", "")}`;

                  return (
                    <TouchableOpacity
                      key={platform}
                      style={styles.socialItem}
                      onPress={() => Linking.openURL(url)}
                    >
                      <Text style={styles.socialIcon}>{icon}</Text>
                      <Text style={styles.socialText}>{link}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

        {/* Top Designs Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✨ Most Loved Designs</Text>
          <FlatList
            data={profile?.top_liked_designs || []}
            keyExtractor={(item) => item.id}
            renderItem={renderTopDesign}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.topDesignsList}
          />
        </View>

        {/* Recent Designs Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🔥 Recent Uploads</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("MyDesigns", { sortBy: "recent" })
              }
            >
              <Text style={styles.editLink}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={(profile?.recent_designs || []).map((design) => ({
              ...design,
              createdAt: formatTimeAgo(design.created_at),
            }))}
            keyExtractor={(item) => item.id}
            renderItem={renderRecentDesign}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recentDesignsList}
          />
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
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
    fontSize: 32,
    fontWeight: "700",
    color: "#1f2937",
    letterSpacing: 0.5,
  },
  editButton: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  editButtonGradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  profileSection: {
    backgroundColor: "#fff",
    alignItems: "center",
    paddingVertical: 32,
    marginBottom: 16,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f3f4f6",
    borderWidth: 4,
    borderColor: "#fef3f4",
  },
  editPhotoButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fb7185",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  editPhotoIcon: {
    fontSize: 16,
  },
  fullName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fb7185",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#e5e7eb",
  },
  section: {
    backgroundColor: "#fff",
    marginBottom: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  editLink: {
    fontSize: 14,
    color: "#fb7185",
    fontWeight: "600",
  },
  bioText: {
    fontSize: 16,
    color: "#4b5563",
    lineHeight: 24,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  contactIcon: {
    fontSize: 16,
    marginRight: 12,
    width: 20,
  },
  contactText: {
    fontSize: 16,
    color: "#374151",
    flex: 1,
  },
  socialLinks: {
    gap: 12,
  },
  socialItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  socialIcon: {
    fontSize: 16,
    marginRight: 12,
    width: 20,
  },
  socialText: {
    fontSize: 16,
    color: "#fb7185",
    fontWeight: "500",
  },
  topDesignsList: {
    paddingRight: 20,
  },
  topDesignCard: {
    width: 160,
    height: 160,
    borderRadius: 16,
    marginRight: 12,
    overflow: "hidden",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  topDesignImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f3f4f6",
  },
  topDesignRank: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#fb7185",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  topDesignRankText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "700",
  },
  topDesignOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 12,
  },
  topDesignTitle: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
    marginBottom: 4,
  },
  topDesignLikes: {
    flexDirection: "row",
    alignItems: "center",
  },
  likesIcon: {
    fontSize: 10,
    marginRight: 4,
  },
  likesText: {
    fontSize: 11,
    color: "#fff",
    fontWeight: "600",
  },
  recentDesignsList: {
    paddingRight: 20,
  },
  recentDesignCard: {
    width: 200,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    overflow: "hidden",
  },
  recentDesignImage: {
    width: "100%",
    height: 120,
    backgroundColor: "#f3f4f6",
  },
  recentDesignInfo: {
    padding: 12,
  },
  recentDesignTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  recentDesignFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recentDesignLikes: {
    flexDirection: "row",
    alignItems: "center",
  },
  recentDesignDate: {
    fontSize: 11,
    color: "#9ca3af",
    fontWeight: "500",
  },
  specialtiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    marginTop: 4,
  },
  specialtyChip: {
    flex: 1,
    maxWidth: "30%",
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#fb7185",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  specialtyGradient: {
    paddingHorizontal: 12,
    paddingVertical: 0,
    alignItems: "center",
    justifyContent: "center",
    height: 48,
  },
  specialtyText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 0.3,
    lineHeight: 16,
    numberOfLines: 2,
  },
});

export default TechnicianHome;
