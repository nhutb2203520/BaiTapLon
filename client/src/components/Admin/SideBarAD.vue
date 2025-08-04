<template>
  <div style="margin-top: 24px;"
       :class="['sidebar bg-white border-end shadow-sm position-fixed start-0 overflow-auto',
                { 'sidebar-collapsed': !isOpen }]">
    <!-- Header -->
    <div class="bg-primary text-white p-3 d-flex align-items-center justify-content-between cursor-pointer"
         @click="toggleSidebar">
      <div v-if="isOpen" class="d-flex align-items-center">
        <i class="bi bi-list-ul me-2 fs-5"></i>
        <h6 class="mb-0 fw-bold">QUẢN LÝ THƯ VIỆN</h6>
      </div>
      <div v-else class="w-100 text-center">
        <i class="bi bi-list-ul fs-4"></i>
      </div>
      <i class="bi text-white fs-4" :class="isOpen ? 'bi-chevron-left' : 'bi-chevron-right'"></i>
    </div>

    <!-- Sidebar menu -->
    <div class="p-3">
      <div
        v-for="item in menuItems"
        :key="item.label"
        @click="navigate(item.route)"
        :title="!isOpen ? item.label : ''"
        :class="[
          'sidebar-item',
          'cursor-pointer',
          'mb-3',
          isActive(item.route) ? 'active-item' : ''
        ]"
      >
        <div class="d-flex align-items-center justify-content-center" v-if="!isOpen">
          <i :class="[item.icon, 'text-primary', 'fs-4']"></i>
        </div>
        <div class="d-flex align-items-center" v-else>
          <i :class="[item.icon, 'me-2', 'text-primary']"></i>
          <span>{{ item.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const isOpen = ref(true);
const router = useRouter();
const route = useRoute();
const emit = defineEmits(['toggle']);

const toggleSidebar = () => {
  isOpen.value = !isOpen.value;
  emit('toggle', isOpen.value);
};

const navigate = (path) => {
  router.push(path);
};

const isActive = (path) => {
  return route.path === path;
};

const menuItems = [
  { label: 'Quản lý nhà xuất bản', icon: 'bi bi-building', route: '/admin/quan-ly-nxb' },
  { label: 'Quản lý sách', icon: 'bi bi-book', route: '/admin/quan-ly-sach' },
  { label: 'Quản lý mượn trả', icon: 'bi bi-arrow-left-right', route: '/admin/quan-ly-muon-sach' },
  { label: 'Quản lý độc giả', icon: 'bi bi-people', route: '/admin/quan-ly-doc-gia' }
];
</script>

<style scoped>
.sidebar {
  width: 260px;
  top: 50px;
  height: calc(100vh - 56px);
  transition: width 0.3s ease;
  z-index: 1060;
}

.sidebar-collapsed {
  width: 80px;
}

.cursor-pointer {
  cursor: pointer;
}

.sidebar-item {
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  text-align: center;
  transition: all 0.2s ease;
}

.sidebar-item:hover {
  background-color: var(--bs-light);
  transform: scale(1.05);
}

.active-item {
  transform: scale(1.1);
  background-color: #e8f0ff;
  font-weight: 600;
  border: 2px solid var(--bs-primary);
}

.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-thumb {
  background-color: var(--bs-primary);
  border-radius: 3px;
}
</style>
