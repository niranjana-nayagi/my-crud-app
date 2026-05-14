import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../api/axios';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const isLoggedIn = computed(() => !!user.value);
  const isAdmin = computed(() => user.value?.role === 'admin');
  const isManager = computed(() => user.value?.role === 'manager');
  const canWrite = computed(() => ['admin', 'manager'].includes(user.value?.role));

  async function login(email, password) {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.post('/auth/login', { email, password });
      user.value = res.data.user;
      return true;
    } catch (err) {
      error.value = err.response?.data?.message || 'Login failed.';
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
    await api.post('/auth/logout');
    user.value = null;
  }

  async function fetchCurrentUser() {
    try {
      const res = await api.get('/auth/me');
      user.value = res.data.user;
    } catch {
      user.value = null;
    }
  }

  return { user, loading, error, isLoggedIn, isAdmin, isManager, canWrite, login, logout, fetchCurrentUser };
});
