<template>
  <div class="admin-section">
    <div class="section-header">
      <h1>Управление ресторанами</h1>
      <button @click="showAddForm = true" class="btn btn-primary">+ Добавить ресторан</button>
    </div>

    <div v-if="showAddForm || editingItem" class="form-modal">
      <h3>{{ editingItem ? 'Редактировать' : 'Добавить' }} ресторан</h3>
      <form @submit.prevent="saveItem">
        <div class="form-group">
          <label>Название *</label>
          <input v-model="formData.name" type="text" required>
        </div>
        <div class="form-group">
          <label>Описание</label>
          <textarea v-model="formData.description" rows="3"></textarea>
        </div>
        <div class="form-group">
          <label>Адрес *</label>
          <input v-model="formData.address" type="text" required>
        </div>
        <div class="form-group">
          <label>Телефон *</label>
          <input v-model="formData.phone" type="text" required>
        </div>
        <div class="form-group">
          <label>Изображение (URL)</label>
          <input v-model="formData.image" type="text" placeholder="https://...">
        </div>
        <div class="form-group">
          <label>
            <input v-model="formData.is_active" type="checkbox"> Активен
          </label>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-save">Сохранить</button>
          <button @click="cancelEdit" type="button" class="btn btn-cancel">✕ Отмена</button>
        </div>
      </form>
    </div>

    <div v-else-if="loading" class="loading">Загрузка...</div>
    
    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
      <button @click="loadItems" class="btn-retry">Попробовать снова</button>
    </div>
    
    <div v-else-if="items.length === 0" class="empty">
      <p>Нет ресторанов</p>
      <button @click="showAddForm = true" class="btn btn-primary">Добавить первый</button>
    </div>

    <div v-else class="items-grid">
      <div v-for="item in items" :key="item.id" class="item-card" :class="{ inactive: !item.is_active }">
        <img v-if="item.image" :src="item.image" :alt="item.name" :title="item.name">
        <h3>{{ item.name }}</h3>
        <p>{{ item.description }}</p>
        <p class="address">{{ item.address }}</p>
        <p class="phone">{{ item.phone }}</p>
        
        <!-- Статус -->
        <span :class="['status', item.is_active ? 'active' : 'inactive']">
          {{ item.is_active ? '✓ Активен' : '✗ Не активен' }}
        </span>
        
        <div class="item-actions">
          <button @click="editItem(item)" class="btn btn-edit">Редактировать</button>
          <button @click="deleteItem(item)" class="btn btn-delete">Удалить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminRestaurants',
  data() {
    return {
      items: [],
      showAddForm: false,
      editingItem: null,
      formData: {
        name: '',
        description: '',
        address: '',
        phone: '',
        image: '',
        is_active: true
      },
      loading: false,
      error: null,
      API_URL: '/api'
    }
  },
  created() {
    this.loadItems()
  },
  methods: {
    async loadItems() {
      this.loading = true
      this.error = null

      try {
        const token = localStorage.getItem('token')
        const url = `${this.API_URL}/restaurants`

        const res = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        })

        if (!res.ok) {
          if (res.status === 401) throw new Error('Требуется авторизация')
          if (res.status === 403) throw new Error('Доступ запрещён. Требуются права администратора')
          const errorData = await res.json().catch(() => ({}))
          throw new Error(errorData.message || `HTTP ${res.status}: ${res.statusText}`)
        }

        const data = await res.json()
        this.items = Array.isArray(data?.data) ? data.data :
          Array.isArray(data) ? data : []
      } catch (e) {
        console.error('Ошибка загрузки ресторанов:', e)
        if (e.message.includes('Failed to fetch')) {
          this.error = 'Не удалось соединиться с сервером. Проверьте интернет и настройки CORS.'
        } else {
          this.error = e.message || 'Ошибка при загрузке ресторанов'
        }
      } finally {
        this.loading = false
      }
    },

    async saveItem() {
      try {
        const token = localStorage.getItem('token')
        const isEdit = !!this.editingItem
        const url = isEdit
          ? `${this.API_URL}/restaurants/${this.editingItem.id}`
          : `${this.API_URL}/restaurants`
        const method = isEdit ? 'PUT' : 'POST'

        const res = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(this.formData)
        })

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          if (res.status === 401) throw new Error('Требуется авторизация')
          if (res.status === 403) throw new Error('Нет прав для изменения')
          if (res.status === 422) {
            const firstError = Object.values(errorData.errors || {})[0]?.[0]
            throw new Error(firstError || 'Ошибка валидации данных')
          }
          throw new Error(errorData.message || `HTTP ${res.status}: ${res.statusText}`)
        }

        await res.json()
        this.cancelEdit()
        this.loadItems()
        alert('Успешно сохранено!')
      } catch (e) {
        console.error('Ошибка сохранения:', e)
        if (e.message.includes('Failed to fetch')) {
          alert('Не удалось соединиться с сервером. Проверьте интернет и настройки CORS.')
        } else {
          alert('Ошибка: ' + e.message)
        }
      }
    },

    editItem(item) {
      this.editingItem = item
      this.formData = { ...item }
      this.showAddForm = true
    },

    cancelEdit() {
      this.showAddForm = false
      this.editingItem = null
      this.formData = {
        name: '',
        description: '',
        address: '',
        phone: '',
        image: '',
        is_active: true
      }
    },

    async deleteItem(item) {
      if (!confirm(`Удалить ресторан "${item.name}"?`)) return

      try {
        const token = localStorage.getItem('token')
        const url = `${this.API_URL}/restaurants/${item.id}`

        const res = await fetch(url, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        })

        if (!res.ok) {
          if (res.status === 401) throw new Error('Требуется авторизация')
          if (res.status === 403) throw new Error('Нет прав для удаления')
          const errorData = await res.json().catch(() => ({}))
          throw new Error(errorData.message || `HTTP ${res.status}`)
        }

        this.loadItems()
        alert('Удалено!')
      } catch (e) {
        console.error('Ошибка удаления:', e)
        if (e.message.includes('Failed to fetch')) {
          alert('Не удалось соединиться с сервером. Проверьте интернет и настройки CORS.')
        } else {
          alert('Ошибка при удалении: ' + e.message)
        }
      }
    }
  }
}
</script>


