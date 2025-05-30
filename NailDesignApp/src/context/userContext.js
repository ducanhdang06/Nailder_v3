import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchUserAttributes } from 'aws-amplify/auth';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const reloadUser = async () => {
    try {
      const attrs = await fetchUserAttributes();
      const userInfo = {
        sub: attrs.sub,
        fullName: attrs.name,
        email: attrs.email,
        role: attrs['custom:userType'],
      };
      console.log(userInfo.fullName);
      setUser(userInfo);
    } catch (err) {
      console.error('❌ Failed to load user:', err);
      setUser(null);
    }
  };

  useEffect(() => {
    reloadUser(); // load user on app launch
  }, []);

  return (
    <UserContext.Provider value={{ user, reloadUser, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

