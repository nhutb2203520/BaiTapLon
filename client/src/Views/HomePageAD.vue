<template>
  <div class="home-page">
    <!-- Header Component -->
    <NavBarAD
      :active-tab="currentTab" 
      @tab-changed="handleTabChange"
    />

    <!-- Content Area -->
    <div class="content">
      <!-- Page Header -->
      <div class="page-header">
        <h1 class="page-title">{{ pageData[currentTab].title }}</h1>
        <p class="page-subtitle">{{ pageData[currentTab].subtitle }}</p>
      </div>

      <!-- Stats Grid (only show on home page) -->
      <div v-if="currentTab === 'home'" class="stats-grid">
        <div 
          v-for="stat in stats" 
          :key="stat.label"
          class="stat-card"
          @mouseenter="handleCardHover($event, true)"
          @mouseleave="handleCardHover($event, false)"
        >
          <h3>{{ stat.value.toLocaleString() }}</h3>
          <p>{{ stat.label }}</p>
        </div>
      </div>

      <!-- Recent Activity (only show on home page) -->
      <div v-if="currentTab === 'home'" class="recent-activity">
        <h2>Hoạt động gần đây</h2>
        
        <div 
          v-for="activity in recentActivities" 
          :key="activity.id"
          class="activity-item"
        >
          <div class="activity-icon">
            <i :class="activity.icon"></i>
          </div>
          <div class="activity-text">
            <h4>{{ activity.title }}</h4>
            <p>{{ activity.description }}</p>
          </div>
        </div>
      </div>

      <!-- Placeholder content for other pages -->
      <div v-else class="placeholder-content">
        <div class="placeholder-card">
          <i :class="getPageIcon(currentTab)"></i>
          <h3>{{ pageData[currentTab].title }}</h3>
          <p>Nội dung trang {{ pageData[currentTab].title.toLowerCase() }} sẽ được phát triển tại đây.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import NavBarAD from '../components/Admin/NavBarAD.vue'

export default {
  name: 'HomePage',
  components: {
    NavBarAD
  },
  setup() {
    const currentTab = ref('home')
    
    const pageData = reactive({
      home: {
        title: "Quản Lý Thư Viện Thủ Thư",
        subtitle: "Chào mừng bạn đến với hệ thống quản lý thư viện"
      },
      books: {
        title: "Danh mục sách",
        subtitle: "Khám phá kho sách phong phú của thư viện"
      },
      approval: {
        approval: "Sách chờ duyệt",
        subtitle: "Quản lý sách đang chờ duyệt của độc giả"
      },
      publisher: {
        publisher: "Nhà xuất bản",
        subtitle: "Quản lý nhà xuất bản"
      },
      history: {
        title: "Lịch sử mượn sách",
        subtitle: "Theo dõi các giao dịch mượn trả sách của bạn"
      },
      account: {
        title: "Tài khoản",
        subtitle: "Quản lý thông tin cá nhân và cài đặt tài khoản"
      }
    })

    const stats = reactive([
      { label: 'Tổng số sách', value: 1234 },
      {label: 'Tổng nhà xuất bản', value: 68},
      {label: 'Sách chờ duyệt mượn,', value: 111},
      { label: 'Sách đang mượn', value: 89 },
      { label: 'Thành viên', value: 567 },
      { label: 'Sách quá hạn', value: 23 }
    ])

    const recentActivities = reactive([
      {
        id: 1,
        icon: 'fas fa-book',
        title: 'Sách "Lập trình Python" được mượn',
        description: 'Nguyễn Văn A - 2 giờ trước'
      },
      {
        id: 2,
        icon: 'fas fa-undo',
        title: 'Sách "JavaScript căn bản" được trả',
        description: 'Trần Thị B - 3 giờ trước'
      },
      {
        id: 3,
        icon: 'fas fa-user-plus',
        title: 'Thành viên mới đăng ký',
        description: 'Lê Văn C - 5 giờ trước'
      },
      {
        id: 4,
        icon: 'fas fa-clock',
        title: 'Gia hạn sách "React Native"',
        description: 'Phạm Thị D - 1 ngày trước'
      }
    ])

    const handleTabChange = (tab) => {
      currentTab.value = tab
    }

    const handleCardHover = (event, isHover) => {
      const card = event.target.closest('.stat-card')
      if (isHover) {
        card.style.transform = 'translateY(-2px)'
        card.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.12)'
      } else {
        card.style.transform = 'translateY(0)'
        card.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.08)'
      }
    }

    const getPageIcon = (page) => {
      const icons = {
        books: 'fas fa-layer-group',
        history: 'fas fa-history',
        account: 'fas fa-user'
      }
      return icons[page] || 'fas fa-home'
    }

    onMounted(() => {
      // Add transition styles for stat cards
      const statCards = document.querySelectorAll('.stat-card')
      statCards.forEach(card => {
        card.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease'
      })
    })

    return {
      currentTab,
      pageData,
      stats,
      recentActivities,
      handleTabChange,
      handleCardHover,
      getPageIcon
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.home-page {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: #f8fafc;
  min-height: 100vh;
}

.content {
  margin-top: 10px;
  padding: 40px 24px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.page-header {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
  text-align: center;
}

.page-title {
  color: #1e293b;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
  transition: opacity 0.3s ease;
}

.page-subtitle {
  color: #64748b;
  font-size: 16px;
  transition: opacity 0.3s ease;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* Chia đều 3 cột */
  gap: 24px;
  margin-bottom: 32px;
}


.stat-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border-left: 4px solid #4f46e5;
  cursor: pointer;
  min-height: 120px; /* hoặc 100-140px tùy ý */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}


.stat-card h3 {
  color: #1e293b;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
}

.stat-card p {
  color: #64748b;
  font-size: 24px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  height: 2.8em;
}


.recent-activity {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.recent-activity h2 {
  color: #1e293b;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #e2e8f0;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #4f46e5;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.activity-text {
  flex: 1;
}

.activity-text h4 {
  color: #1e293b;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 2px;
}

.activity-text p {
  color: #64748b;
  font-size: 12px;
}

.placeholder-content {
  background: white;
  border-radius: 12px;
  padding: 64px 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.placeholder-card i {
  font-size: 48px;
  color: #4f46e5;
  margin-bottom: 16px;
}

.placeholder-card h3 {
  color: #1e293b;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
}

.placeholder-card p {
  color: #64748b;
  font-size: 16px;
  max-width: 400px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .content {
    padding: 24px 16px;
  }
  
  .page-header {
    padding: 24px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .page-subtitle {
    font-size: 14px;
  }
}
</style>

<style>
/* Global styles for Font Awesome */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');
</style>