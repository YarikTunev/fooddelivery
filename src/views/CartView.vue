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
.cart,.empty{margin:0 auto}.cart-item,.empty{background:#fffbeb}.cart h1,.empty,.qty-value{text-align:center}.cart{max-width:900px;padding:40px 20px;min-height:60vh}.cart h1{color:#78350f;margin-bottom:40px;font-size:2.2rem}.empty{padding:80px 20px;border:2px solid #fcd34d;border-radius:15px;max-width:500px}.empty-icon{font-size:4rem;margin-bottom:20px}.empty-text{color:#78350f;font-size:1.5rem;font-weight:600;margin-bottom:10px}.item-total,.qty-value{font-weight:700;font-size:1.2rem}.empty-subtext{color:#92400e;font-size:1rem;margin-bottom:30px}.empty .btn{display:inline-block;padding:14px 35px;background:#d97706;color:#fff;text-decoration:none;border-radius:10px;font-weight:600;transition:.3s}.btn-primary:hover:not(:disabled),.empty .btn:hover{background:#b45309;transform:translateY(-2px)}.cart-item{display:grid;grid-template-columns:1fr auto auto auto;gap:20px;align-items:center;padding:20px 25px;margin-bottom:15px;border-radius:12px;border:2px solid #fcd34d;transition:.3s}.btn-delete,.btn-qty{width:36px;height:36px;transition:background .3s;cursor:pointer}.cart-item:hover{box-shadow:0 6px 20px rgba(245,158,11,.15)}.item-info h3{color:#78350f;margin:0 0 8px;font-size:1.2rem}.item-info p{color:#92400e;margin:0}.qty-control{display:flex;align-items:center;gap:12px}.btn-qty{background:#d97706;color:#fff;border:none;border-radius:8px;font-size:1.3rem}.btn-qty:hover{background:#b45309}.qty-value{color:#78350f;min-width:30px}.item-total{color:#d97706}.btn-delete{background:#dc2626;color:#fff;border:none;border-radius:8px;font-size:1.2rem}.btn-delete:hover{background:#b91c1c}.checkout-form{background:#fffbeb;padding:35px;border-radius:15px;border:2px solid #fcd34d;margin-top:30px}.checkout-form h2{color:#78350f;font-size:1.5rem;margin-bottom:25px}.form-group{margin-bottom:20px}.form-group label{display:block;color:#92400e;margin-bottom:8px;font-weight:600}.form-group input{width:100%;padding:14px 16px;background:#fffbeb;border:2px solid #fcd34d;border-radius:10px;color:#78350f;font-size:1rem}.form-group input:focus{outline:0;border-color:#d97706}.order-summary{background:#fffbeb;padding:25px;border-radius:12px;margin:25px 0;border:2px solid #fcd34d}.summary-row{display:flex;justify-content:space-between;padding:10px 0;color:#92400e;font-size:1rem}.summary-row.total{border-top:2px solid #fcd34d;margin-top:10px;padding-top:15px;font-size:1.3rem;color:#78350f}.summary-row.total strong{color:#d97706;font-size:1.5rem}.btn{padding:14px 30px;border:none;border-radius:10px;font-weight:600;cursor:pointer;transition:.3s}.btn-primary{background:#d97706;color:#fff}.btn-checkout{width:100%;padding:18px;font-size:1.2rem;margin-top:10px}.btn-checkout:disabled{opacity:.6;cursor:not-allowed;transform:none}@media (max-width:768px){.cart-item,.item-total{text-align:center}.cart-item{grid-template-columns:1fr}.qty-control{justify-content:center}.btn-delete{margin:0 auto}}
</style>