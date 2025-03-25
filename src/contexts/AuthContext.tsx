'use client';
import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { useRouter } from 'next/navigation';
import {
  AuthState,
  AuthAction,
  initialState,
  authReducer,
  getStoredAuth,
  setStoredAuth,
  clearStoredAuth,
  login as loginApi,
  logout as logoutApi,
  getCurrentUser,
} from '@/utils/auth';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: AuthState['user']) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const router = useRouter();

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedAuth = getStoredAuth();
    if (storedAuth.token && storedAuth.user) {
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          token: storedAuth.token,
          user: storedAuth.user,
        },
      });
    }
  }, []);

  // Verify token on mount and route changes
  useEffect(() => {
    const verifyToken = async () => {
      if (state.token) {
        try {
          const user = await getCurrentUser(state.token);
          dispatch({ type: 'UPDATE_USER', payload: user });
        } catch (error) {
          // If token is invalid, clear auth state
          dispatch({ type: 'LOGOUT_SUCCESS' });
          clearStoredAuth();
          router.push('/login');
        }
      }
    };

    verifyToken();
  }, [state.token, router]);

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      const { user, token } = await loginApi(email, password);
      setStoredAuth(token, user);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token },
      });
      router.push('/dashboard');
    } catch (error) {
      dispatch({
        type: 'LOGIN_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to login',
      });
      throw error;
    }
  };

  const logout = async () => {
    if (!state.token) return;

    try {
      dispatch({ type: 'LOGOUT_START' });
      await logoutApi(state.token);
      clearStoredAuth();
      dispatch({ type: 'LOGOUT_SUCCESS' });
      router.push('/login');
    } catch (error) {
      dispatch({
        type: 'LOGOUT_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to logout',
      });
      throw error;
    }
  };

  const updateUser = (user: AuthState['user']) => {
    if (user) {
      dispatch({ type: 'UPDATE_USER', payload: user });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        updateUser,
      }}
    >
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