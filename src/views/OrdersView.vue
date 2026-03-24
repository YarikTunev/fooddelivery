<template>
  <div class="orders">
    <h1>Мои заказы</h1>
    
    <div v-if="!isAuthenticated" class="auth-warning">
      <p>Пожалуйста, войдите в аккаунт, чтобы просмотреть заказы</p>
      <router-link to="/login" class="btn btn-primary">Войти</router-link>
    </div>
    
    <div v-else-if="loading" class="loading">Загрузка...</div>
    
    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
      <button @click="loadOrders" class="btn-retry">Попробовать снова</button>
    </div>
    
    <div v-else-if="orders.length === 0" class="empty">
      <p>У вас пока нет заказов</p>
      <router-link to="/" class="btn btn-primary">Перейти в меню</router-link>
    </div>
    
    <div v-else class="orders-list">
      <div v-for="order in orders" :key="order.id" class="order-card">
        <div class="order-header">
          <h3>Заказ #{{ order.id }}</h3>
          <span class="status" :class="getStatusClass(order.status)">
            {{ getStatusText(order.status) }}
          </span>
        </div>
        
        <div class="order-items">
          <div v-for="item in order.items" :key="item.id" class="order-item">
            <span>{{ item.menu?.name || item.name || 'Товар' }}</span>
            <span>x{{ item.quantity }}</span>
          </div>
        </div>
        
        <div class="order-footer">
          <p class="order-date">{{ formatDate(order.created_at) }}</p>
          <p class="order-total">Итого: <strong>{{ order.total_price }} ₽</strong></p>
        </div>
        
        <div v-if="order.delivery_address" class="delivery-info">
          {{ order.delivery_address }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrdersView',
  data() {
    return {
      orders: [],
      loading: false,
      error: null,
      API_URL: '/api'
    }
  },
  computed: {
    isAuthenticated() {
      return !!localStorage.getItem('token')
    }
  },
  created() {
    if (this.isAuthenticated) {
      this.loadOrders()
    }
  },
  methods: {
    async loadOrders() {
      this.loading = true
      this.error = null

      const token = localStorage.getItem('token')
      if (!token) {
        this.loading = false
        return
      }

      try {
        const url = `${this.API_URL}/orders`
        const res = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        })

        if (!res.ok) {
          if (res.status === 401) {
            throw new Error('Требуется авторизация. Пожалуйста, войдите снова.')
          } else if (res.status === 404) {
            throw new Error('Эндпоинт заказов не найден на сервере.')
          } else {
            const errorText = await res.text().catch(() => '')
            throw new Error(`HTTP ${res.status}: ${errorText || res.statusText}`)
          }
        }

        const data = await res.json()
        this.orders = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
            ? data
            : []
      } catch (e) {
        console.error('Ошибка загрузки заказов:', e)

        if (e.message.includes('Failed to fetch')) {
          this.error = 'Не удалось соединиться с сервером. Проверьте интернет и настройки CORS.'
        } else {
          this.error = e.message || 'Произошла ошибка при загрузке заказов'
        }
      } finally {
        this.loading = false
      }
    },

    getStatusClass(status) {
      const map = {
        'new': 'new',
        'pending': 'new',
        'preparing': 'preparing',
        'ready': 'ready',
        'delivered': 'delivered',
        'completed': 'delivered',
        'cancelled': 'cancelled',
        'rejected': 'cancelled'
      }
      return map[status?.toLowerCase()] || 'new'
    },

    getStatusText(status) {
      const map = {
        'new': 'Новый',
        'pending': 'Обрабатывается',
        'preparing': 'Готовится',
        'ready': 'Готов',
        'delivered': 'Доставлен',
        'completed': 'Завершён',
        'cancelled': 'Отменён',
        'rejected': 'Отклонён'
      }
      return map[status?.toLowerCase()] || status || 'Неизвестно'
    },

    formatDate(dateString) {
      if (!dateString) return ''
      try {
        return new Date(dateString).toLocaleDateString('ru-RU', {
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
.btn,.orders h1{text-align:center}.orders{max-width:1000px;margin:0 auto;padding:40px 20px}.btn,.btn-retry{cursor:pointer;margin-top:20px;font-weight:600}.order-header,.order-items{margin-bottom:20px}.orders h1{color:#78350f;margin-bottom:40px;font-size:2.2rem}.auth-warning,.empty,.error-message,.loading{text-align:center;color:#92400e;font-size:1.3rem;padding:60px;background:#fffbeb;border:2px solid #fcd34d;border-radius:15px}.error-message{background:#fef2f2;border-color:#fca5a5;color:#dc2626}.btn-primary,.btn-retry{background:#d97706;color:#fff}.btn-retry{padding:10px 25px;border:none;border-radius:8px}.btn-primary:hover,.btn-retry:hover{background:#b45309}.btn{display:inline-block;padding:12px 30px;border-radius:10px;text-decoration:none;transition:.3s;border:none}.orders-list{display:flex;flex-direction:column;gap:20px}.order-header,.order-item{justify-content:space-between;display:flex}.order-card{background:#fffbeb;border:2px solid #fcd34d;border-radius:15px;padding:25px;transition:.3s}.order-card:hover{box-shadow:0 8px 25px rgba(245,158,11,.15)}.order-header{align-items:center;padding-bottom:15px;border-bottom:2px solid #fcd34d}.order-header h3{color:#78350f;margin:0;font-size:1.3rem}.status{padding:6px 16px;border-radius:20px;font-size:.9rem;font-weight:600}.status.new{background:#fef3c7;color:#d97706;border:2px solid #d97706}.status.preparing{background:#e0f2fe;color:#0284c7;border:2px solid #0284c7}.status.ready{background:#dcfce7;color:#16a34a;border:2px solid #16a34a}.status.delivered{background:#dbeafe;color:#2563eb;border:2px solid #2563eb}.status.cancelled{background:#fee2e2;color:#dc2626;border:2px solid #dc2626}.order-item{padding:10px 0;color:#92400e;border-bottom:1px solid #fcd34d}.order-item:last-child{border-bottom:none}.order-footer{display:flex;justify-content:space-between;align-items:center;padding-top:15px;border-top:2px solid #fcd34d}.order-total{color:#92400e;font-size:1.1rem}.order-total strong{color:#d97706;font-size:1.4rem;margin-left:10px}.order-date{color:#b45309;font-size:.95rem;margin:0}.delivery-info{margin-top:15px;padding:12px 15px;background:#fffbeb;border:1px solid #fcd34d;border-radius:8px;color:#92400e;font-size:.95rem}@media (max-width:768px){.order-footer,.order-header{flex-direction:column;gap:12px;align-items:flex-start}}
</style>