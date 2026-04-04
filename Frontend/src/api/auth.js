const TOKEN_KEY = "token";
const EXPIRY_KEY = "token_expiry";

export const setToken = (token, expiresIn = 3600000) => { // Default 1 hour
  const expiry = Date.now() + expiresIn;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(EXPIRY_KEY, expiry.toString());
};

export const getToken = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  const expiry = localStorage.getItem(EXPIRY_KEY);
  if (!token || !expiry) return null;
  if (Date.now() > parseInt(expiry)) {
    // Token expired, remove it
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EXPIRY_KEY);
    return null;
  }
  return token;
};

export const isAuthenticated = () => {
  return getToken() !== null;
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EXPIRY_KEY);
};