<template>
  <div class="login-container">
    <div class="login-card">
      <h1>Sign in</h1>
      <p v-if="authStore.error" class="error-msg">{{ authStore.error }}</p>
      
      <div class="form-group">
        <label>Email</label>
        <input type="email" v-model="email" placeholder="you@example.com" />
      </div>
      
      <div class="form-group">
        <label>Password</label>
        <input type="password" v-model="password" placeholder="Your password" />
      </div>
      
      <button @click="handleLogin" :disabled="authStore.loading">
        {{ authStore.loading ? 'Signing in...' : 'Sign in' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const authStore = useAuthStore();
const router = useRouter();
const email = ref('');
const password = ref('');

async function handleLogin() {
  const success = await authStore.login(email.value, password.value);
  if (success) router.push('/');
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f5f5f5;
}
.login-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 100%;
  max-width: 380px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}
h1 { margin: 0 0 1.5rem; font-size: 1.5rem; }
.form-group { margin-bottom: 1rem; }
label { display: block; margin-bottom: 4px; font-size: 14px; color: #555; }
input { width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; box-sizing: border-box; }
button { width: 100%; padding: 12px; background: #4f46e5; color: white; border: none; border-radius: 8px; font-size: 15px; cursor: pointer; margin-top: 0.5rem; }
button:disabled { opacity: 0.6; cursor: not-allowed; }
.error-msg { color: #dc2626; background: #fee2e2; padding: 10px; border-radius: 6px; font-size: 14px; margin-bottom: 1rem; }
</style>