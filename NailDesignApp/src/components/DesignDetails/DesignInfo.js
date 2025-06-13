// screens/DesignDetail/components/DesignInfo.js
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { detailsStyles } from "../../styles/detailsStyles";
import { getDesignerInitials } from "../../utils/swipeHelpers";
import {
  parseTags,
  formatCreationDate,
  getDesignerDisplayName,
  getDesignTitle,
} from "../../utils/designHelpers";

const DesignInfo = ({ design, navigation }) => {
  const tags = parseTags(design.tags);
  const formattedDate = formatCreationDate(design.created_at);
  const designerName = getDesignerDisplayName(design.designerName);
  const title = getDesignTitle(design.title);

  const handleDesignerPress = () => {
    const technicianId = design.tech_id;
    navigation.navigate("TechnicianInfo", {
      technicianId: technicianId,
    });
  };

  return (
    <View style={detailsStyles.infoSection}>
      {/* Title and Likes */}
      <View style={detailsStyles.titleRow}>
        <Text style={detailsStyles.title}>{title}</Text>
        <View style={detailsStyles.likesContainer}>
          <Text style={detailsStyles.heartIcon}>❤️</Text>
          <Text style={detailsStyles.likesCount}>{design.likes || 0}</Text>
        </View>
      </View>

      {/* Designer Info */}
      <View style={detailsStyles.designerSection}>
        <TouchableOpacity
          style={detailsStyles.designerRow}
          onPress={handleDesignerPress}
          activeOpacity={0.7}
        >
          <View style={detailsStyles.designerAvatar}>
            <Text style={detailsStyles.avatarText}>
              {getDesignerInitials(designerName)}
            </Text>
          </View>
          <View style={detailsStyles.designerInfo}>
            <Text
              style={[
                detailsStyles.designerName,
                detailsStyles.clickableDesignerName,
              ]}
            >
              {designerName}
            </Text>
            {design.designerEmail && (
              <Text style={detailsStyles.designerEmail}>
                {design.designerEmail}
              </Text>
            )}
          </View>
          <View style={detailsStyles.chevronContainer}>
            <Text style={detailsStyles.chevron}>›</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Description */}
      {design.description && (
        <View style={detailsStyles.descriptionSection}>
          <Text style={detailsStyles.sectionTitle}>Description</Text>
          <Text style={detailsStyles.description}>{design.description}</Text>
        </View>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <View style={detailsStyles.tagsSection}>
          <Text style={detailsStyles.sectionTitle}>Tags</Text>
          <View style={detailsStyles.tagsContainer}>
            {tags.map((tag, index) => (
              <View key={index} style={detailsStyles.tag}>
                <Text style={detailsStyles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Creation Date */}
      {formattedDate && (
        <View style={detailsStyles.dateSection}>
          <Text style={detailsStyles.sectionTitle}>Created</Text>
          <Text style={detailsStyles.dateText}>{formattedDate}</Text>
        </View>
      )}

      {/* Bottom spacing for buttons */}
      <View style={detailsStyles.bottomSpacing} />
    </View>
  );
};

export default DesignInfo;
