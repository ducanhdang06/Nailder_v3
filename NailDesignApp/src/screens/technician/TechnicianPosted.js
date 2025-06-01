import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { usePostedStore } from "../../store/postedStore";
import { authStyles } from "../../styles/authStyles";
import { uploadStyles } from "../../styles/uploadStyles";
import { sDesignsStyles } from "../../styles/sDesignsStyles";
import { formatTimeAgo } from "../../utils/formatTimeAgo";

export default function TechnicianPosted(props) {
  const flatListRef = useRef(null);
  const [refreshing, setRefreshing] = useState(false);
  const { postedDesigns, loading, hasFetched, fetchPostedDesigns } =
    usePostedStore();

  // Scroll to top if signal is triggered
  useEffect(() => {
    if (props.scrollToTopSignal) {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  }, [props.scrollToTopSignal]);

  // Fetch once on initial load
  useEffect(() => {
    if (!hasFetched) fetchPostedDesigns();
  }, [hasFetched]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPostedDesigns();
    setRefreshing(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={sDesignsStyles.card}>
      <Image source={{ uri: item.image_url }} style={sDesignsStyles.image} />
      <View style={sDesignsStyles.cardContent}>
        <Text style={sDesignsStyles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={sDesignsStyles.designer}>
          {formatTimeAgo(item.created_at)}
        </Text>
        <Text style={sDesignsStyles.likes}>❤️ {item.likes}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading && !hasFetched) {
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
            ref={flatListRef}
            data={postedDesigns}
            keyExtractor={(item) => item.id}
            numColumns={2}
            renderItem={renderItem}
            contentContainerStyle={sDesignsStyles.list}
            showsVerticalScrollIndicator={false}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
