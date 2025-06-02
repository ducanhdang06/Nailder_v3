// Purpose: Handles automatic login when app starts

// Responsibilities:
// Checks for existing user sessions
// Automatically logs in returning users
// Updates user context and navigates appropriately

import { useEffect, useRef } from 'react';
import { authService } from '../../services/authServices';
import { userApiService } from '../../services/userServices';
import { navigationService } from '../../services/navigationServices';

export const useAutoLogin = (navigation, reloadUser) => {
  const hasRunRef = useRef(false);
  
  useEffect(() => {
    // Prevent multiple runs
    if (hasRunRef.current) return;
    
    const checkExistingSession = async () => {
      try {
        hasRunRef.current = true;
        
        const sessionResult = await authService.getCurrentSession();
        
        if (sessionResult.success) {
          const { attributes, token, role } = sessionResult.data;
          
          console.log("🔍 Checking existing session for:", attributes.email);
          
          // Create/update user in backend
          await userApiService.createOrUpdateUser({
            fullName: attributes.name,
            email: attributes.email,
            role: role,
            token: token,
          });

          await reloadUser();
          console.log("🟢 Auto-login as:", role);
          
          navigationService.navigateByRole(navigation, role);
        } else {
          console.log("❌ No existing session found");
        }
      } catch (error) {
        console.error("❌ Auto-login error:", error);
        hasRunRef.current = false; // Reset on error to allow retry
      }
    };

    checkExistingSession();
  }, []); // Remove dependencies to prevent loop
};