import { createAction, createSlice } from '@reduxjs/toolkit';
import React from 'react';
import { useSelector } from '../store/hooks';

import { jwtDecode, JwtPayload } from 'jwt-decode';

export interface AuthToken {
  username: string;
  isAdmin: boolean;
  exp: number;
  state: string;
}

interface AuthState {
  token: string;
  user: string;
  isAdmin: boolean;
  state: string;
}

export interface LoginAction {
  type: string;
  payload: {
    token: string;
  };
}

const initialState = {
  user: '',
  token: '',
  isAdmin: false
} as AuthState;

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: LoginAction) => {
      const decoded = decodeToken(action.payload.token);
      state.user = decoded.username;
      state.token = action.payload.token;
      state.isAdmin = decoded.isAdmin;
      state.state = decoded.state;
      localStorage.setItem('jwt', action.payload.token);
    }
  },
  extraReducers: (builder) => {
    builder.addCase(logout, () => {
      return initialState;
    });
  }
});

export default authSlice.reducer;

export const { loginSuccess } = authSlice.actions;

export const useAuth = () => {
  const [loggedIn, setLoggedIn] = React.useState<boolean>(false);
  const [checking, setChecking] = React.useState<boolean>(true);

  const auth = useSelector((state) => state.auth);

  React.useEffect(() => {
    if (isValidToken(decodeToken(auth.token).exp)) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
    setChecking(false);
  }, [auth]);

  return { loggedIn, checking };
};

export const logout = createAction('auth/logout');

export const isValidToken = (exp: number) => {
  if (Math.floor(Date.now() / 1000) < exp) {
    return true;
  }

  return false;
};

export const getAuthValues = (sToken = '') => {
  const token = {
    full: sToken,
    processed: decodeToken(sToken)
  };
  const local = getToken();
  if (local.full !== null && local.processed !== null) {
    token.full = local.full;
    token.processed = local.processed;
  }
  return {
    token: token.full,
    processed: token.processed
  };
};

export const decodeToken = (token: string): AuthToken => {
  try {
    return jwtDecode<AuthToken>(token);
  } catch {
    return { username: '', isAdmin: false, exp: 0, state: '' };
  }
};

export const getToken = () => {
  const token = localStorage.getItem('jwt') || '';
  return {
    full: token,
    processed: decodeToken(token)
  };
};

export const isLoggedIn = (token: JwtPayload) => {
  return isValidToken(token.exp || 0);
};
