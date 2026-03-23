<template>
  <div class="admin-section">
    <div class="section-header">
      <h1>Модерация отзывов</h1>
      <div class="header-actions">
        <button @click="loadPending" class="btn btn-secondary">Обновить</button>
        <button v-if="selectedIds.length" @click="bulkAction('approve')" class="btn btn-approve">
          Одобрить ({{ selectedIds.length }})
        </button>
        <button v-if="selectedIds.length" @click="bulkAction('reject')" class="btn btn-reject">
          Отклонить ({{ selectedIds.length }})
        </button>
      </div>
    </div>

    <div class="stats-bar">
      <div class="stat-item"><span class="stat-value">{{ stats.pending }}</span><span class="stat-label">На модерации</span></div>
      <div class="stat-item"><span class="stat-value">{{ stats.approved }}</span><span class="stat-label">Одобрено</span></div>
      <div class="stat-item"><span class="stat-value">{{ stats.rejected }}</span><span class="stat-label">Отклонено</span></div>
      <div class="stat-item"><span class="stat-value">{{ stats.avgRating }}</span><span class="stat-label">Средний рейтинг</span></div>
    </div>

    <div class="filters-bar">
      <div class="filter-group">
        <label>Поиск:</label>
        <input v-model="filters.search" @input="applyFilters" type="text" placeholder="Поиск..." class="form-input">
      </div>
      <div class="filter-group">
        <label>Ресторан:</label>
        <select v-model="filters.restaurant_id" @change="applyFilters" class="form-select">
          <option value="">Все</option>
          <option v-for="r in restaurants" :key="r.id" :value="r.id">{{ r.name }}</option>
        </select>
      </div>
      <div class="filter-group">
        <label>Сортировка:</label>
        <select v-model="filters.sort" @change="applyFilters" class="form-select">
          <option value="newest">Новые</option>
          <option value="oldest">Старые</option>
          <option value="rating_high">Высокий рейтинг</option>
          <option value="rating_low">Низкий рейтинг</option>
        </select>
      </div>
    </div>

    <!-- Модальное окно просмотра -->
    <div v-if="showModal && selectedReview" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Отзыв #{{ selectedReview.id }}</h3>
          <button @click="closeModal" class="btn-close">✕</button>
        </div>
        <div class="modal-body">
          <div class="review-detail">
            <div class="review-author">
              <div class="avatar">{{ getInitials(selectedReview.user?.name) }}</div>
              <div>
                <strong>{{ selectedReview.user?.name || 'Аноним' }}</strong>
                <div class="meta">{{ formatDate(selectedReview.created_at) }}</div>
              </div>
            </div>
            <div class="review-rating">
              <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= selectedReview.rating }">★</span>
            </div>
          </div>
          <div v-if="selectedReview.restaurant_name" class="review-restaurant"><strong>{{ selectedReview.restaurant_name }}</strong></div>
          <h4 class="review-title">{{ selectedReview.title }}</h4>
          <p class="review-text">{{ selectedReview.text }}</p>
          <div class="review-meta">
            <span class="status-badge" :class="selectedReview.status">{{ getStatusLabel(selectedReview.status) }}</span>
          </div>
        </div>
        <div class="modal-actions">
          <button @click="approveReview(selectedReview)" class="btn btn-approve">Одобрить</button>
          <button @click="openRejectModal(selectedReview)" class="btn btn-reject">Отклонить</button>
          <button @click="closeModal" class="btn btn-cancel">Закрыть</button>
        </div>
      </div>
    </div>

    <div v-if="showRejectModal && selectedReview" class="modal-overlay" @click="closeRejectModal">
      <div class="modal-content modal-small" @click.stop>
        <h3>Отклонить отзыв</h3>
        <div class="reject-reasons">
          <label v-for="(reason, key) in rejectReasons" :key="key" class="reason-option">
            <input type="radio" v-model="rejectReason" :value="key"><span>{{ reason }}</span>
          </label>
          <label class="reason-option custom">
            <input type="radio" v-model="rejectReason" value="custom"><span>Другое:</span>
          </label>
        </div>
        <input v-if="rejectReason === 'custom'" v-model="customRejectReason" type="text" placeholder="Причина..." class="form-input">
        <div class="modal-actions">
          <button @click="rejectReview(selectedReview)" class="btn btn-reject">Подтвердить</button>
          <button @click="closeRejectModal" class="btn btn-cancel">Отмена</button>
        </div>
      </div>
    </div>

    <div v-if="loading && !reviews.length" class="loading-state">Загрузка...</div>
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="loadPending" class="btn btn-primary">Повторить</button>
    </div>
    <div v-else-if="!reviews.length" class="empty-state">
      <p>Нет отзывов на модерации</p>
    </div>

    <div v-else class="items-grid">
      <div class="select-all-card">
        <label class="select-all-label">
          <input type="checkbox" v-model="selectAll" @change="toggleSelectAll"><span>Выбрать все</span>
        </label>
      </div>
      
      <div v-for="review in reviews" :key="review.id" class="item-card review-card" :class="{ selected: selectedIds.includes(review.id) }">
        <div class="card-select"><input type="checkbox" v-model="selectedIds" :value="review.id"></div>
        <div class="card-header">
          <div class="card-author">
            <div class="avatar small">{{ getInitials(review.user?.name) }}</div>
            <div><strong>{{ review.user?.name || 'Аноним' }}</strong><div class="date">{{ formatDate(review.created_at) }}</div></div>
          </div>
          <div class="card-rating">
            <span v-for="n in 5" :key="n" class="star small" :class="{ filled: n <= review.rating }">★</span>
          </div>
        </div>
        <div v-if="review.restaurant_name" class="card-restaurant">{{ review.restaurant_name }}</div>
        <h3 class="card-title">{{ review.title }}</h3>
        <p class="card-text">{{ truncateText(review.text, 120) }}</p>
        <div class="card-footer">
          <span class="status-badge" :class="review.status">{{ getStatusLabel(review.status) }}</span>
        </div>
        <div class="item-actions">
          <button @click="viewReview(review)" class="btn btn-view">Просмотр</button>
          <button @click="approveReview(review)" class="btn btn-approve">Одобрить</button>
          <button @click="openRejectModal(review)" class="btn btn-reject">Отклонить</button>
          <button @click="deleteReview(review.id)" class="btn btn-delete">Удалить</button>
        </div>
      </div>
    </div>
    
    <div v-if="totalPages > 1" class="pagination">
      <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="pagination-btn">←</button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" class="pagination-btn">→</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminReviewsModeration',
  data() {
    return {
      reviews: [],
      restaurants: [],
      stats: { pending: 0, approved: 0, rejected: 0, avgRating: 0 },
      loading: false,
      error: null,
      showModal: false,
      showRejectModal: false,
      selectedReview: null,
      filters: { search: '', restaurant_id: '', sort: 'newest' },
      currentPage: 1,
      itemsPerPage: 12,
      totalPages: 1,
      selectedIds: [],
      selectAll: false,
      rejectReason: 'spam',
      customRejectReason: '',
      rejectReasons: {
        spam: 'Спам',
        offensive: 'Оскорбления',
        irrelevant: 'Не по теме',
        fake: 'Фейк',
        custom: 'Другое'
      },
      API_URL: 'https://fooddelivery.s99220rx.beget.tech/api'
    }
  },
  created() {
    this.loadData()
  },
  methods: {
    async loadData() {
      await Promise.all([this.loadPending(), this.loadStats(), this.loadRestaurants()])
    },

    async fetchApi(url, options = {}) {
      const token = localStorage.getItem('token')
      const res = await fetch(`${this.API_URL}${url}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          ...options.headers
        },
        ...options
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || `Ошибка ${res.status}`)
      }

      return res.json()
    },

    async loadPending() {
      this.loading = true
      this.error = null

      try {
        const params = new URLSearchParams({
          page: this.currentPage,
          limit: this.itemsPerPage,
          sort: this.filters.sort
        })

        if (this.filters.restaurant_id) params.append('restaurant_id', this.filters.restaurant_id)
        if (this.filters.search) params.append('search', this.filters.search)

        const data = await this.fetchApi(`/admin/reviews/pending?${params}`)
        this.reviews = data.data || []
        this.totalPages = data.pagination?.total_pages || 1
      } catch (e) {
        this.error = e.message.includes('fetch') ? 'Нет соединения' : e.message
      } finally {
        this.loading = false
      }
    },

    async loadStats() {
      try {
        const data = await this.fetchApi('/admin/reviews/stats')
        if (data?.data?.overview) {
          const o = data.data.overview
          this.stats = {
            pending: o.pending,
            approved: o.approved,
            rejected: o.rejected,
            avgRating: o.avg_approved_rating?.toFixed(1) || '0.0'
          }
        }
      } catch (e) {
        console.error(e)
      }
    },

    async loadRestaurants() {
      try {
        const data = await this.fetchApi('/restaurants?limit=100')
        this.restaurants = Array.isArray(data.data)
          ? data.data
          : (Array.isArray(data) ? data : [])
      } catch (e) {
        this.restaurants = []
      }
    },

    applyFilters() {
      this.currentPage = 1
      this.loadPending()
    },

    changePage(p) {
      if (p >= 1 && p <= this.totalPages) {
        this.currentPage = p
        this.loadPending()
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },

    toggleSelectAll() {
      this.selectedIds = this.selectAll
        ? this.reviews.map(r => r.id)
        : []
    },

    async bulkAction(action) {
      if (!this.selectedIds.length || !confirm(`${action === 'approve' ? 'Одобрить' : 'Отклонить'} ${this.selectedIds.length}?`)) return

      try {
        await this.fetchApi('/admin/reviews/bulk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action,
            review_ids: this.selectedIds,
            reason: action === 'reject' ? 'Массовая модерация' : undefined
          })
        })
        alert('Готово')
        this.selectedIds = []
        this.selectAll = false
        await this.loadData()
      } catch (e) {
        alert(e.message)
      }
    },

    viewReview(r) {
      this.selectedReview = { ...r }
      this.showModal = true
    },

    closeModal() {
      this.showModal = false
      this.selectedReview = null
    },

    openRejectModal(r) {
      this.selectedReview = { ...r }
      this.rejectReason = 'spam'
      this.customRejectReason = ''
      this.showRejectModal = true
      this.showModal = false
    },

    closeRejectModal() {
      this.showRejectModal = false
      this.selectedReview = null
    },

    async approveReview(review) {
      if (!confirm(`Одобрить "${review.title}"?`)) return

      try {
        await this.fetchApi(`/admin/reviews/${review.id}/approve`, { method: 'PUT' })
        alert('Одобрено')
        this.closeModal()
        this.closeRejectModal()
        await this.loadData()
      } catch (e) {
        alert(e.message)
      }
    },

    async rejectReview(review) {
      const reason = this.rejectReason === 'custom'
        ? (this.customRejectReason || 'Причина не указана')
        : this.rejectReasons[this.rejectReason]

      try {
        await this.fetchApi(`/admin/reviews/${review.id}/reject`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reason })
        })
        alert(`Отклонено: ${reason}`)
        this.closeRejectModal()
        await this.loadData()
      } catch (e) {
        alert(e.message)
      }
    },

    async deleteReview(id) {
      if (!confirm('Удалить безвозвратно?')) return

      try {
        await this.fetchApi(`/reviews/${id}`, { method: 'DELETE' })
        alert('Удалено')
        await this.loadData()
      } catch (e) {
        alert(e.message)
      }
    },

    getInitials(name) {
      return name
        ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : 'А'
    },

    formatDate(d) {
      return d
        ? new Date(d).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        : ''
    },

    truncateText(t, l) {
      return t && t.length > l ? t.slice(0, l) + '...' : t
    },

    getStatusLabel(s) {
      return { pending: 'На модерации', approved: 'Одобрено', rejected: 'Отклонено' }[s] || s
    }
  }
}
</script>

<style scoped>
.admin-section { max-width: 1400px; margin: 0 auto; padding: 20px; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; flex-wrap: wrap; gap: 15px; }
.section-header h1 { color: #78350F; font-size: 2rem; margin: 0; }
.header-actions { display: flex; gap: 10px; flex-wrap: wrap; }
.stats-bar { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 30px; background: #FFFBEB; padding: 20px; border-radius: 12px; border: 2px solid #FCD34D; }
.stat-item { text-align: center; }
.stat-value { display: block; font-size: 1.8rem; font-weight: bold; color: #D97706; }
.stat-label { color: #92400E; font-size: 0.9rem; }
.filters-bar { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 30px; background: #FFFBEB; padding: 20px; border-radius: 12px; border: 2px solid #FCD34D; }
.filter-group { display: flex; flex-direction: column; gap: 8px; }
.filter-group label { color: #92400E; font-weight: 600; font-size: 0.9rem; }
.form-input, .form-select { padding: 12px 16px; background: #FFFBEB; border: 2px solid #FCD34D; border-radius: 10px; color: #78350F; font-size: 1rem; }
.form-input:focus, .form-select:focus { outline: none; border-color: #D97706; }
.modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.6); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
.modal-content { background: #FFFBEB; border: 2px solid #FCD34D; border-radius: 15px; padding: 30px; max-width: 600px; width: 100%; max-height: 90vh; overflow-y: auto; }
.modal-small { max-width: 450px; }
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #FCD34D; }
.modal-header h3 { color: #78350F; margin: 0; }
.btn-close { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #92400E; padding: 5px 10px; border-radius: 5px; }
.btn-close:hover { background: #FCD34D; }
.review-detail { display: flex; justify-content: space-between; align-items: flex-start; gap: 15px; margin-bottom: 15px; flex-wrap: wrap; }
.review-author { display: flex; align-items: center; gap: 12px; }
.avatar { width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, #D97706, #92400E); color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1.1rem; }
.avatar.small { width: 36px; height: 36px; font-size: 0.9rem; }
.meta, .date { font-size: 0.85rem; color: #B45309; }
.review-rating { display: flex; align-items: center; gap: 8px; }
.star { color: #ddd; font-size: 1.3rem; }
.star.filled { color: #FCD34D; }
.star.small { font-size: 1rem; }
.review-restaurant { background: rgba(217, 119, 6, 0.1); padding: 8px 12px; border-radius: 8px; margin-bottom: 15px; color: #92400E; }
.review-title { color: #78350F; margin: 0 0 10px 0; font-size: 1.2rem; }
.review-text { color: #92400E; line-height: 1.6; margin-bottom: 20px; white-space: pre-wrap; }
.review-meta { display: flex; gap: 15px; align-items: center; padding-top: 15px; border-top: 1px solid rgba(146, 64, 14, 0.2); }
.reject-reasons { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
.reason-option { display: flex; align-items: center; gap: 10px; padding: 10px 15px; background: #FFFBEB; border: 2px solid #FCD34D; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
.reason-option:hover { border-color: #D97706; }
.reason-option input[type="radio"] { cursor: pointer; }
.reason-option.custom { flex-direction: column; align-items: flex-start; }
.modal-actions { display: flex; gap: 12px; margin-top: 25px; flex-wrap: wrap; }
.items-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 25px; }
.select-all-card { grid-column: 1 / -1; background: #FEF3C7; border: 2px dashed #FCD34D; border-radius: 12px; padding: 15px 20px; }
.select-all-label { display: flex; align-items: center; gap: 10px; cursor: pointer; color: #92400E; font-weight: 500; }
.select-all-label input[type="checkbox"] { width: 18px; height: 18px; cursor: pointer; }
.item-card { background: #FFFBEB; border: 2px solid #FCD34D; border-radius: 15px; padding: 20px; transition: all 0.3s ease; display: flex; flex-direction: column; position: relative; }
.item-card:hover { transform: translateY(-5px); box-shadow: 0 8px 25px rgba(245, 158, 11, 0.15); }
.item-card.selected { border-color: #60A5FA; background: #EFF6FF; }
.card-select { position: absolute; top: 15px; right: 15px; }
.card-select input[type="checkbox"] { width: 20px; height: 20px; cursor: pointer; }
.card-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; margin-bottom: 10px; flex-wrap: wrap; }
.card-author { display: flex; align-items: center; gap: 10px; }
.card-author strong { color: #78350F; font-size: 0.95rem; }
.card-restaurant { font-size: 0.9rem; color: #92400E; background: rgba(217, 119, 6, 0.1); padding: 4px 10px; border-radius: 12px; margin-bottom: 10px; display: inline-block; }
.card-title { color: #78350F; margin: 0 0 8px 0; font-size: 1.1rem; font-weight: 600; }
.card-text { color: #92400E; line-height: 1.5; margin-bottom: 15px; flex: 1; font-size: 0.95rem; }
.card-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px solid rgba(146, 64, 14, 0.2); margin-bottom: 15px; }
.status-badge { font-size: 0.8rem; padding: 4px 10px; border-radius: 12px; font-weight: 500; }
.status-badge.pending { background: rgba(217, 119, 6, 0.2); color: #92400E; }
.status-badge.approved { background: rgba(16, 185, 129, 0.2); color: #059669; }
.status-badge.rejected { background: rgba(220, 38, 38, 0.2); color: #B91C1C; }
.item-actions { display: flex; gap: 8px; flex-wrap: wrap; }
.btn { padding: 10px 18px; border-radius: 10px; font-weight: 600; transition: all 0.3s; border: none; cursor: pointer; font-size: 0.9rem; display: inline-flex; align-items: center; justify-content: center; gap: 5px; }
.btn-primary { background: #D97706; color: white; }
.btn-primary:hover { background: #B45309; }
.btn-secondary { background: #6B7280; color: white; }
.btn-secondary:hover { background: #4B5563; }
.btn-approve { background: #10B981; color: white; }
.btn-approve:hover { background: #059669; }
.btn-reject { background: #DC2626; color: white; }
.btn-reject:hover { background: #B91C1C; }
.btn-delete { background: #EF4444; color: white; padding: 8px 12px; }
.btn-delete:hover { background: #DC2626; }
.btn-view { background: #60A5FA; color: white; padding: 8px 14px; }
.btn-view:hover { background: #3B82F6; }
.btn-cancel { background: #6B7280; color: white; }
.btn-cancel:hover { background: #4B5563; }
.loading-state, .error-state, .empty-state { grid-column: 1 / -1; text-align: center; padding: 50px 20px; background: #FFFBEB; border-radius: 12px; border: 2px dashed #FCD34D; color: #92400E; }
.error-state { border-color: #FCA5A5; background: #FEF2F2; color: #DC2626; }
.pagination { display: flex; justify-content: center; align-items: center; gap: 20px; margin-top: 30px; padding: 20px; flex-wrap: wrap; }
.pagination-btn { padding: 10px 25px; background: #D97706; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; transition: background 0.3s; }
.pagination-btn:hover:not(:disabled) { background: #B45309; }
.pagination-btn:disabled { background: #FCD34D; color: #92400E; cursor: not-allowed; }
.pagination span { color: #78350F; font-weight: 500; }
@media (max-width: 991px) { .stats-bar { grid-template-columns: repeat(2, 1fr); } .filters-bar { grid-template-columns: 1fr; } .items-grid { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); } }
@media (max-width: 768px) { .section-header { flex-direction: column; align-items: flex-start; } .header-actions { width: 100%; justify-content: flex-start; } .stats-bar { grid-template-columns: 1fr; } .items-grid { grid-template-columns: 1fr; } .modal-content { padding: 20px; margin: 10px; } .modal-actions { flex-direction: column; } .modal-actions .btn { width: 100%; } .card-header { flex-direction: column; align-items: flex-start; } .card-footer { flex-direction: column; align-items: flex-start; gap: 8px; } .item-actions { width: 100%; justify-content: center; } .item-actions .btn { flex: 1; } }
@media (max-width: 480px) { .admin-section { padding: 15px; } .section-header h1 { font-size: 1.5rem; } .stat-value { font-size: 1.4rem; } .item-card { padding: 15px; } .card-title { font-size: 1rem; } .card-text { font-size: 0.9rem; } }
</style>