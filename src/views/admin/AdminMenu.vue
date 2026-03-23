<template>
  <div class="admin-section">
    <div class="section-header">
      <h1>Управление меню</h1>
      <button @click="showAddForm = true" class="btn btn-primary">+ Добавить блюдо</button>
    </div>

    <div v-if="showAddForm || editingItem" class="form-modal">
      <h3>{{ editingItem ? 'Редактировать' : 'Добавить' }} блюдо</h3>
      <form @submit.prevent="saveItem">
        <div class="form-group">
          <label>Ресторан *</label>
          <select v-model="formData.restaurant_id" required>
            <option value="">Выберите ресторан</option>
            <option v-for="r in restaurants" :key="r.id" :value="r.id">{{ r.name }}</option>
          </select>
        </div>
        <div class="form-group">
          <label>Название *</label>
          <input v-model="formData.name" type="text" required>
        </div>
        <div class="form-group">
          <label>Описание</label>
          <textarea v-model="formData.description" rows="3"></textarea>
        </div>
        <div class="form-group">
          <label>Цена *</label>
          <input v-model.number="formData.price" type="number" step="0.01" min="0" required>
        </div>
        <div class="form-group">
          <label>Изображение (URL)</label>
          <input v-model="formData.image" type="text" placeholder="https://...">
        </div>
        <div class="form-group">
          <label>
            <input v-model="formData.is_active" type="checkbox"> Активно
          </label>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-save">Сохранить</button>
          <button @click="cancelEdit" type="button" class="btn btn-cancel">✕ Отмена</button>
        </div>
      </form>
    </div>

    <div v-else class="items-grid">
      <div v-for="item in items" :key="item.id" class="item-card">
        <img v-if="item.image" :src="item.image" :alt="item.name">
        <h3>{{ item.name }}</h3>
        <p>{{ item.description }}</p>
        <p class="price">{{ item.price }} ₽</p>
        <p class="restaurant">Ресторан: {{ item.restaurant?.name }}</p>
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
  name: 'AdminMenu',
  data() {
    return {
      items: [],
      restaurants: [],
      showAddForm: false,
      editingItem: null,
      formData: {
        restaurant_id: '',
        name: '',
        description: '',
        price: 0,
        image: '',
        is_active: true
      },
      API_URL: 'https://fooddelivery.s99220rx.beget.tech/api'
    }
  },
  created() {
    this.loadItems()
    this.loadRestaurants()
  },
  methods: {
    async loadItems() {
      try {
        const token = localStorage.getItem('token')
        const url = `${this.API_URL}/menu`

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
        this.items = data.data || data || []
      } catch (e) {
        console.error('Ошибка загрузки меню:', e)
        if (e.message.includes('Failed to fetch')) {
          alert('Не удалось соединиться с сервером. Проверьте интернет и настройки CORS.')
        } else {
          alert('Ошибка: ' + e.message)
        }
      }
    },

    async loadRestaurants() {
      try {
        const url = `${this.API_URL}/restaurants`
        const res = await fetch(url, { headers: { 'Accept': 'application/json' } })

        if (!res.ok) return

        const data = await res.json()
        this.restaurants = Array.isArray(data?.data) ? data.data :
          Array.isArray(data) ? data : []
      } catch (e) {
        console.error('Ошибка загрузки ресторанов:', e)
        this.restaurants = []
      }
    },

    async saveItem() {
      try {
        const token = localStorage.getItem('token')
        const isEdit = !!this.editingItem
        const url = isEdit ? `${this.API_URL}/menu/${this.editingItem.id}` : `${this.API_URL}/menu`
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
        restaurant_id: '',
        name: '',
        description: '',
        price: 0,
        image: '',
        is_active: true
      }
    },

    async deleteItem(item) {
      if (!confirm(`Удалить блюдо "${item.name}"?`)) return
      try {
        const token = localStorage.getItem('token')
        const url = `${this.API_URL}/menu/${item.id}`
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
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 14px 16px;
  background: #FFFBEB;
  border: 2px solid #FCD34D;
  border-radius: 10px;
  color: #78350F;
  font-size: 1rem;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #D97706;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
}

.item-card {
  background: #FFFBEB;
  border: 2px solid #FCD34D;
  border-radius: 15px;
  padding: 25px;
  text-align: center;
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

.item-card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 15px;
}

.item-card h3 {
  color: #78350F;
  margin-bottom: 10px;
  font-size: 1.3rem;
}

.item-card p {
  color: #92400E;
  margin-bottom: 8px;
}

.item-card .price {
  color: #D97706;
  font-weight: 700;
  font-size: 1.4rem;
  margin-bottom: 10px;
}

.item-card .restaurant {
  color: #B45309;
  font-size: 0.95rem;
  margin-bottom: 15px;
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