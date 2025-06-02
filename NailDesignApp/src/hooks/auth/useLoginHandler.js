import { Alert } from 'react-native';
import { authService } from '../../services/authServices';
import { userApiService } from '../../services/userServices';
import { navigationService } from '../../services/navigationServices';

export const useLoginHandler = (navigation, reloadUser) => {
  const handleLogin = async (email, password) => {
    const signInResult = await authService.signInUser({ email, password });
    
    if (!signInResult.success) {
      Alert.alert("Login failed", signInResult.error);
      return;
    }

    const { attributes, token, role } = signInResult.data;

    // Create/update user in backend
    if (token) {
      await userApiService.createOrUpdateUser({
        fullName: attributes.name,
        email: attributes.email,
        role: role,
        token: token,
      });
    }

    await reloadUser();
    Alert.alert("Login successful!", `Role: ${role}`);
    navigationService.navigateByRole(navigation, role);
  };

  const handleSignOut = async () => {
    const result = await authService.signOutUser();
    if (result.success) {
      navigation.replace("Login");
    } else {
      Alert.alert("Error", result.error);
    }
  };

  return { handleLogin, handleSignOut };
};