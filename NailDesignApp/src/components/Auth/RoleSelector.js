// Purpose: Reusable role selection component

// Responsibilities:
// Renders role toggle buttons (Customer/Technician)
// Handles role selection logic
// Applies appropriate styling based on selection

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { authStyles } from '../../styles/authStyles';

export const RoleSelector = ({ selectedRole, onRoleChange }) => {
  const roles = ['Customer', 'Technician'];

  return (
    <View style={authStyles.inputContainer}>
      <Text style={authStyles.label}>I am a</Text>
      <View style={authStyles.roleToggleContainer}>
        {roles.map((role) => (
          <TouchableOpacity
            key={role}
            style={[
              authStyles.roleToggleButton,
              selectedRole === role && authStyles.roleToggleButtonActive,
            ]}
            onPress={() => onRoleChange(role)}
          >
            <Text
              style={[
                authStyles.roleToggleText,
                selectedRole === role && authStyles.roleToggleTextActive,
              ]}
            >
              {role}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};