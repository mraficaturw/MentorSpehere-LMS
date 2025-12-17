import { create } from 'zustand';
import { storage } from '../utils/storage';

const useAuthStore = create((set, get) => ({
  user: storage.getUser(),
  token: storage.getToken(),
  role: storage.getRole(),
  isAuthenticated: !!storage.getToken(),
  isLoading: false,
  error: null,

  login: (user, token) => {
    storage.setUser(user);
    storage.setToken(token);
    storage.setRole(user.role);
    set({
      user,
      token,
      role: user.role,
      isAuthenticated: true,
      error: null,
    });
  },

  logout: () => {
    storage.clearAll();
    set({
      user: null,
      token: null,
      role: null,
      isAuthenticated: false,
      error: null,
    });
  },

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  updateUser: (userData) => {
    const updatedUser = { ...get().user, ...userData };
    storage.setUser(updatedUser);
    set({ user: updatedUser });
  },

  isStudent: () => get().role === 'student',
  isMentor: () => get().role === 'mentor',
}));

export default useAuthStore;
