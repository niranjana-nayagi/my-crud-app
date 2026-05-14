import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import LoginView from '../views/LoginView.vue';
import DashboardView from '../views/DashboardView.vue';
import ItemsView from '../views/ItemsView.vue';
import UsersView from '../views/UsersView.vue';

const routes = [
  { path: '/login', component: LoginView, meta: { guestOnly: true } },
  { path: '/', component: DashboardView, meta: { requiresAuth: true } },
  { path: '/items', component: ItemsView, meta: { requiresAuth: true } },
  { path: '/users', component: UsersView, meta: { requiresAuth: true, adminOnly: true } },
  { path: '/:pathMatch(.*)*', redirect: '/' }  // redirect unknown paths to home
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation guard — runs before every page change
router.beforeEach(async (to) => {
  const authStore = useAuthStore();

  // Try to restore the session (in case user refreshed the page)
  if (authStore.user === null) {
    await authStore.fetchCurrentUser();
  }

  // If the page requires login and user is not logged in → redirect to login
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return '/login';
  }

  // If the page is admin-only and user is not admin → redirect to home
  if (to.meta.adminOnly && !authStore.isAdmin) {
    return '/';
  }

  // If the page is guest-only (like login) and user IS logged in → redirect to home
  if (to.meta.guestOnly && authStore.isLoggedIn) {
    return '/';
  }
});

export default router;