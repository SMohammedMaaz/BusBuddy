import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
  User as FirebaseUser, 
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import type { User } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userData: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string, role: string) => Promise<void>;
  signInWithPhone: (phoneNumber: string, appVerifier: RecaptchaVerifier) => Promise<ConfirmationResult>;
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
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const response = await fetch(`/api/users/${user.uid}`);
          if (response.ok) {
            const data = await response.json();
            setUserData(data);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const createUserDocument = async (user: FirebaseUser, additionalData?: { name?: string; role?: string }) => {
    try {
      const response = await fetch(`/api/users/${user.uid}`);
      
      if (!response.ok) {
        const { email } = user;
        const newUserData = {
          firebaseUid: user.uid,
          email: email || "",
          name: additionalData?.name || user.displayName || "User",
          phone: user.phoneNumber || null,
          role: additionalData?.role || "passenger",
          ecoPoints: 0,
          favoriteStops: [],
        };

        const createResponse = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUserData),
        });
        
        const createdUser = await createResponse.json();
        setUserData(createdUser as User);
      } else {
        const existingUser = await response.json();
        setUserData(existingUser);
      }
    } catch (error) {
      console.error("Error creating user in database:", error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await createUserDocument(result.user);
    } catch (error: any) {
      console.error("Error signing in with Google:", error);
      if (error.code === "auth/unauthorized-domain") {
        throw new Error("Authentication domain not authorized. Please contact the administrator to add this domain to Firebase authorized domains.");
      } else if (error.code === "auth/popup-blocked") {
        throw new Error("Popup was blocked by your browser. Please allow popups for this site.");
      } else if (error.code === "auth/popup-closed-by-user") {
        throw new Error("Sign-in was cancelled. Please try again.");
      }
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error("Error signing in with email:", error);
      if (error.code === "auth/wrong-password" || error.code === "auth/user-not-found") {
        throw new Error("Invalid email or password. Please try again.");
      } else if (error.code === "auth/too-many-requests") {
        throw new Error("Too many failed login attempts. Please try again later.");
      }
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string, name: string, role: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await createUserDocument(result.user, { name, role });
    } catch (error: any) {
      console.error("Error signing up with email:", error);
      if (error.code === "auth/email-already-in-use") {
        throw new Error("This email is already registered. Please sign in instead.");
      } else if (error.code === "auth/weak-password") {
        throw new Error("Password is too weak. Please use a stronger password.");
      } else if (error.code === "auth/invalid-email") {
        throw new Error("Invalid email address. Please check and try again.");
      }
      throw error;
    }
  };

  const signInWithPhone = async (phoneNumber: string, appVerifier: RecaptchaVerifier) => {
    try {
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      return confirmationResult;
    } catch (error) {
      console.error("Error signing in with phone:", error);
      throw error;
    }
  };

  const sendPasswordResetEmail = async (email: string) => {
    try {
      await firebaseSendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Error sending password reset email:", error);
      throw error;
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const value = {
    currentUser,
    userData,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signInWithPhone,
    sendPasswordResetEmail,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
