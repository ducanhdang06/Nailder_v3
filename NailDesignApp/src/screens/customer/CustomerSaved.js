import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useSavedStore } from "../../store/savedStore";
import { authStyles } from "../../styles/authStyles";
import { uploadStyles } from "../../styles/uploadStyles";
import { sDesignsStyles } from "../../styles/sDesignsStyles";

export default function CustomerSaved({ navigation, ...props }) {
  const flatListRef = useRef(null);
  const { savedDesigns, hasFetched, loading, fetchSavedDesigns } =
    useSavedStore();
  const [refreshing, setRefreshing] = useState(false);

  // ✅ Scroll to top when signal changes
  useEffect(() => {
    if (props.scrollToTopSignal) {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  }, [props.scrollToTopSignal]);

  // ✅ Only fetch data if not already fetched
  useEffect(() => {
    if (!hasFetched) fetchSavedDesigns();
  }, [hasFetched]);

  // Manual pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSavedDesigns(); // re-fetch and update state
    setRefreshing(false);
  };

  // Navigate to design detail screen
  const handleDesignPress = (design) => {
    navigation.navigate('DesignDetail', { design });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={sDesignsStyles.card}
      onPress={() => handleDesignPress(item)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.imageUrl }} style={sDesignsStyles.image} />
      <View style={sDesignsStyles.cardContent}>
        <Text style={sDesignsStyles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={sDesignsStyles.designer}>By {item.designerName}</Text>
        <Text style={sDesignsStyles.likes}>❤️ {item.likes}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading && !hasFetched) {
    return (
      <SafeAreaView style={authStyles.safeArea}>
        <View style={uploadStyles.pageHeader}>
          <Text style={uploadStyles.pageHeaderTitle}>Saved Designs</Text>
        </View>
        <View style={sDesignsStyles.center}>
          <ActivityIndicator size="large" color="#ec4899" />
          <Text style={sDesignsStyles.loadingText}>
            Loading your saved designs...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={authStyles.safeArea}>
      <View style={uploadStyles.pageHeader}>
        <Text style={uploadStyles.pageHeaderTitle}>Saved Designs</Text>
      </View>

      <View style={sDesignsStyles.container}>
        {savedDesigns.length === 0 ? (
          <View style={sDesignsStyles.emptyState}>
            <Text style={sDesignsStyles.emptyTitle}>No saved designs yet</Text>
            <Text style={sDesignsStyles.emptyText}>
              Start swiping and save designs you love to see them here!
            </Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={savedDesigns}
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
