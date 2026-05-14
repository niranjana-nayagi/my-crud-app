<template>
  <div class="page">
    <div class="header">
      <h1>Manage Users</h1>
      <router-link to="/">← Back</router-link>
    </div>
    <p v-if="loading">Loading users...</p>
    <div class="users-table" v-else>
      <table>
        <thead>
          <tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user._id">
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td><span class="badge" :class="user.role">{{ user.role }}</span></td>
            <td>{{ new Date(user.createdAt).toLocaleDateString() }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../api/axios';
const users = ref([]);
const loading = ref(false);
onMounted(async () => {
  loading.value = true;
  try {
    const res = await api.get('/users');
    users.value = res.data.users;
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.page { max-width: 800px; margin: 2rem auto; padding: 0 1rem; }
.header { display: flex; justify-content: space-between; align-items: center; }
table { width: 100%; border-collapse: collapse; }
th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; font-size: 14px; }
th { font-weight: 600; background: #f9fafb; }
.badge { padding: 3px 10px; border-radius: 12px; font-size: 12px; font-weight: 500; text-transform: capitalize; }
.badge.admin { background: #fef3c7; color: #92400e; }
.badge.manager { background: #dbeafe; color: #1e40af; }
.badge.viewer { background: #f3f4f6; color: #374151; }
</style>