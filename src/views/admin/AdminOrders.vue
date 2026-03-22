<template>
  <div class="admin-section">
    <h1>Управление заказами</h1>
    
    <div v-if="loading" class="loading">Загрузка...</div>
    
    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
      <button @click="loadOrders" class="btn-retry">Попробовать снова</button>
    </div>
    
    <div v-else-if="orders.length === 0" class="empty">
      <p>Нет заказов</p>
    </div>
    
    <div v-else class="orders-list">
      <div v-for="order in orders" :key="order.id" class="order-card">
        <div class="order-header">
          <h3>Заказ #{{ order.id }}</h3>
          <select 
            v-model="order.status" 
            @change="updateStatus(order)" 
            class="status-select"
            :disabled="updatingOrder === order.id"
          >
            <option value="new">Новый</option>
            <option value="preparing">Готовится</option>
            <option value="ready">Готов</option>
            <option value="delivered">Доставлен</option>
            <option value="cancelled">Отменён</option>
          </select>
        </div>
        <p class="customer">Клиент: {{ order.user?.name || order.customer_name || 'Клиент' }}</p>
        <p class="restaurant">Ресторан: {{ order.restaurant?.name }}</p>
        <div v-for="item in order.items" :key="item.id" class="order-item">
          {{ item.menu?.name || item.name }} × {{ item.quantity }} — {{ (item.price_at_time || item.price) * item.quantity }} ₽
        </div>
        <p class="total">Итого: {{ order.total_price }} ₽</p>
        <p class="delivery">
          {{ order.delivery_type === 'delivery' ? 'Доставка: ' + order.delivery_address : 'Самовывоз' }}
        </p>
        <p class="date">{{ formatDate(order.created_at) }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminOrders',
  data() {
    return {
      orders: [],
      loading: false,
      error: null,
      updatingOrder: null,
      API_URL: import.meta.env.VITE_API_URL || '/api'
    }
  },
  created() {
    this.loadOrders()
  },
  methods: {
    async loadOrders() {
      this.loading = true
      this.error = null

      try {
        const token = localStorage.getItem('token')
        const url = `${this.API_URL}/orders`

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
        this.orders = Array.isArray(data?.data) ? data.data :
          Array.isArray(data) ? data : []
      } catch (e) {
        console.error('Ошибка загрузки заказов:', e)
        if (e.message.includes('Failed to fetch')) {
          this.error = 'Не удалось соединиться с сервером. Проверьте интернет и настройки CORS.'
        } else {
          this.error = e.message || 'Ошибка при загрузке заказов'
        }
      } finally {
        this.loading = false
      }
    },

    async updateStatus(order) {
      const originalStatus = order.status

      try {
        const token = localStorage.getItem('token')
        this.updatingOrder = order.id

        const url = `${this.API_URL}/orders/${order.id}`
        const res = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ status: order.status })
        })

        if (!res.ok) {
          if (res.status === 401) throw new Error('Требуется авторизация')
          if (res.status === 403) throw new Error('Нет прав для изменения заказа')
          if (res.status === 422) {
            const errorData = await res.json().catch(() => ({}))
            const firstError = Object.values(errorData.errors || {})[0]?.[0]
            throw new Error(firstError || 'Ошибка валидации')
          }
          const errorData = await res.json().catch(() => ({}))
          throw new Error(errorData.message || `HTTP ${res.status}`)
        }

        const data = await res.json()
        if (data?.data) {
          const index = this.orders.findIndex(o => o.id === order.id)
          if (index !== -1) {
            this.orders[index] = { ...this.orders[index], ...data.data }
          }
        }
        alert('Статус обновлён!')
      } catch (e) {
        console.error('Ошибка обновления статуса:', e)
        order.status = originalStatus
        if (e.message.includes('Failed to fetch')) {
          alert('Не удалось соединиться с сервером. Проверьте интернет и настройки CORS.')
        } else {
          alert('Ошибка: ' + e.message)
        }
      } finally {
        this.updatingOrder = null
      }
    },

    formatDate(dateString) {
      if (!dateString) return ''
      try {
        return new Date(dateString).toLocaleString('ru-RU', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      } catch {
        return dateString
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

.admin-section h1 {
  color: #78350F;
  font-size: 2rem;
  margin-bottom: 30px;
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

.orders-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 30px;
}

.order-card {
  background: #FFFBEB;
  border: 2px solid #FCD34D;
  border-radius: 15px;
  padding: 25px;
  transition: all 0.3s ease;
}

.order-card:hover {
  box-shadow: 0 8px 25px rgba(245, 158, 11, 0.15);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #FCD34D;
}

.order-header h3 {
  color: #78350F;
  margin: 0;
  font-size: 1.3rem;
}

.status-select {
  padding: 8px 16px;
  background: #FFFBEB;
  border: 2px solid #FCD34D;
  border-radius: 10px;
  color: #78350F;
  font-weight: 600;
  cursor: pointer;
}

.status-select:focus {
  outline: none;
  border-color: #D97706;
}

.status-select:disabled {
  opacity: 0.6;
  cursor: wait;
}

.order-card p {
  color: #92400E;
  margin: 8px 0;
  font-size: 0.95rem;
}

.order-card .customer,
.order-card .restaurant {
  font-weight: 600;
  color: #78350F;
}

.order-item {
  padding: 8px 0;
  color: #92400E;
  border-bottom: 1px solid #FCD34D;
  font-size: 0.95rem;
}

.order-item:last-child {
  border-bottom: none;
}

.total {
  color: #D97706;
  font-weight: 700;
  font-size: 1.3rem;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 2px solid #FCD34D;
}

.delivery {
  color: #92400E;
  font-size: 0.95rem;
  margin-top: 10px;
  padding: 10px 12px;
  background: #FFFBEB;
  border: 1px solid #FCD34D;
  border-radius: 8px;
}

.date {
  color: #9CA3AF;
  font-size: 0.85rem;
  margin-top: 10px;
}

@media (max-width: 768px) {
  .orders-list {
    grid-template-columns: 1fr;
  }
  
  .order-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
}
</style>