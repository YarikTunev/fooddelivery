<template>
  <div class="admin-feedback">
    <h1>Сообщения пользователей</h1>
    <div class="filters">
      <input v-model="search" @input="fetchData" placeholder="Поиск..." class="search-input">
      <select v-model="filterRead" @change="fetchData" class="filter-select">
        <option value="">Все</option>
        <option value="0">Непрочитанные</option>
        <option value="1">Прочитанные</option>
      </select>
      <button @click="fetchData" class="btn-refresh">Перезагрузка</button>
    </div>

    <div v-if="loading" class="loading">Загрузка...</div>

    <div v-else-if="list.length" class="table-wrapper">
      <table class="feedback-table">
        <thead>
          <tr>
            <th>ID</th><th>Имя</th><th>Email</th><th>Сообщение</th><th>Дата</th><th>Статус</th><th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in list" :key="item.id" :class="{ unread: !item.is_read }">
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td><a :href="`mailto:${item.email}`">{{ item.email }}</a></td>
            <td class="msg-cell" :title="item.message">{{ truncate(item.message, 80) }}</td>
            <td>{{ formatDate(item.created_at) }}</td>
            <td>
              <span :class="['badge', item.is_read ? 'read' : 'new']">
                {{ item.is_read ? '✓' : 'Новое' }}
              </span>
            </td>
            <td class="actions">
              <button v-if="!item.is_read" @click="markRead(item.id)" class="btn-small btn-read">✓</button>
              <button @click="showModal(item)" class="btn-small btn-view">Посмотреть полностью</button>
              <button @click="deleteItem(item.id)" class="btn-small btn-delete">Удалить</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="pagination.last_page > 1" class="pagination">
        <button :disabled="pagination.current_page <= 1" @click="goPage(pagination.current_page - 1)" class="btn-page">←</button>
        <span>{{ pagination.current_page }} / {{ pagination.last_page }}</span>
        <button :disabled="pagination.current_page >= pagination.last_page" @click="goPage(pagination.current_page + 1)" class="btn-page">→</button>
      </div>
    </div>

    <div v-else class="empty">Нет сообщений</div>

    <div v-if="selected" class="modal-overlay" @click.self="selected = null">
      <div class="modal">
        <h3>📨 #{{ selected.id }}</h3>
        <p><b>От:</b> {{ selected.name }} ({{ selected.email }})</p>
        <p><b>Дата:</b> {{ formatDate(selected.created_at) }}</p>
        <p><b>Страница:</b> {{ selected.page || '—' }}</p>
        <p><b>IP:</b> {{ selected.ip_address || '—' }}</p>
        <hr>
        <p class="full-msg">{{ selected.message }}</p>
        <div class="modal-actions">
          <button @click="selected = null" class="btn">Закрыть</button>
          <a :href="`mailto:${selected.email}`" class="btn btn-primary">✉️ Ответить</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminFeedbackView',
  data() {
    return {
      list: [],
      loading: false,
      search: '',
      filterRead: '',
      pagination: {},
      selected: null,
      page: 1,
      API_URL: 'http://fooddelivery.s99220rx.beget.tech/api'
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData(p = 1) {
      this.loading = true
      try {
        const token = localStorage.getItem('token')
        const params = new URLSearchParams({
          page: p,
          per_page: 15,
          ...(this.search && { search: this.search }),
          ...(this.filterRead && { is_read: this.filterRead })
        })
        const url = `${this.API_URL}/feedback?${params}`

        const res = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        })

        if (!res.ok) {
          if (res.status === 401) throw new Error('Требуется авторизация администратора')
          if (res.status === 403) throw new Error('Доступ запрещён. Требуются права администратора')
          const errorData = await res.json().catch(() => ({}))
          throw new Error(errorData.message || `HTTP ${res.status}: ${res.statusText}`)
        }

        const data = await res.json()
        this.list = data.data || []
        this.pagination = data.pagination || { current_page: 1, last_page: 1 }
        this.page = p
      } catch (e) {
        console.error('Ошибка загрузки сообщений:', e)
        if (e.message.includes('Failed to fetch')) {
          alert('Не удалось соединиться с сервером. Проверьте интернет и настройки CORS.')
        } else {
          alert('Ошибка: ' + e.message)
        }
      } finally {
        this.loading = false
      }
    },

    async markRead(id) {
      try {
        const token = localStorage.getItem('token')
        const url = `${this.API_URL}/feedback/${id}/read`
        const res = await fetch(url, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        })

        if (res.ok) this.fetchData(this.page)
      } catch (e) {
        console.error('Ошибка markRead:', e)
      }
    },

    async deleteItem(id) {
      if (!confirm('Удалить это сообщение?')) return
      try {
        const token = localStorage.getItem('token')
        const url = `${this.API_URL}/feedback/${id}`
        const res = await fetch(url, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        })

        if (!res.ok) {
          if (res.status === 403) throw new Error('Нет прав для удаления')
          const errorData = await res.json().catch(() => ({}))
          throw new Error(errorData.message || `HTTP ${res.status}`)
        }
        this.fetchData(this.page)
      } catch (e) {
        console.error('Ошибка удаления:', e)
        alert('Не удалось удалить: ' + e.message)
      }
    },

    showModal(item) {
      this.selected = item
      if (!item.is_read) this.markRead(item.id)
    },

    goPage(p) {
      if (p >= 1 && p <= this.pagination.last_page) this.fetchData(p)
    },

    truncate(t, n) {
      return t?.length > n ? t.slice(0, n) + '...' : t
    },

    formatDate(d) {
      if (!d) return ''
      try {
        return new Date(d).toLocaleString('ru-RU')
      } catch {
        return d
      }
    }
  }
}
</script>

