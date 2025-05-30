import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { fetchAuthSession } from "aws-amplify/auth";
import { API_BASE_URL } from "../../config";
import { authStyles } from "../../styles/authStyles";
import { uploadStyles } from "../../styles/uploadStyles";
import { sDesignsStyles } from "../../styles/sDesignsStyles";
import { formatTimeAgo } from "../../utils/formatTimeAgo";
import { ConsoleLogger } from "aws-amplify/utils";

export default function TechnicianPosted() {
  const [postedDesigns, setPostedDesigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostedDesigns = async () => {
      try {
        const token = (await fetchAuthSession()).tokens?.idToken?.toString();
        const res = await fetch(`${API_BASE_URL}/api/designs/mine`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setPostedDesigns(data);
        console.log(data[0].created_at)
      } catch (err) {
        console.error("❌ Failed to fetch posted designs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPostedDesigns();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={sDesignsStyles.card}>
      <Image source={{ uri: item.image_url }} style={sDesignsStyles.image} />
      <View style={sDesignsStyles.cardContent}>
        <Text style={sDesignsStyles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={sDesignsStyles.designer}>{formatTimeAgo(item.created_at)}</Text>
        <Text style={sDesignsStyles.likes}>❤️ {item.likes}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={authStyles.safeArea}>
        <View style={uploadStyles.pageHeader}>
          <Text style={uploadStyles.pageHeaderTitle}>Posted Designs</Text>
        </View>
        <View style={sDesignsStyles.center}>
          <ActivityIndicator size="large" color="#ec4899" />
          <Text style={sDesignsStyles.loadingText}>
            Loading your posted designs...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={authStyles.safeArea}>
      <View style={uploadStyles.pageHeader}>
        <Text style={uploadStyles.pageHeaderTitle}>Posted Designs</Text>
      </View>

      <View style={sDesignsStyles.container}>
        {postedDesigns.length === 0 ? (
          <View style={sDesignsStyles.emptyState}>
            <Text style={sDesignsStyles.emptyTitle}>No designs posted yet</Text>
            <Text style={sDesignsStyles.emptyText}>
              Tap the + button to upload your first design!
            </Text>
          </View>
        ) : (
          <FlatList
            data={postedDesigns}
            keyExtractor={(item) => item.id}
            numColumns={2}
            renderItem={renderItem}
            contentContainerStyle={sDesignsStyles.list}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
