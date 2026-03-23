<template>
  <div class="cart">
    <h1>Корзина</h1>
    
    <div v-if="cart.length === 0" class="empty">
      <div class="empty-icon">🛒</div>
      <p class="empty-text">Корзина пуста</p>
      <p class="empty-subtext">Добавьте блюда из меню, чтобы оформить заказ</p>
      <router-link to="/" class="btn btn-primary">Перейти в меню</router-link>
    </div>
    
    <div v-else>
      <div v-for="(item, idx) in cart" :key="idx" class="cart-item">
        <div class="item-info">
          <h3>{{ item.name }}</h3>
          <p class="item-price">{{ item.price }} ₽</p>
        </div>
        
        <div class="qty-control">
          <button @click="updateQty(idx, -1)" class="btn-qty">−</button>
          <span class="qty-value">{{ item.quantity }}</span>
          <button @click="updateQty(idx, 1)" class="btn-qty">+</button>
        </div>
        
        <div class="item-total">
          {{ item.price * item.quantity }} ₽
        </div>
        
        <button @click="removeItem(idx)" class="btn-delete" title="Удалить">✕</button>
      </div>
      
      <div class="checkout-form">
        <h2>Оформление заказа</h2>
        
        <div class="form-group">
          <label for="address">Адрес доставки *</label>
          <input 
            id="address"
            v-model="address" 
            type="text" 
            placeholder="Улица, дом, квартира"
            required
          >
        </div>
        
        <div class="form-group">
          <label for="phone">Телефон *</label>
          <input 
            id="phone"
            v-model="phone" 
            type="tel" 
            placeholder="+7 (___) ___-__-__"
            required
          >
        </div>
        
        <div class="order-summary">
          <div class="summary-row">
            <span>Стоимость товаров:</span>
            <span>{{ itemsTotal }} ₽</span>
          </div>
          <div class="summary-row">
            <span>Доставка:</span>
            <span>{{ deliveryPrice }} ₽</span>
          </div>
          <div class="summary-row total">
            <span>Итого:</span>
            <strong>{{ total }} ₽</strong>
          </div>
        </div>
        
        <button @click="checkout" class="btn btn-primary btn-checkout" :disabled="loading || !address || !phone">
          {{ loading ? 'Оформление...' : 'Заказать' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CartView',
  data() {
    return {
      cart: [],
      address: '',
      phone: '',
      loading: false,
      deliveryPrice: 300,
      API_URL: '/api'
    }
  },
  computed: {
    itemsTotal() {
      return this.cart.reduce((acc, i) => acc + (i.price * i.quantity), 0)
    },
    total() {
      return this.itemsTotal + this.deliveryPrice
    }
  },
  created() {
    this.cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    if (user) {
      this.phone = user.phone || ''
      this.address = user.address || ''
    }
  },
  methods: {
    updateQty(idx, change) {
      this.cart[idx].quantity += change
      if (this.cart[idx].quantity <= 0) {
        this.cart.splice(idx, 1)
      }
      localStorage.setItem('cart', JSON.stringify(this.cart))
    },

    removeItem(idx) {
      this.cart.splice(idx, 1)
      localStorage.setItem('cart', JSON.stringify(this.cart))
    },

    async checkout() {
      if (!this.address.trim()) {
        alert('Введите адрес доставки')
        return
      }

      if (!this.phone.trim()) {
        alert('Введите номер телефона')
        return
      }

      this.loading = true

      try {
        const token = localStorage.getItem('token')
        const user = JSON.parse(localStorage.getItem('user'))

        if (!token || !user) {
          alert('Вы не авторизованы. Пожалуйста, войдите в систему.')
          this.$router.push('/login')
          return
        }

        const restaurantId = this.cart[0]?.restaurant_id
        if (!restaurantId) {
          alert('Ошибка: не указан ресторан')
          return
        }

        const items = this.cart.map(i => ({
          menu_id: i.id,
          quantity: i.quantity
        }))

        const url = `${this.API_URL}/orders`
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            restaurant_id: restaurantId,
            items: items,
            delivery_type: 'delivery',
            delivery_address: this.address.trim(),
            phone: this.phone.trim()
          })
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          if (response.status === 401) {
            throw new Error('Требуется авторизация. Пожалуйста, войдите снова.')
          }
          if (response.status === 422) {
            const firstError = Object.values(errorData.errors || {})[0]?.[0]
            throw new Error(firstError || 'Ошибка валидации данных')
          }
          throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        localStorage.removeItem('cart')
        this.cart = []

        const orderId = data.data?.id || data.id
        alert(`Заказ успешно оформлен!\n\nНомер заказа: #${orderId}`)
        this.$router.push('/orders')
      } catch (error) {
        console.error('Ошибка оформления заказа:', error)
        if (error.message.includes('Failed to fetch')) {
          alert('Не удалось соединиться с сервером. Проверьте интернет и настройки CORS.')
        } else {
          alert('Ошибка: ' + error.message)
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>


<style scoped>
.cart {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
  min-height: 60vh;
}

.cart h1 {
  color: #78350F;
  text-align: center;
  margin-bottom: 40px;
  font-size: 2.2rem;
}

.empty {
  text-align: center;
  padding: 80px 20px;
  background: #FFFBEB;
  border: 2px solid #FCD34D;
  border-radius: 15px;
  max-width: 500px;
  margin: 0 auto;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.empty-text {
  color: #78350F;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 10px;
}

.empty-subtext {
  color: #92400E;
  font-size: 1rem;
  margin-bottom: 30px;
}

.empty .btn {
  display: inline-block;
  padding: 14px 35px;
  background: #D97706;
  color: #ffffff;
  text-decoration: none;
  border-radius: 10px;
  font-weight: 600;
  transition: all 0.3s;
}

.empty .btn:hover {
  background: #B45309;
  transform: translateY(-2px);
}

.cart-item {
  display: grid;
  grid-template-columns: 1fr auto auto auto;
  gap: 20px;
  align-items: center;
  background: #FFFBEB;
  padding: 20px 25px;
  margin-bottom: 15px;
  border-radius: 12px;
  border: 2px solid #FCD34D;
  transition: all 0.3s;
}

.cart-item:hover {
  box-shadow: 0 6px 20px rgba(245, 158, 11, 0.15);
}

.item-info h3 {
  color: #78350F;
  margin: 0 0 8px 0;
  font-size: 1.2rem;
}

.item-info p {
  color: #92400E;
  margin: 0;
}

.qty-control {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-qty {
  width: 36px;
  height: 36px;
  background: #D97706;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 1.3rem;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-qty:hover {
  background: #B45309;
}

.qty-value {
  color: #78350F;
  font-weight: 700;
  font-size: 1.2rem;
  min-width: 30px;
  text-align: center;
}

.item-total {
  color: #D97706;
  font-weight: 700;
  font-size: 1.2rem;
}

.btn-delete {
  background: #DC2626;
  color: #ffffff;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.2rem;
  transition: background 0.3s;
}

.btn-delete:hover {
  background: #B91C1C;
}

.checkout-form {
  background: #FFFBEB;
  padding: 35px;
  border-radius: 15px;
  border: 2px solid #FCD34D;
  margin-top: 30px;
}

.checkout-form h2 {
  color: #78350F;
  font-size: 1.5rem;
  margin-bottom: 25px;
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

.form-group input {
  width: 100%;
  padding: 14px 16px;
  background: #FFFBEB;
  border: 2px solid #FCD34D;
  border-radius: 10px;
  color: #78350F;
  font-size: 1rem;
}

.form-group input:focus {
  outline: none;
  border-color: #D97706;
}

.order-summary {
  background: #FFFBEB;
  padding: 25px;
  border-radius: 12px;
  margin: 25px 0;
  border: 2px solid #FCD34D;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  color: #92400E;
  font-size: 1rem;
}

.summary-row.total {
  border-top: 2px solid #FCD34D;
  margin-top: 10px;
  padding-top: 15px;
  font-size: 1.3rem;
  color: #78350F;
}

.summary-row.total strong {
  color: #D97706;
  font-size: 1.5rem;
}

.btn {
  padding: 14px 30px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: #D97706;
  color: #ffffff;
}

.btn-primary:hover:not(:disabled) {
  background: #B45309;
  transform: translateY(-2px);
}

.btn-checkout {
  width: 100%;
  padding: 18px;
  font-size: 1.2rem;
  margin-top: 10px;
}

.btn-checkout:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

@media (max-width: 768px) {
  .cart-item {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .qty-control {
    justify-content: center;
  }
  
  .item-total {
    text-align: center;
  }
  
  .btn-delete {
    margin: 0 auto;
  }
}
</style>