const STORAGE_KEYS = {
  TOKEN: 'mentorsphere_token',
  USER: 'mentorsphere_user',
  ROLE: 'mentorsphere_role',
};

export const storage = {
  getToken: () => localStorage.getItem(STORAGE_KEYS.TOKEN),
  setToken: (token) => localStorage.setItem(STORAGE_KEYS.TOKEN, token),
  removeToken: () => localStorage.removeItem(STORAGE_KEYS.TOKEN),

  getUser: () => {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  },
  setUser: (user) => localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user)),
  removeUser: () => localStorage.removeItem(STORAGE_KEYS.USER),

  getRole: () => localStorage.getItem(STORAGE_KEYS.ROLE),
  setRole: (role) => localStorage.setItem(STORAGE_KEYS.ROLE, role),
  removeRole: () => localStorage.removeItem(STORAGE_KEYS.ROLE),

  clearAll: () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.ROLE);
  },
};

export default storage;
