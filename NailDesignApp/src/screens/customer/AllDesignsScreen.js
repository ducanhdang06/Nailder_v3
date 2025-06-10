import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Image,
  TextInput,
  ScrollView,
} from "react-native";
import { useUser } from "../../context/userContext";
import { authStyles } from "../../styles/authStyles";
import { uploadStyles } from "../../styles/uploadStyles";
import { LinearGradient } from "expo-linear-gradient";

const AllDesignsScreen = ({ navigation, route }) => {
  const { user } = useUser();
  const [designs, setDesigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Get passed data from navigation params
  const passedTopDesigns = route?.params?.topDesigns || null;

  useEffect(() => {
    if (passedTopDesigns && passedTopDesigns.length > 0) {
      try {
        const formattedDesigns = passedTopDesigns.map((design, index) => {
          console.log(`Processing design ${index + 1}:`, design.title);

          return {
            ...design,
            rank: index + 1,
            creator: design.designerName || design.creator || "Unknown Artist",
            tags: design.tags
              ? typeof design.tags === "string"
                ? design.tags.split(",")
                : design.tags
              : ["Popular"],
          };
        });
        setDesigns(formattedDesigns);
      } catch (error) {
        console.error("RROR FORMATTING DESIGNS:", error);
      }
      setIsLoading(false);
    } else {
      console.log("NO PASSED DATA");
      console.log("passedTopDesigns:", passedTopDesigns);
      loadTopDesigns();
    }
  }, [passedTopDesigns]);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (passedTopDesigns && passedTopDesigns.length > 0) {
      // If we have passed data, just refresh the formatting (since data is already fresh)
      const formattedDesigns = passedTopDesigns.map((design, index) => ({
        ...design,
        rank: index + 1,
        creator: design.designerName,
        tags: design.tags ? design.tags.split(",") : ["Popular"],
      }));
      setDesigns(formattedDesigns);
    } else {
      console.log("refresh failed");
    }
    setRefreshing(false);
  };

  // ===== RENDER FUNCTIONS =====

  const renderDesignItem = ({ item, index }) => (
    <TouchableOpacity
      style={[styles.designCard, index % 2 === 1 && styles.designCardRight]}
      onPress={() => {
        // Navigate to design details
        navigation.navigate("DesignDetail", { design: item });
      }}
    >
      <View style={styles.designImageContainer}>
        <Image source={{ uri: item.imageUrl }} style={styles.designImage} />

        {/* Ranking Badge */}
        <View style={styles.rankBadge}>
          <Text style={styles.rankText}>#{item.rank}</Text>
        </View>
      </View>

      <View style={styles.designInfo}>
        <Text style={styles.designTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.designCreator} numberOfLines={1}>
          by {item.creator}
        </Text>

        <View style={styles.designFooter}>
          <View style={styles.likesContainer}>
            <Text style={styles.likesIcon}>❤️</Text>
            <Text style={styles.likesCount}>{item.likes.toLocaleString()}</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tagsScroll}
          >
            {item.tags.slice(0, 2).map((tag, index) => (
              <View key={index} style={styles.tagMini}>
                <Text style={styles.tagMiniText}>{tag}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={authStyles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBackButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.headerBackText}>←</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fb7185" />
            <Text style={styles.loadingText}>Loading amazing designs...</Text>
          </View>
        ) : (
          <FlatList
            data={designs}
            keyExtractor={(item) => item.id}
            renderItem={renderDesignItem}
            numColumns={2}
            contentContainerStyle={styles.designsList}
            showsVerticalScrollIndicator={false}
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        )}
      </View>
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
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "transparent",
  },
  headerBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerBackText: {
    fontSize: 20,
    color: "#fb7185",
    fontWeight: "bold",
  },
  designsList: {
    paddingHorizontal: 8,
    paddingTop: 16,
    paddingBottom: 20,
  },
  designCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    margin: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
  },
  designCardRight: {
    // Additional styling for right column if needed
  },
  designImageContainer: {
    position: "relative",
    height: 180,
  },
  designImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f3f4f6",
  },
  rankBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "#fb7185",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  rankText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "700",
  },
  bookmarkButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  bookmarkIcon: {
    fontSize: 14,
  },
  difficultyBadge: {
    position: "absolute",
    bottom: 12,
    left: 12,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "600",
  },
  designInfo: {
    padding: 12,
  },
  designTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
    lineHeight: 18,
  },
  designCreator: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 8,
  },
  designFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  likesContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  likesIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  likesCount: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111827",
  },
  tagsScroll: {
    flex: 1,
    marginLeft: 8,
  },
  tagMini: {
    backgroundColor: "#fef3f4",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 4,
  },
  tagMiniText: {
    fontSize: 10,
    color: "#dc2626",
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: "#6b7280",
    marginTop: 16,
    fontWeight: "500",
  },
});

export default AllDesignsScreen;
