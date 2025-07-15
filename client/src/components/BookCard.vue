<template>
  <div class="book-card" @click="$emit('view', book)">
    <div class="book-cover">
      <i class="fas fa-book"></i>
    </div>
    <div class="book-info">
      <div class="book-title">{{ book.title }}</div>
      <div class="book-author">{{ book.author }}</div>
      <div class="book-meta">
        <span class="book-category">{{ getCategoryName(book.category) }}</span>
        <span class="book-status" :class="book.status">
          <i :class="book.status === 'available' ? 'fas fa-check-circle' : 'fas fa-clock'" />
          {{ book.status === 'available' ? 'Có sẵn' : 'Đã mượn' }}
        </span>
      </div>
      <div class="book-actions">
        <button class="btn-action btn-primary" :disabled="book.status === 'borrowed'" @click.stop="$emit('borrow', book)">
          <i class="fas fa-book-reader"></i> {{ book.status === 'available' ? 'Mượn sách' : 'Đã mượn' }}
        </button>
        <button class="btn-action btn-secondary" @click.stop="$emit('view', book)">
          <i class="fas fa-info-circle"></i> Chi tiết
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps(['book'])

function getCategoryName(category) {
  const categories = {
    technology: 'Công nghệ',
    business: 'Kinh doanh',
    history: 'Lịch sử',
    philosophy: 'Triết học'
  }
  return categories[category] || 'Khác'
}
</script>

<style scoped>
.book-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: 0.3s;
  cursor: pointer;
}

.book-card:hover {
  transform: translateY(-5px);
}

.book-cover {
  background: #667eea;
  color: white;
  font-size: 2rem;
  height: 150px;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.book-title {
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  text-align: center;
}

.book-author {
  text-align: center;
  color: #666;
  margin-bottom: 1rem;
}

.book-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.book-category {
  background: #f0f0f0;
  padding: 0.3rem 0.8rem;
  border-radius: 1rem;
  font-size: 0.9rem;
}

.book-status {
  padding: 0.3rem 0.8rem;
  border-radius: 1rem;
  font-size: 0.9rem;
}

.available {
  background: #e0fce0;
  color: #2e7d32;
}

.borrowed {
  background: #fff3e0;
  color: #f57c00;
}

.book-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-action {
  flex: 1;
  padding: 0.6rem;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-secondary {
  background: #f1f1f1;
  color: #333;
  border: 1px solid #ccc;
}
</style>