export const logout = () => {
  localStorage.removeItem('expires_at');
  localStorage.removeItem('access_token');
  localStorage.removeItem('order_code');
};
