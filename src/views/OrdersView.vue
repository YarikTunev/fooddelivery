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
      API_URL: 'https://fooddelivery.s99220rx.beget.tech/api'
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
.orders {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
}

.orders h1 {
  color: #78350F;
  text-align: center;
  margin-bottom: 40px;
  font-size: 2.2rem;
}

.auth-warning,
.loading,
.empty,
.error-message {
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

.btn {
  display: inline-block;
  padding: 12px 30px;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
  border: none;
  cursor: pointer;
  margin-top: 20px;
  text-align: center;
}

.btn-primary {
  background: #D97706;
  color: #ffffff;
}

.btn-primary:hover {
  background: #B45309;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
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

.status {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.status.new {
  background: #FEF3C7;
  color: #D97706;
  border: 2px solid #D97706;
}

.status.preparing {
  background: #E0F2FE;
  color: #0284C7;
  border: 2px solid #0284C7;
}

.status.ready {
  background: #DCFCE7;
  color: #16A34A;
  border: 2px solid #16A34A;
}

.status.delivered {
  background: #DBEAFE;
  color: #2563EB;
  border: 2px solid #2563EB;
}

.status.cancelled {
  background: #FEE2E2;
  color: #DC2626;
  border: 2px solid #DC2626;
}

.order-items {
  margin-bottom: 20px;
}

.order-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  color: #92400E;
  border-bottom: 1px solid #FCD34D;
}

.order-item:last-child {
  border-bottom: none;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 2px solid #FCD34D;
}

.order-total {
  color: #92400E;
  font-size: 1.1rem;
}

.order-total strong {
  color: #D97706;
  font-size: 1.4rem;
  margin-left: 10px;
}

.order-date {
  color: #B45309;
  font-size: 0.95rem;
  margin: 0;
}

.delivery-info {
  margin-top: 15px;
  padding: 12px 15px;
  background: #FFFBEB;
  border: 1px solid #FCD34D;
  border-radius: 8px;
  color: #92400E;
  font-size: 0.95rem;
}

@media (max-width: 768px) {
  .order-header,
  .order-footer {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
}
</style>