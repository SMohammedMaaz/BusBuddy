import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { User } from "@shared/schema";

interface AuthContextType {
  currentUser: { uid: string; email: string | null } | null;
  userData: User | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string, role: string) => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<{ uid: string; email: string | null } | null>({ uid: "guest", email: "guest@busbuddy.com" });
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const mockUser: User = {
      id: "guest",
      firebaseUid: "guest",
      email: "guest@busbuddy.com",
      name: "Guest User",
      phone: null,
      role: "passenger",
      ecoPoints: 0,
      favoriteStops: [],
      createdAt: new Date(),
    };
    setUserData(mockUser);
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    return Promise.resolve();
  };

  const signUpWithEmail = async (email: string, password: string, name: string, role: string) => {
    return Promise.resolve();
  };

  const sendPasswordResetEmail = async (email: string) => {
    return Promise.resolve();
  };

  const signOut = async () => {
    return Promise.resolve();
  };

  const value = {
    currentUser,
    userData,
    loading,
    signInWithEmail,
    signUpWithEmail,
    sendPasswordResetEmail,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
