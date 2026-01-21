<template>
  <component :is="currentView" />
</template>

<script setup>
import { computed, ref } from "vue";
import CustomerView from "./components/CustomerView.vue";
import AdminView from "./components/AdminView.vue";
import KitchenView from "./components/KitchenView.vue";

// Simple URL-based routing
const path = ref(window.location.pathname);

const currentView = computed(() => {
  if (path.value === "/admin") return AdminView;
  if (path.value === "/kitchen") return KitchenView;
  return CustomerView; // Default to Customer
});
</script>
