import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { authStyles } from '../styles/authStyles';
import { uploadStyles } from '../styles/uploadStyles';

export const TitleInput = ({ title, setTitle }) => (
  <View style={authStyles.inputContainer}>
    <Text style={authStyles.label}>Design Title *</Text>
    <TextInput
      maxLength={50}
      placeholder="Enter a catchy title for your design"
      value={title}
      onChangeText={setTitle}
      placeholderTextColor="#9ca3af"
      style={authStyles.input}
    />
    <Text style={uploadStyles.characterCount}>{title.length}/50</Text>
  </View>
);

export const DescriptionInput = ({ description, setDescription }) => (
  <View style={authStyles.inputContainer}>
    <Text style={authStyles.label}>Description</Text>
    <TextInput
      maxLength={300}
      placeholder="Describe your design, techniques used, inspiration..."
      value={description}
      onChangeText={setDescription}
      multiline
      numberOfLines={4}
      placeholderTextColor="#9ca3af"
      style={[authStyles.input, uploadStyles.textArea]}
    />
    <Text style={uploadStyles.characterCount}>
      {description.length}/300
    </Text>
  </View>
);