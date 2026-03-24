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
      API_URL: '/api'
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
.order-card .customer,.order-card .restaurant,.status-select{font-weight:600;color:#78350f}.admin-section{max-width:1400px;margin:0 auto}.admin-section h1{color:#78350f;font-size:2rem;margin-bottom:30px}.empty,.error-message,.loading{text-align:center;color:#92400e;font-size:1.3rem;padding:60px;background:#fffbeb;border:2px solid #fcd34d;border-radius:15px}.error-message{background:#fef2f2;border-color:#fca5a5;color:#dc2626}.btn-retry{margin-top:20px;padding:10px 25px;background:#d97706;color:#fff;border:none;border-radius:8px;cursor:pointer;font-weight:600}.delivery,.order-card,.status-select{background:#fffbeb}.btn-retry:hover{background:#b45309}.orders-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(400px,1fr));gap:30px}.order-card{border:2px solid #fcd34d;border-radius:15px;padding:25px;transition:.3s}.order-card:hover{box-shadow:0 8px 25px rgba(245,158,11,.15)}.order-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;padding-bottom:15px;border-bottom:2px solid #fcd34d}.order-header h3{color:#78350f;margin:0;font-size:1.3rem}.status-select{padding:8px 16px;border:2px solid #fcd34d;border-radius:10px;cursor:pointer}.order-card p,.order-item{color:#92400e;font-size:.95rem}.status-select:focus{outline:0;border-color:#d97706}.status-select:disabled{opacity:.6;cursor:wait}.order-card p{margin:8px 0}.order-item{padding:8px 0;border-bottom:1px solid #fcd34d}.order-item:last-child{border-bottom:none}.total{color:#d97706;font-weight:700;font-size:1.3rem;margin-top:15px;padding-top:15px;border-top:2px solid #fcd34d}.date,.delivery{margin-top:10px}.delivery{color:#92400e;font-size:.95rem;padding:10px 12px;border:1px solid #fcd34d;border-radius:8px}.date{color:#9ca3af;font-size:.85rem}@media (max-width:768px){.orders-list{grid-template-columns:1fr}.order-header{flex-direction:column;gap:12px;align-items:flex-start}}
</style>