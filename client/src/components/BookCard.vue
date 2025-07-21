<template>
  <div class="book-card" @click="$emit('view', book)">
    <div class="book-cover">
      <i class="fas fa-book"></i>
    </div>

    <div class="book-title">{{ book.title }}</div>
    <div class="book-author">{{ book.author }}</div>

    <div class="book-meta">
      <span class="badge category">{{ getCategoryName(book.category) }}</span>
      <span class="badge" :class="book.status">
        <i :class="book.status === 'available' ? 'fas fa-check-circle' : 'fas fa-clock'" />
        {{ book.status === 'available' ? 'Có sẵn' : 'Đã mượn' }}
      </span>
    </div>

    <div class="book-actions">
      <button class="btn primary" :disabled="book.status !== 'available'" @click.stop="$emit('borrow', book)">
        <i class="fas fa-book-reader"></i> Mượn sách
      </button>
      <button class="btn outline" @click.stop="$emit('view', book)">
        <i class="fas fa-info-circle"></i> Chi tiết
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps(['book'])

function getCategoryName(category) {
  const map = {
    technology: 'Công nghệ',
    business: 'Kinh doanh',
    history: 'Lịch sử',
    philosophy: 'Triết học'
  }
  return map[category] || 'Khác'
}
</script>

<style scoped>
.book-card {
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  padding: 1rem;
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
  max-width: 250px;
  width: 150%;
 
 
}
.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.book-cover {
  height: 140px;
  background: #667eea;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  border-radius: 0.75rem;
  margin-bottom: 1rem;
}

.book-title {
  font-weight: 700;
  font-size: 1.2rem;
  margin-bottom: 0.3rem;
}

.book-author {
  color: #6b7280;
  font-size: 0.95rem;
  margin-bottom: 1rem;
}

.book-meta {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.badge {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.4rem 0.8rem;
  border-radius: 999px;
  font-size: 0.8rem;
}

.category {
  background: #f1f1f1;
  color: #333;
}

.available {
  background: #dcfce7;
  color: #15803d;
}
.borrowed {
  background: #fef3c7;
  color: #b45309;
}

.book-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

.btn {
  flex: 1;
  padding: 0.6rem;
  font-weight: 600;
  border-radius: 0.6rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  transition: 0.2s;
  cursor: pointer;
}

.primary {
  background: #667eea;
  color: white;
  border: none;
}
.primary:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}

.outline {
  background: white;
  color: #333;
  border: 1px solid #ccc;
}

@media (max-width: 480px) {
  .book-meta {
    flex-direction: column;
    align-items: center;
  }

  .book-actions {
    flex-direction: column;
  }
}
</style>
