import React, { createContext, useContext, useState, useEffect } from 'react';
import { profileServices } from '../services/profileServices';
import { useUser } from './userContext'; // adjust path if needed

const TechnicianProfileContext = createContext();

export const TechnicianProfileProvider = ({ children }) => {
  const { user } = useUser();

  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchProfile = async () => {
    if (!user || user.role.toLowerCase() !== 'technician') return;

    try {
      setIsLoading(true);
      const data = await profileServices.fetchMyProfile();
      setProfile(data);
      setHasFetched(true);
    } catch (error) {
      console.error('❌ Failed to fetch technician profile:', error);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-fetch on mount if role is technician
  useEffect(() => {
    if (!hasFetched && user?.role.toLowerCase() === 'technician') {
      fetchProfile();
    }
  }, [user]);

  return (
    <TechnicianProfileContext.Provider
      value={{
        profile,
        setProfile,
        isLoading,
        hasFetched,
        fetchProfile,
      }}
    >
      {children}
    </TechnicianProfileContext.Provider>
  );
};

export const useTechnicianProfile = () => useContext(TechnicianProfileContext);
