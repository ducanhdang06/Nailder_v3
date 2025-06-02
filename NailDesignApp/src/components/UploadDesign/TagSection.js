import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { authStyles } from '../../styles/authStyles';
import { uploadStyles } from '../../styles/uploadStyles';

export const TagsSection = ({ 
  tagInput, 
  setTagInput, 
  tags, 
  onAddTag, 
  onRemoveTag 
}) => (
  <View style={authStyles.inputContainer}>
    <Text style={authStyles.label}>Tags</Text>
    <Text style={uploadStyles.helperText}>
      Add tags to help others discover your design
    </Text>

    <View style={uploadStyles.tagInputContainer}>
      <TextInput
        maxLength={10}
        placeholder="Add tag (e.g. 'spring', 'glitter')"
        value={tagInput}
        onChangeText={setTagInput}
        placeholderTextColor="#9ca3af"
        style={[authStyles.input, uploadStyles.tagInput]}
        onSubmitEditing={onAddTag}
      />
      <TouchableOpacity onPress={onAddTag} style={uploadStyles.addTagButton}>
        <LinearGradient
          colors={["#fb7185", "#ec4899"]}
          style={uploadStyles.addTagGradient}
        >
          <Text style={uploadStyles.addTagText}>Add</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>

    {tags.length > 0 && (
      <View style={uploadStyles.tagsContainer}>
        {tags.map((tag, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => onRemoveTag(tag)}
            style={uploadStyles.tagChip}
          >
            <Text style={uploadStyles.tagText}>#{tag}</Text>
            <Text style={uploadStyles.removeTagText}> ✕</Text>
          </TouchableOpacity>
        ))}
      </View>
    )}
  </View>
);
