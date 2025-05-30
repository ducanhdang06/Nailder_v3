import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { fetchAuthSession } from 'aws-amplify/auth';
import { API_BASE_URL } from '../../config';
import { authStyles } from '../../styles/authStyles';
import { uploadStyles } from '../../styles/uploadStyles';
import { sDesignsStyles } from '../../styles/sDesignsStyles';

export default function CustomerSaved() {
  const [savedDesigns, setSavedDesigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedDesigns = async () => {
      try {
        const token = (await fetchAuthSession()).tokens?.idToken?.toString();
        const res = await fetch(`${API_BASE_URL}/api/feed/saved`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setSavedDesigns(data);
      } catch (err) {
        console.error('❌ Failed to fetch saved designs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedDesigns();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={sDesignsStyles.card}
      // onPress={() => navigation.navigate('DesignDetail', { design: item })}
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

  if (loading) {
    return (
      <SafeAreaView style={authStyles.safeArea}>
        <View style={uploadStyles.pageHeader}>
          <Text style={uploadStyles.pageHeaderTitle}>Saved Designs</Text>
        </View>
        <View style={sDesignsStyles.center}>
          <ActivityIndicator size="large" color="#ec4899" />
          <Text style={sDesignsStyles.loadingText}>Loading your saved designs...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={authStyles.safeArea}>
      {/* Page Header */}
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
            data={savedDesigns}
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


  
