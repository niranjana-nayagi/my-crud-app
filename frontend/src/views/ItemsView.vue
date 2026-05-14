<template>
  <div class="page">
    <div class="header">
      <h1>Items</h1>
      <router-link to="/">← Back</router-link>
    </div>
    <div v-if="authStore.canWrite" class="create-form">
      <h2>Add New Item</h2>
      <input v-model="form.title" placeholder="Title" maxlength="100" />
      <textarea v-model="form.description" placeholder="Description" maxlength="500"></textarea>
      <button @click="createItem">Add Item</button>
    </div>
    <p v-if="error" class="error-msg">{{ error }}</p>
    <p v-if="loading">Loading items...</p>
    <div class="items-list">
      <div v-for="item in items" :key="item._id" class="item-card">
        <div v-if="editingId !== item._id">
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
          <small>By {{ item.createdBy?.name }}</small>
          <div class="actions" v-if="authStore.canWrite">
            <button @click="startEdit(item)" class="btn-edit">Edit</button>
            <button @click="deleteItem(item._id)" class="btn-delete" v-if="authStore.isAdmin">Delete</button>
          </div>
        </div>
        <div v-else>
          <input v-model="editForm.title" maxlength="100" />
          <textarea v-model="editForm.description" maxlength="500"></textarea>
          <button @click="saveEdit(item._id)">Save</button>
          <button @click="editingId = null">Cancel</button>
        </div>
      </div>
    </div>
    <p v-if="!loading && items.length === 0">No items yet.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../api/axios';
import { useAuthStore } from '../stores/authStore';

const authStore = useAuthStore();
const items = ref([]);
const loading = ref(false);
const error = ref('');
const form = ref({ title: '', description: '' });
const editingId = ref(null);
const editForm = ref({ title: '', description: '' });

async function fetchItems() {
  loading.value = true;
  try {
    const res = await api.get('/items');
    items.value = res.data.items;
  } catch (err) {
    error.value = 'Could not load items.';
  } finally {
    loading.value = false;
  }
}

async function createItem() {
  error.value = '';
  if (!form.value.title.trim()) { error.value = 'Title is required.'; return; }
  try {
    await api.post('/items', form.value);
    form.value = { title: '', description: '' };
    fetchItems();
  } catch (err) {
    error.value = err.response?.data?.message || 'Could not create item.';
  }
}

function startEdit(item) {
  editingId.value = item._id;
  editForm.value = { title: item.title, description: item.description };
}

async function saveEdit(id) {
  try {
    await api.put('/items/' + id, editForm.value);
    editingId.value = null;
    fetchItems();
  } catch (err) {
    error.value = err.response?.data?.message || 'Could not update item.';
  }
}

async function deleteItem(id) {
  if (!confirm('Are you sure?')) return;
  try {
    await api.delete('/items/' + id);
    fetchItems();
  } catch (err) {
    error.value = err.response?.data?.message || 'Could not delete item.';
  }
}

onMounted(fetchItems);
</script>

<style scoped>
.page { max-width: 800px; margin: 2rem auto; padding: 0 1rem; }
.header { display: flex; justify-content: space-between; align-items: center; }
.create-form { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem; }
.create-form h2 { margin: 0 0 1rem; font-size: 1.1rem; }
input, textarea { display: block; width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; margin-bottom: 10px; font-size: 14px; box-sizing: border-box; }
textarea { min-height: 80px; resize: vertical; }
.item-card { background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 1rem 1.25rem; margin-bottom: 1rem; }
.item-card h3 { margin: 0 0 6px; }
.item-card p { margin: 0 0 4px; color: #444; }
.item-card small { color: #9ca3af; font-size: 12px; }
.actions { margin-top: 10px; display: flex; gap: 8px; }
button { padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; }
.btn-edit { background: #dbeafe; color: #1d4ed8; }
.btn-delete { background: #fee2e2; color: #b91c1c; }
.error-msg { color: #dc2626; background: #fee2e2; padding: 10px; border-radius: 6px; font-size: 14px; }
</style>
