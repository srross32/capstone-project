import { createAction, createSlice } from '@reduxjs/toolkit';
import React from 'react';
import { useSelector } from '../store/hooks';

import { jwtDecode, JwtPayload } from 'jwt-decode';

export interface AuthToken {
    user: string;
    session: string;
    exp: number;
}

interface AuthState {
  token: string;
  exp: number;
  lastUpdated: number;
  user: string;
}

export interface LoginAction {
  type: string;
  payload: {
    user: string;
    token: string;
    exp: number;
  };
}

const initialState = {
  user: '',
  token: '',
  exp: 0,
  lastUpdated: 0
} as AuthState;

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: LoginAction) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.exp = action.payload.exp;
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
    if (isValidToken(auth.exp)) {
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
    return { user: '', exp: 0, session: '' };
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
