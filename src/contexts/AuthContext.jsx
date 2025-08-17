import React, { createContext, useContext } from "react";
import { useSelector } from "react-redux";
import Error from "@/components/ui/Error";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
const { user, isAuthenticated, loading } = useSelector((state) => state.user);

  const login = () => {
    // Login logic will be handled by Redux actions
  };

  const logout = () => {
    // Logout logic will be handled by Redux actions
  };

  const value = {
    user,
    isAuthenticated: isAuthenticated || !!user,
    loading: loading || false,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};