import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

type UserData = {
  uid?: string;
  role: string;
  name: string;
  email: string;
  governmentId?: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: UserData | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: UserData & { password: string }) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try Firebase first, fallback to localStorage
    let unsubscribe: (() => void) | null = null;

    const initializeAuth = async () => {
      try {
        // Check if Firebase is properly configured
        if (auth.app?.options?.projectId) {
          console.log('🔥 Firebase initialized with project:', auth.app.options.projectId);
          unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
            console.log('👤 Auth state changed:', firebaseUser ? 'signed in' : 'signed out', firebaseUser?.email);

            if (firebaseUser) {
              // User is signed in, get their profile from Firestore
              try {
                const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                if (userDoc.exists()) {
                  const userData = userDoc.data() as UserData;
                  console.log('📋 User profile loaded from Firestore:', userData);
                  setUser({ ...userData, uid: firebaseUser.uid });
                } else {
                  // Fallback: create basic user data from Firebase user
                  console.log('⚠️ No user profile in Firestore, creating basic profile');
                  const basicUserData = {
                    uid: firebaseUser.uid,
                    name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
                    email: firebaseUser.email || '',
                    role: 'patient', // Default role
                  };
                  setUser(basicUserData);
                }
              } catch (error) {
                console.error('❌ Error fetching user data from Firestore:', error);
                // Fallback to basic user data
                const basicUserData = {
                  uid: firebaseUser.uid,
                  name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
                  email: firebaseUser.email || '',
                  role: 'patient',
                };
                setUser(basicUserData);
              }
            } else {
              // Check localStorage as fallback
              const storedUser = localStorage.getItem('pillmatrix_user');
              if (storedUser) {
                console.log('💾 Using localStorage user data');
                setUser(JSON.parse(storedUser));
              } else {
                console.log('🚫 No user data found');
                setUser(null);
              }
            }
            setLoading(false);
          });
        } else {
          // Firebase not configured, use localStorage
          console.warn('⚠️ Firebase not configured, using localStorage fallback');
          const storedUser = localStorage.getItem('pillmatrix_user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('❌ Firebase initialization error:', error);
        // Fallback to localStorage
        const storedUser = localStorage.getItem('pillmatrix_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const register = async (userData: UserData & { password: string }) => {
    const { password, ...profileData } = userData;
    console.log('📝 Registration attempt:', { email: userData.email, role: userData.role });

    try {
      // Check if Firebase is properly configured
      if (auth.app?.options?.projectId && auth.app.options.projectId === 'pillmatrix') {
        console.log('✅ Using Firebase registration');
        // Create user with Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, userData.email, password);
        console.log('✅ Firebase user created:', userCredential.user.email);

        // Save user profile to Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          ...profileData,
          createdAt: new Date(),
        });
        console.log('✅ User profile saved to Firestore');

        // User state will be updated by the onAuthStateChanged listener
      } else {
        // Firebase not properly configured, use localStorage fallback
        console.log('⚠️ Using localStorage registration fallback');
        console.warn('Firebase not configured, using localStorage for registration');
        localStorage.setItem('pillmatrix_user', JSON.stringify(profileData));
        setUser(profileData);
      }
    } catch (error: any) {
      console.error('❌ Registration error:', error);
      // Fallback to localStorage
      console.warn('Firebase registration failed, using localStorage fallback');
      localStorage.setItem('pillmatrix_user', JSON.stringify(profileData));
      setUser(profileData);
    }
  };

  const login = async (email: string, password: string) => {
    console.log('🔐 Login attempt:', { email, projectId: auth.app?.options?.projectId });

    try {
      // Check if Firebase is properly configured
      if (auth.app?.options?.projectId && auth.app.options.projectId === 'pillmatrix') {
        console.log('✅ Using Firebase authentication');
        await signInWithEmailAndPassword(auth, email, password);
        console.log('✅ Firebase authentication successful');
        // User state will be updated by the onAuthStateChanged listener
      } else {
        console.log('⚠️ Firebase not properly configured, using localStorage fallback');
        // Firebase not properly configured, use localStorage fallback
        console.warn('Firebase not configured, using localStorage for login');
        const storedUser = localStorage.getItem('pillmatrix_user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          if (userData.email === email) {
            setUser(userData);
          } else {
            throw new Error('Invalid credentials');
          }
        } else {
          throw new Error('No user found. Please register first.');
        }
      }
    } catch (error: any) {
      console.error('❌ Login error:', error);
      // Try localStorage fallback if Firebase failed
      try {
        const storedUser = localStorage.getItem('pillmatrix_user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          if (userData.email === email) {
            setUser(userData);
            return;
          }
        }
      } catch (fallbackError) {
        console.error('❌ localStorage fallback also failed:', fallbackError);
      }
      throw new Error(error.message || 'Login failed');
    }
  };

  const logout = async () => {
    try {
      // Try Firebase logout first
      if (auth.app?.options?.projectId && auth.app.options.projectId === 'pillmatrix') {
        await signOut(auth);
      }
    } catch (error: any) {
      console.error('Firebase logout error:', error);
    }

    // Always clean up localStorage
    localStorage.removeItem('pillmatrix_user');
    setUser(null);
  };

  const value: AuthContextType = {
    isAuthenticated: !!user,
    user,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