<style scoped>
.admin-feedback { max-width: 1400px; margin: 0 auto; padding: 30px 20px; }
.filters { display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
.search-input { flex: 1; min-width: 200px; padding: 10px; border: 2px solid #FCD34D; border-radius: 8px; }
.filter-select { padding: 10px; border: 2px solid #FCD34D; border-radius: 8px; background: white; }
.btn-refresh { padding: 10px 16px; background: #D97706; color: white; border: none; border-radius: 8px; cursor: pointer; }
.loading, .empty { text-align: center; padding: 40px; color: #92400E; }
.table-wrapper { overflow-x: auto; }
.feedback-table { width: 100%; border-collapse: collapse; background: #FFFBEB; border-radius: 12px; overflow: hidden; }
.feedback-table th, .feedback-table td { padding: 12px; text-align: left; border-bottom: 1px solid #FCD34D; }
.feedback-table th { background: #FEF3C7; color: #78350F; font-weight: 600; }
.feedback-table tr.unread { background: #FFF7ED; font-weight: 500; }
.msg-cell { max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #92400E; }
.badge { padding: 4px 10px; border-radius: 20px; font-size: 0.85rem; font-weight: 500; }
.badge.new { background: #FEE2E2; color: #B91C1C; }
.badge.read { background: #D1FAE5; color: #065F46; }
.actions { display: flex; gap: 6px; }
.btn-small { padding: 6px 10px; border: none; border-radius: 6px; cursor: pointer; font-size: 0.9rem; }
.btn-read { background: #D1FAE5; color: #065F46; }
.btn-view { background: #BFDBFE; color: #1E40AF; }
.btn-delete { background: #FEE2E2; color: #B91C1C; }
.pagination { display: flex; justify-content: center; gap: 15px; margin-top: 20px; align-items: center; }
.btn-page { padding: 8px 16px; background: #D97706; color: white; border: none; border-radius: 6px; cursor: pointer; }
.btn-page:disabled { opacity: 0.5; cursor: not-allowed; }
/* Модальное окно */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
.modal { background: #FFFBEB; border: 3px solid #FCD34D; border-radius: 16px; padding: 25px; max-width: 550px; width: 100%; max-height: 90vh; overflow-y: auto; }
.modal h3 { color: #78350F; margin-bottom: 15px; }
.modal p { color: #92400E; margin: 8px 0; }
.modal hr { margin: 15px 0; border: none; border-top: 1px solid #FCD34D; }
.full-msg { white-space: pre-wrap; word-break: break-word; color: #78350F; }
.modal-actions { display: flex; gap: 12px; margin-top: 20px; flex-wrap: wrap; }
.modal-actions .btn { flex: 1; min-width: 140px; padding: 12px; border: none; border-radius: 10px; cursor: pointer; font-weight: 600; text-align: center; }
.modal-actions .btn { background: #F3F4F6; color: #374151; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; }
.modal-actions .btn-primary { background: #D97706; color: white; }
</style>