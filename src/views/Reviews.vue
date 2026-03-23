<template>
  <div class="reviews-section">
    <div class="section-header">
      <h1>Отзывы клиентов</h1>
      <button @click="openAddForm" class="btn btn-primary" :disabled="!isAuthenticated">
        {{ isAuthenticated ? '+ Оставить отзыв' : 'Войдите, чтобы оставить отзыв' }}
      </button>
    </div>

    <div v-if="!showForm" class="stats-bar">
      <div class="stat-item">
        <span class="stat-value">{{ stats.averageRating || '0.0' }}</span>
        <span class="stat-label">Средний рейтинг</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ stats.totalReviews || 0 }}</span>
        <span class="stat-label">Всего отзывов</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ stats.recommendedPercent || 0 }}%</span>
        <span class="stat-label">Рекомендуют</span>
      </div>
    </div>

    <div v-if="showForm" class="form-modal">
      <h3>{{ editingReview ? 'Редактировать отзыв' : 'Оставить отзыв' }}</h3>
      <form @submit.prevent="saveReview">
        <div class="form-group">
          <label>Ваша оценка *</label>
          <div class="rating-input">
            <span 
              v-for="n in 5" 
              :key="n"
              class="star clickable"
              :class="{ filled: n <= formData.rating }"
              @click="formData.rating = n"
            >★</span>
          </div>
        </div>
        
        <div class="form-group">
          <label>Заголовок *</label>
          <input v-model="formData.title" type="text" required placeholder="Кратко о впечатлении">
        </div>
        
        <div class="form-group">
          <label>Ваш отзыв *</label>
          <textarea v-model="formData.text" rows="4" required placeholder="Расскажите подробнее..."></textarea>
        </div>
        
        <div class="form-group">
          <label>Ресторан</label>
          <select v-model="formData.restaurant_id">
            <option value="">Не указывать</option>
            <option v-for="r in restaurants" :key="r.id" :value="r.id">{{ r.name }}</option>
          </select>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-save" :disabled="isSubmitting">
            {{ isSubmitting ? 'Отправка...' : 'Опубликовать' }}
          </button>
          <button @click="cancelEdit" type="button" class="btn btn-cancel">✕ Отмена</button>
        </div>
      </form>
    </div>

    <div v-else class="reviews-grid">
      <div v-if="loading && reviews.length === 0" class="state-message loading">
         Загрузка отзывов...
      </div>
      
      <div v-else-if="error && reviews.length === 0" class="state-message error">
        <p>{{ error }}</p>
        <button @click="forceReload" class="btn-retry">Попробовать снова</button>
      </div>
      
      <div v-else-if="reviews.length === 0" class="state-message empty">
        <p>Пока нет отзывов. Будьте первым!</p>
        
      </div>

      <div v-for="review in reviews" :key="review.id" class="review-card" :class="{ pending: review.status === 'pending' }">
        <div class="review-header">
          <div class="reviewer-info">
            <div class="reviewer-avatar">{{ getInitials(review.userName) }}</div>
            <div>
              <strong>{{ review.userName }}</strong>
              <div class="review-date">{{ formatDate(review.created_at) }}</div>
              <div v-if="review.restaurant_name" class="restaurant-tag">{{ review.restaurant_name }}</div>
            </div>
          </div>
          <div class="review-rating">
            <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= review.rating }">★</span>
          </div>
        </div>
        
        <h4 class="review-title">{{ review.title }}</h4>
        <p class="review-text">{{ review.text }}</p>
        
        <div class="review-footer">
         
          <span v-if="review.status === 'pending'" class="status-badge">На модерации</span>
          
          <div class="review-actions" v-if="canEditReview(review)">
            <button @click="editReview(review)" class="btn btn-edit" title="Редактировать">Редактировать</button>
            <button @click="deleteReview(review.id)" class="btn btn-delete" title="Удалить">Удалить</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="totalPages > 1 && !showForm && reviews.length > 0" class="pagination">
      <button 
        @click="changePage(currentPage - 1)" 
        :disabled="currentPage === 1"
        class="pagination-btn"
      >← Назад</button>
      <span>Страница {{ currentPage }} из {{ totalPages }}</span>
      <button 
        @click="changePage(currentPage + 1)" 
        :disabled="currentPage === totalPages"
        class="pagination-btn"
      >Вперёд →</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReviewsPage',
  data() {
    return {
      reviews: [],
      restaurants: [],
      stats: {
        totalReviews: 0,
        averageRating: 0,
        recommendedPercent: 0
      },
      showForm: false,
      editingReview: null,
      isSubmitting: false,
      loading: false,
      error: null,

      filters: {
        rating: 'all',
        sort: 'newest'
      },
      currentPage: 1,
      itemsPerPage: 6,
      totalPages: 1,

      formData: {
        rating: 5,
        title: '',
        text: '',
        restaurant_id: ''
      },

      API_URL: 'http://fooddelivery.s99220rx.beget.tech/api/'
    }
  },
  computed: {
    isAuthenticated() {
      return !!localStorage.getItem('token')
    },
    hasToken() {
      return !!localStorage.getItem('token')
    },
    currentUser() {
      try {
        return JSON.parse(localStorage.getItem('user') || 'null')
      } catch {
        return null
      }
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    async loadData() {
      await Promise.all([
        this.loadStats(),
        this.loadReviews(),
        this.loadRestaurants()
      ])
    },

    async loadStats() {
      try {
        const res = await fetch(`${this.API_URL}/reviews/stats`, {
          headers: { 'Accept': 'application/json' }
        })

        if (!res.ok) {
          const text = await res.text()
          return
        }

        const data = await res.json()

        if (data?.success && data?.data) {
          this.stats = data.data
        }
      } catch (e) {
        console.error('Ошибка статистики:', e.message)
      }
    },

    async loadReviews() {
      this.loading = true
      this.error = null

      try {
        const token = localStorage.getItem('token')
        const params = new URLSearchParams({
          rating: this.filters.rating,
          sort: this.filters.sort,
          page: this.currentPage,
          limit: this.itemsPerPage
        })

        const headers = { 'Accept': 'application/json' }
        if (token) {
          headers['Authorization'] = `Bearer ${token}`
        }

        const url = `${this.API_URL}/reviews?${params}`
        const res = await fetch(url, { headers })

        if (!res.ok) {
          const errorText = await res.text()
          throw new Error(`HTTP ${res.status}: ${errorText || 'Unknown error'}`)
        }

        const data = await res.json()

        if (data?.success && Array.isArray(data?.data)) {
          this.reviews = data.data.map(review => ({
            ...review,
            userName: review.user?.name || review.user_name || 'Аноним',
            userId: review.user?.id || review.user_id,
            restaurantName: review.restaurant?.name || review.restaurant_name,
            is_helpful: review.is_helpful || false,
            helpful_count: review.helpful_count || 0
          }))
          this.totalPages = data.pagination?.total_pages || 1
        } else {
          this.error = 'Неверный формат ответа от сервера'
        }
      } catch (e) {
        console.error('Ошибка загрузки отзывов:', e)

        if (e.message.includes('Failed to fetch')) {
          this.error = 'Не удалось соединиться с сервером. Проверьте интернет и настройки CORS.'
        } else if (e.message.includes('401')) {
          this.error = 'Требуется авторизация. Пожалуйста, войдите в аккаунт.'
        } else if (e.message.includes('404')) {
          this.error = 'API эндпоинт не найден.'
        } else {
          this.error = `Ошибка: ${e.message}`
        }
      } finally {
        this.loading = false
      }
    },

    async loadRestaurants() {
      try {
        const res = await fetch(`${this.API_URL}/restaurants?limit=50&active=1`, {
          headers: { 'Accept': 'application/json' }
        })

        if (!res.ok) {
          return
        }

        const data = await res.json()
        this.restaurants = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
            ? data
            : []
      } catch (e) {
        console.error('Ошибка ресторанов:', e)
        this.restaurants = []
      }
    },

    openAddForm() {
      if (!this.isAuthenticated) {
        this.$router.push('/login')
        return
      }
      this.resetForm()
      this.showForm = true
      this.editingReview = null
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },

    resetForm() {
      this.formData = {
        rating: 5,
        title: '',
        text: '',
        restaurant_id: ''
      }
    },

    async saveReview() {
      if (!this.isAuthenticated) {
        this.$router.push('/login')
        return
      }

      this.isSubmitting = true

      try {
        const token = localStorage.getItem('token')
        const isEdit = !!this.editingReview
        const url = isEdit
          ? `${this.API_URL}/reviews/${this.editingReview.id}`
          : `${this.API_URL}/reviews`
        const method = isEdit ? 'PUT' : 'POST'

        const res = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          },
          body: JSON.stringify(this.formData)
        })

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          throw new Error(errorData.message || `HTTP ${res.status}`)
        }

        await res.json()

        this.cancelEdit()
        await this.loadData()

        const message = isEdit
          ? 'Отзыв обновлён и отправлен на модерацию'
          : 'Спасибо! Ваш отзыв отправлен на модерацию'

        if (this.$toast?.success) {
          this.$toast.success(message)
        } else {
          alert(message)
        }
      } catch (e) {
        console.error('Ошибка сохранения:', e)
        const message = e.message || 'Не удалось сохранить отзыв'

        if (this.$toast?.error) {
          this.$toast.error(message)
        } else {
          alert('Ошибка: ' + message)
        }
      } finally {
        this.isSubmitting = false
      }
    },

    editReview(review) {
      this.editingReview = review
      this.formData = {
        rating: review.rating,
        title: review.title,
        text: review.text,
        restaurant_id: review.restaurant_id || ''
      }
      this.showForm = true
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },

    cancelEdit() {
      this.showForm = false
      this.editingReview = null
      this.resetForm()
    },

    async deleteReview(reviewId) {
      if (!confirm('Вы уверены, что хотите удалить этот отзыв?')) {
        return
      }

      try {
        const token = localStorage.getItem('token')
        const res = await fetch(`${this.API_URL}/reviews/${reviewId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        })

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          throw new Error(errorData.message || `HTTP ${res.status}`)
        }

        this.reviews = this.reviews.filter(r => r.
                id !== reviewId)
        await this.loadStats()


        if (this.$toast?.success) {
          this.$toast.success('Отзыв удалён')
        } else {
          alert('Отзыв удалён')
        }
      } catch (e) {
        console.error('Ошибка удаления:', e)
        if (this.$toast?.error) {
          this.$toast.error('Не удалось удалить: ' + e.message)
        } else {
          alert('Ошибка: ' + e.message)
        }
      }
    },

    canEditReview(review) {
      if (!this.isAuthenticated) return false
      const isAdmin = this.currentUser?.role === 'admin'
      const isAuthor = this.currentUser?.id === review.user_id
      return isAdmin || isAuthor
    },

    getInitials(name) {
      if (!name) return 'А'
      return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    },

    formatDate(dateString) {
      if (!dateString) return ''
      try {
        return new Date(dateString).toLocaleDateString('ru-RU', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
      } catch {
        return dateString
      }
    },

    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
        this.loadReviews()
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },

    applyFilters() {
      this.currentPage = 1
      this.loadReviews()
    },

    forceReload() {
      this.error = null
      this.loadData()
    }
  }
}
</script>


<style scoped>
.reviews-section {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 15px;
}

.section-header h1 {
  color: #78350F;
  font-size: 2rem;
  margin: 0;
  font-weight: 700;
}

.btn-debug {
  padding: 6px 14px;
  margin-right: 10px;
  margin-top: 10px;
  background: #60A5FA;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: background 0.2s;
}

.btn-debug:hover {
  background: #3B82F6;
}

.stats-bar {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 30px;
  background: #FFFBEB;
  padding: 20px;
  border-radius: 12px;
  border: 2px solid #FCD34D;
}

.stat-item {
  text-align: center;
  padding: 10px;
}

.stat-value {
  display: block;
  font-size: 1.8rem;
  font-weight: bold;
  color: #D97706;
  line-height: 1.2;
}

.stat-label {
  color: #92400E;
  font-size: 0.9rem;
  margin-top: 5px;
  display: block;
}

.form-modal {
  background: #FFFBEB;
  border: 2px solid #FCD34D;
  border-radius: 15px;
  padding: 35px;
  max-width: 650px;
  margin: 0 auto 30px;
  box-shadow: 0 4px 20px rgba(120, 53, 15, 0.1);
}

.form-modal h3 {
  color: #78350F;
  margin: 0 0 25px 0;
  text-align: center;
  font-size: 1.5rem;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  color: #92400E;
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 0.95rem;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 14px 16px;
  background: #FFFBEB;
  border: 2px solid #FCD34D;
  border-radius: 10px;
  color: #78350F;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #D97706;
  background: #fff;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.rating-input {
  display: flex;
  gap: 8px;
}

.star {
  font-size: 1.8rem;
  color: #ddd;
  cursor: default;
  transition: transform 0.2s;
}

.star.filled {
  color: #FCD34D;
}

.star.clickable {
  cursor: pointer;
}

.star.clickable:hover {
  transform: scale(1.2);
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 25px;
}

.reviews-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
}

.state-message {
  grid-column: 1 / -1;
  text-align: center;
  padding: 50px 20px;
  background: #FFFBEB;
  border-radius: 12px;
  border: 2px dashed #FCD34D;
  color: #92400E;
}

.state-message.loading {
  font-size: 1.1rem;
}

.state-message.error {
  border-color: #FCA5A5;
  background: #FEF2F2;
  color: #DC2626;
}

.state-message.empty {
  color: #78350F;
}

.spinner,
.error-icon,
.empty-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 15px;
}

.btn-retry {
  margin-top: 15px;
  padding: 10px 25px;
  background: #D97706;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}

.btn-retry:hover {
  background: #B45309;
}

.review-card {
  background: #FFFBEB;
  border: 2px solid #FCD34D;
  border-radius: 15px;
  padding: 25px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.review-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(245, 158, 11, 0.15);
}

.review-card.pending {
  border-style: dashed;
  opacity: 0.9;
  background: #FFFBEB;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
  gap: 15px;
  flex-wrap: wrap;
}

.reviewer-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.reviewer-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #D97706, #92400E);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.reviewer-info strong {
  color: #78350F;
  font-size: 1rem;
  display: block;
}

.review-date {
  font-size: 0.85rem;
  color: #B45309;
}

.restaurant-tag {
  font-size: 0.85rem;
  color: #92400E;
  background: rgba(217, 119, 6, 0.1);
  padding: 3px 10px;
  border-radius: 15px;
  display: inline-block;
  margin-top: 3px;
}

.review-rating {
  color: #FCD34D;
  font-size: 1.2rem;
  letter-spacing: 2px;
  flex-shrink: 0;
}

.review-title {
  color: #78350F;
  margin: 0 0 10px 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.review-text {
  color: #92400E;
  line-height: 1.6;
  margin-bottom: 15px;
  flex: 1;
  word-wrap: break-word;
}

.review-footer {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
  padding-top: 15px;
  border-top: 1px solid rgba(146, 64, 14, 0.2);
}

.helpful-btn {
  background: none;
  border: none;
  color: #92400E;
  cursor: pointer;
  font-size: 0.95rem;
  padding: 5px 10px;
  border-radius: 6px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;
}

.helpful-btn:hover,
.helpful-btn.active {
  background: #10B981;
  color: white;
}

.status-badge {
  font-size: 0.8rem;
  color: #D97706;
  background: rgba(217, 119, 6, 0.15);
  padding: 3px 10px;
  border-radius: 12px;
  font-weight: 500;
}

.review-actions {
  margin-left: auto;
  display: flex;
  gap: 8px;
}

.btn {
  padding: 12px 20px;
  border-radius: 10px;
  font-weight: 600;
  transition: all 0.3s;
  border: none;
  cursor: pointer;
  font-size: 0.95rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.btn-primary {
  background: #D97706;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #B45309;
}

.btn-primary:disabled {
  background: #FCD34D;
  color: #92400E;
  cursor: not-allowed;
}

.btn-edit {
  background: #60A5FA;
  color: white;
  padding: 8px 14px;
  font-size: 0.9rem;
}

.btn-edit:hover {
  background: #3B82F6;
}

.btn-delete {
  background: #DC2626;
  color: white;
  padding: 8px 14px;
  font-size: 0.9rem;
}

.btn-delete:hover {
  background: #B91C1C;
}

.btn-save {
  flex: 1;
  padding: 14px 30px;
  background: #10B981;
  color: white;
  font-size: 1rem;
}

.btn-save:hover:not(:disabled) {
  background: #059669;
}

.btn-save:disabled {
  background: #6EE7B7;
  cursor: wait;
}

.btn-cancel {
  flex: 1;
  padding: 14px 30px;
  background: #6B7280;
  color: white;
  font-size: 1rem;
}

.btn-cancel:hover {
  background: #4B5563;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 30px;
  padding: 20px;
  flex-wrap: wrap;
}

.pagination-btn {
  padding: 10px 25px;
  background: #D97706;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s;
  font-size: 0.95rem;
}

.pagination-btn:hover:not(:disabled) {
  background: #B45309;
}

.pagination-btn:disabled {
  background: #FCD34D;
  color: #92400E;
  cursor: not-allowed;
}

.pagination span {
  color: #78350F;
  font-weight: 500;
}

@media (max-width: 768px) {
  .reviews-section {
    padding: 15px;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .section-header h1 {
    font-size: 1.6rem;
  }
  
  .stats-bar {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  
  .stat-value {
    font-size: 1.5rem;
  }
  
  .form-modal {
    padding: 25px 20px;
    margin: 0 0 20px 0;
  }
  
  .reviews-grid {
    grid-template-columns: 1fr;
  }
  
  .review-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .review-rating {
    align-self: flex-end;
  }
  
  .review-actions {
    margin-left: 0;
    margin-top: 10px;
    width: 100%;
    justify-content: flex-end;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn-save,
  .btn-cancel {
    width: 100%;
  }
  
  .pagination {
    flex-direction: column;
    gap: 10px;
  }
}

@media (max-width: 480px) {
  .section-header h1 {
    font-size: 1.4rem;
  }
  
  .stat-value {
    font-size: 1.3rem;
  }
  
  .review-card {
    padding: 20px;
  }
  
  .review-title {
    font-size: 1.1rem;
  }
  
  .star {
    font-size: 1.5rem;
  }
}
</style>