<style scoped>
.order-card .customer,.order-card .restaurant,.status-select{font-weight:600;color:#78350f}.admin-section{max-width:1400px;margin:0 auto}.admin-section h1{color:#78350f;font-size:2rem;margin-bottom:30px}.empty,.error-message,.loading{text-align:center;color:#92400e;font-size:1.3rem;padding:60px;background:#fffbeb;border:2px solid #fcd34d;border-radius:15px}.error-message{background:#fef2f2;border-color:#fca5a5;color:#dc2626}.btn-retry{margin-top:20px;padding:10px 25px;background:#d97706;color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:600}.delivery,.order-card,.status-select{background:#fffbeb}.btn-retry:hover{background:#b45309}.orders-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(400px,1fr));gap:30px}.order-card{border:2px solid #fcd34d;border-radius:15px;padding:25px;transition:.3s}.order-card:hover{box-shadow:0 8px 25px rgba(245,158,11,.15)}.order-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;padding-bottom:15px;border-bottom:2px solid #fcd34d}.order-header h3{color:#78350f;margin:0;font-size:1.3rem}.status-select{padding:8px 16px;border:2px solid #fcd34d;border-radius:10px;cursor:pointer}.order-card p,.order-item{color:#92400e;font-size:.95rem}.status-select:focus{outline:0;border-color:#d97706}.status-select:disabled{opacity:.6;cursor:wait}.order-card p{margin:8px 0}.order-item{padding:8px 0;border-bottom:1px solid #fcd34d}.order-item:last-child{border-bottom:none}.total{color:#d97706;font-weight:700;font-size:1.3rem;margin-top:15px;padding-top:15px;border-top:2px solid #fcd34d}.date,.delivery{margin-top:10px}.delivery{color:#92400e;font-size:.95rem;padding:10px 12px;border:1px solid #fcd34d;border-radius:8px}.date{color:#9ca3af;font-size:.85rem}@media (max-width:768px){.orders-list{grid-template-columns:1fr}.order-header{flex-direction:column;gap:12px;align-items:flex-start}}
</style>