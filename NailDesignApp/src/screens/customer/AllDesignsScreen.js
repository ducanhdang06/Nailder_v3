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
import { allDesignsStyles } from "../../styles/AllDesignsStyles";

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
      style={[allDesignsStyles.designCard, index % 2 === 1 && allDesignsStyles.designCardRight]}
      onPress={() => {
        // Navigate to design details
        navigation.navigate("DesignDetail", { design: item });
      }}
    >
      <View style={allDesignsStyles.designImageContainer}>
        <Image source={{ uri: item.imageUrl }} style={allDesignsStyles.designImage} />

        {/* Ranking Badge */}
        <View style={allDesignsStyles.rankBadge}>
          <Text style={allDesignsStyles.rankText}>#{item.rank}</Text>
        </View>
      </View>

      <View style={allDesignsStyles.designInfo}>
        <Text style={allDesignsStyles.designTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={allDesignsStyles.designCreator} numberOfLines={1}>
          by {item.creator}
        </Text>

        <View style={allDesignsStyles.designFooter}>
          <View style={allDesignsStyles.likesContainer}>
            <Text style={allDesignsStyles.likesIcon}>❤️</Text>
            <Text style={allDesignsStyles.likesCount}>{item.likes.toLocaleString()}</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={allDesignsStyles.tagsScroll}
          >
            {item.tags.slice(0, 2).map((tag, index) => (
              <View key={index} style={allDesignsStyles.tagMini}>
                <Text style={allDesignsStyles.tagMiniText}>{tag}</Text>
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
      <View style={allDesignsStyles.header}>
        <TouchableOpacity
          style={allDesignsStyles.headerBackButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={allDesignsStyles.headerBackText}>←</Text>
        </TouchableOpacity>
      </View>

      <View style={allDesignsStyles.container}>
        {isLoading ? (
          <View style={allDesignsStyles.loadingContainer}>
            <ActivityIndicator size="large" color="#fb7185" />
            <Text style={allDesignsStyles.loadingText}>Loading amazing designs...</Text>
          </View>
        ) : (
          <FlatList
            data={designs}
            keyExtractor={(item) => item.id}
            renderItem={renderDesignItem}
            numColumns={2}
            contentContainerStyle={allDesignsStyles.designsList}
            showsVerticalScrollIndicator={false}
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        )}
      </View>
    </SafeAreaView>
  );
};


export default AllDesignsScreen;
