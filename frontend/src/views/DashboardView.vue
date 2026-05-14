<template>
  <div class="page">
    <h1>Dashboard</h1>
    <p>Welcome back, <strong>{{ authStore.user?.name }}</strong>!</p>
    <p>Your role: <span class="badge" :class="authStore.user?.role">{{ authStore.user?.role }}</span></p>
    <div class="nav-links">
      <router-link to="/items">View Items</router-link>
      <router-link to="/users" v-if="authStore.isAdmin">Manage Users</router-link>
    </div>
    <button @click="authStore.logout().then(() => router.push('/login'))">Sign out</button>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';
const authStore = useAuthStore();
const router = useRouter();
</script>

<style scoped>
.page { max-width: 800px; margin: 2rem auto; padding: 0 1rem; }
.badge { padding: 3px 10px; border-radius: 12px; font-size: 13px; font-weight: 500; text-transform: capitalize; }
.badge.admin { background: #fef3c7; color: #92400e; }
.badge.manager { background: #dbeafe; color: #1e40af; }
.badge.viewer { background: #f3f4f6; color: #374151; }
.nav-links { display: flex; gap: 1rem; margin: 1.5rem 0; }
.nav-links a { color: #4f46e5; font-weight: 500; }
button { padding: 10px 20px; background: #ef4444; color: white; border: none; border-radius: 8px; cursor: pointer; }
</style>