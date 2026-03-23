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
        <img v-if="item.image" :src="item.image" :alt="item.name">
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
      API_URL: 'http://fooddelivery.s99220rx.beget.tech/api'
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
.admin-section {
  max-width: 1400px;
  margin: 0 auto;
}

.section-header {
    display: flex;
    margin-bottom: 30px;
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
}

.section-header h1 {
  color: #78350F;
  font-size: 2rem;
  margin: 0;
}

.loading,
.error-message,
.empty {
  text-align: center;
  color: #92400E;
  font-size: 1.3rem;
  padding: 60px;
  background: #FFFBEB;
  border: 2px solid #FCD34D;
  border-radius: 15px;
}

.error-message {
  background: #FEF2F2;
  border-color: #FCA5A5;
  color: #DC2626;
}

.btn-retry {
  margin-top: 20px;
  padding: 10px 25px;
  background: #D97706;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.btn-retry:hover {
  background: #B45309;
}

.form-modal {
  background: #FFFBEB;
  border: 2px solid #FCD34D;
  border-radius: 15px;
  padding: 35px;
  max-width: 650px;
  margin: 0 auto 30px;
}

.form-modal h3 {
  color: #78350F;
  margin-bottom: 25px;
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
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 14px 16px;
  background: #FFFBEB;
  border: 2px solid #FCD34D;
  border-radius: 10px;
  color: #78350F;
  font-size: 1rem;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #D97706;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
}

.item-card {
  background: #FFFBEB;
  border: 2px solid #FCD34D;
  border-radius: 15px;
  padding: 25px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.item-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(245, 158, 11, 0.15);
}

.item-card.inactive {
  background: #FEF2F2;
  border-color: #FCA5A5;
}

.item-card h3 {
  color: #78350F;
  margin-bottom: 10px;
  font-size: 1.4rem;
}

.item-card p {
  color: #92400E;
  margin-bottom: 8px;
}

.item-card .address,
.item-card .phone {
  font-size: 0.95rem;
  color: #B45309;
}

.status {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 15px;
}

.status.active {
  background: #DCFCE7;
  color: #16A34A;
  border: 2px solid #16A34A;
}

.status.inactive {
  background: #FEE2E2;
  color: #DC2626;
  border: 2px solid #DC2626;
}

.item-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn {
  flex: 1;
  padding: 12px 20px;
  border-radius: 10px;
  font-weight: 600;
  transition: all 0.3s;
  border: none;
  cursor: pointer;
}

.btn-edit {
  background: #60A5FA;
  color: #ffffff;
}

.btn-edit:hover {
  background: #3B82F6;
}

.btn-delete {
  background: #DC2626;
  color: #ffffff;
}

.btn-delete:hover {
  background: #B91C1C;
}

.btn-save {
  flex: 1;
  padding: 14px 30px;
  background: #10B981;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 20px;
}

.btn-save:hover {
  background: #059669;
}

.btn-cancel {
  flex: 1;
  padding: 14px 30px;
  background: #6B7280;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 20px;
}

.btn-cancel:hover {
  background: #4B5563;
}

.btn-primary {
  background: #D97706;
  color: #ffffff;
  padding: 14px 30px;
  border-radius: 10px;
  font-weight: 600;
  transition: all 0.3s;
  border: none;
  cursor: pointer;
}

.btn-primary:hover {
  background: #B45309;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .items-grid {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    flex-direction: column;
    gap: 15px;
  }
}
</style>