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

const TechnicianHome = ({ navigation }) => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b6e59caf?w=400&h=400&fit=crop',
    fullName: user?.name || 'Sarah Johnson',
    bio: 'Passionate nail artist with 5+ years of experience. Specializing in intricate designs, gel extensions, and nail art. Creating beautiful nails is my art! ✨',
    location: 'Beverly Hills, CA',
    phone: '+1 (555) 123-4567',
    instagram: '@sarahnails_artist',
    tiktok: '@sarahjnails',
    totalLikes: 12847,
    totalDesigns: 156,
    yearsExperience: 5,
    totalClients: 487
  });

  const [topDesigns, setTopDesigns] = useState([
    {
      id: '1',
      title: 'Elegant French Ombré',
      imageUrl: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=400&h=400&fit=crop',
      likes: 2247,
    },
    {
      id: '2',
      title: 'Holographic Chrome',
      imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=400&fit=crop',
      likes: 1987,
    },
    {
      id: '3',
      title: 'Floral Garden Art',
      imageUrl: 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=400&h=400&fit=crop',
      likes: 1856,
    }
  ]);

  const [recentDesigns, setRecentDesigns] = useState([
    {
      id: '4',
      title: 'Minimalist Line Art',
      imageUrl: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=400&h=300&fit=crop',
      likes: 432,
      createdAt: '2 days ago'
    },
    {
      id: '5',
      title: 'Sunset Gradient',
      imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=300&fit=crop',
      likes: 289,
      createdAt: '4 days ago'
    }
  ]);

  const handleSignOut = async () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            try {
              setIsLoading(true);
              await signOut();
              navigation.replace("Login");
            } catch (error) {
              console.error("Sign out error:", error);
              Alert.alert("Error", "Could not sign out. Please try again.");
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleEditProfile = () => {
    navigation.navigate("EditProfile", { profileData });
  };

  const handleEditPhoto = () => {
    Alert.alert(
      "Change Profile Photo",
      "Choose an option",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Camera", onPress: () => console.log("Open camera") },
        { text: "Gallery", onPress: () => console.log("Open gallery") }
      ]
    );
  };

  const handleEditSocials = () => {
    navigation.navigate("EditSocials", { 
      instagram: profileData.instagram,
      tiktok: profileData.tiktok 
    });
  };

  const handleDesignPress = (design) => {
    navigation.navigate("DesignDetail", { design });
  };

  const renderTopDesign = ({ item, index }) => (
    <TouchableOpacity
      style={styles.topDesignCard}
      onPress={() => handleDesignPress(item)}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.topDesignImage} />
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
      <Image source={{ uri: item.imageUrl }} style={styles.recentDesignImage} />
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
            colors={['#fb7185', '#f472b6']}
            style={styles.editButtonGradient}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image 
              source={{ uri: profileData.profileImage }} 
              style={styles.profileImage} 
            />
            <TouchableOpacity 
              style={styles.editPhotoButton}
              onPress={handleEditPhoto}
            >
              <Text style={styles.editPhotoIcon}>📷</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.fullName}>{profileData.fullName}</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{profileData.totalLikes.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Total Likes</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{profileData.totalClients}</Text>
              <Text style={styles.statLabel}>Clients Served</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{profileData.yearsExperience}+</Text>
              <Text style={styles.statLabel}>Years Exp.</Text>
            </View>
          </View>
        </View>

        {/* Bio Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Me</Text>
          <Text style={styles.bioText}>{profileData.bio}</Text>
        </View>

        {/* Contact Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.contactItem}>
            <Text style={styles.contactIcon}>📍</Text>
            <Text style={styles.contactText}>{profileData.location}</Text>
          </View>
          <View style={styles.contactItem}>
            <Text style={styles.contactIcon}>📞</Text>
            <Text style={styles.contactText}>{profileData.phone}</Text>
          </View>
        </View>

        {/* Social Links Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Social Media</Text>
          <View style={styles.socialLinks}>
            <View style={styles.socialItem}>
              <Text style={styles.socialIcon}>📷</Text>
              <Text style={styles.socialText}>{profileData.instagram}</Text>
            </View>
            <View style={styles.socialItem}>
              <Text style={styles.socialIcon}>🎵</Text>
              <Text style={styles.socialText}>{profileData.tiktok}</Text>
            </View>
          </View>
        </View>

        {/* Top Designs Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✨ Most Loved Designs</Text>
          <FlatList
            data={topDesigns}
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
            <TouchableOpacity onPress={() => navigation.navigate("MyDesigns", { sortBy: "recent" })}>
              <Text style={styles.editLink}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={recentDesigns}
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
});

export default TechnicianHome;
