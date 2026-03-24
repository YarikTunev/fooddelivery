<template>
  <div class="restaurant">
    <router-link to="/" class="back-link">← Назад к ресторанам</router-link>
    <h1 v-if="restaurant">{{ restaurant.name }}</h1>
    
    <div v-if="loading" class="loading">Загрузка меню...</div>
    <div v-else class="menu-grid">
      <div v-for="item in menu" :key="item.id" class="dish-card">
        <img v-if="item.image" :src="item.image" :alt="item.name" :title="item.name">
        <h3>{{ item.name }}</h3>
        <p class="desc">{{ item.description }}</p>
        <p class="price">{{ item.price }} ₽</p>

        <div v-if="getItemInCart(item)" class="quantity-controls">
          <button @click="updateQuantity(item, -1)" class="btn btn-quantity btn-minus">−</button>
          <span class="quantity">{{ getItemInCart(item).quantity }}</span>
          <button @click="updateQuantity(item, +1)" class="btn btn-quantity btn-plus">+</button>
          <button @click="removeFromCart(item)" class="btn btn-remove">Удалить</button>
        </div>
        <button v-else @click="addToCart(item)" class="btn btn-primary">В корзину</button>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="modal-icon">✓</div>
        <h3>Товар добавлен!</h3>
        <p>"{{ modalItem?.name }}" добавлен в корзину</p>
        <div class="modal-actions">
          <button @click="closeModal" class="btn btn-secondary">Продолжить выбор</button>
          <router-link to="/cart" class="btn btn-primary" @click.native="closeModal">Перейти в корзину</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RestaurantView',
  data() {
    return {
      restaurant: null,
      menu: [],
      loading: false,
      showModal: false,
      modalItem: null,
      API_BASE: '/api/'
    }
  },
  created() {
    this.loadRestaurant()
    this.loadMenu()
  },
  methods: {
    async loadRestaurant() {
      try {
        const url = `${this.API_BASE}restaurants/${this.$route.params.id}`
        const res = await fetch(url)

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`)
        }

        const data = await res.json()
        this.restaurant = data.data || data
      } catch (e) {
        console.error('Ошибка загрузки ресторана:', e)
        this.restaurant = null
      }
    },

    async loadMenu() {
      this.loading = true
      try {
        const url = `${this.API_BASE}menu/restaurant/${this.$route.params.id}`
        const res = await fetch(url)

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`)
        }

        const data = await res.json()
        this.menu = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
            ? data
            : []
      } catch (e) {
        console.error('Ошибка загрузки меню:', e)
        this.menu = []
      } finally {
        this.loading = false
      }
    },

    getItemInCart(item) {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      return cart.find(i => i.id === item.id)
    },

    addToCart(item) {
      let cart = JSON.parse(localStorage.getItem('cart') || '[]')

      if (cart.length > 0 && cart[0].restaurant_id !== item.restaurant_id) {
        if (!confirm('Корзина будет очищена, так как выбрано блюдо из другого ресторана')) return
        cart = []
      }

      const existing = cart.find(i => i.id === item.id)
      if (existing) {
        existing.quantity++
      } else {
        cart.push({ ...item, quantity: 1, restaurant_id: item.restaurant_id })
      }

      localStorage.setItem('cart', JSON.stringify(cart))
      this.modalItem = item
      this.showModal = true
    },

    updateQuantity(item, change) {
      let cart = JSON.parse(localStorage.getItem('cart') || '[]')
      const existing = cart.find(i => i.id === item.id)

      if (existing) {
        existing.quantity += change
        if (existing.quantity <= 0) {
          cart = cart.filter(i => i.id !== item.id)
        }
        localStorage.setItem('cart', JSON.stringify(cart))
        this.$forceUpdate()
      }
    },

    removeFromCart(item) {
      let cart = JSON.parse(localStorage.getItem('cart') || '[]')
      cart = cart.filter(i => i.id !== item.id)
      localStorage.setItem('cart', JSON.stringify(cart))
      this.$forceUpdate()
    },

    closeModal() {
      this.showModal = false
      this.modalItem = null
    }
  }
}
</script>


<style scoped>
.dish-card,.loading,.modal{text-align:center}.restaurant{max-width:1400px;margin:0 auto;padding:40px 20px;position:relative}.back-link{color:#92400e;text-decoration:none;font-size:1rem;margin-bottom:20px;display:inline-block;transition:color .3s}.back-link:hover{color:#d97706}.loading{color:#92400e;font-size:1.3rem;padding:60px}.menu-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:30px}.dish-card{background:#fffbeb;border:2px solid #fcd34d;border-radius:15px;padding:25px;transition:.3s;display:flex;flex-direction:column;align-items:center;justify-content:space-between}.dish-card:hover{transform:translateY(-5px);box-shadow:0 8px 25px rgba(245,158,11,.15)}.dish-card img{width:100%;height:180px;object-fit:cover;border-radius:12px;margin-bottom:15px}.dish-card h3{color:#78350f;margin-bottom:10px;font-size:1.3rem}.dish-card .desc{color:#92400e;font-size:.95rem;margin-bottom:12px;min-height:40px}.dish-card .price{color:#d97706;font-weight:700;font-size:1.4rem;margin-bottom:15px}.btn{padding:12px 24px;border-radius:10px;font-weight:600;transition:.3s;border:none;cursor:pointer;font-size:.95rem}.btn-primary{background:#d97706;color:#fff;width:100%}.btn-primary:hover{background:#b45309}.btn-secondary{background:#f3f4f6;color:#374151}.btn-secondary:hover{background:#e5e7eb}.quantity-controls{display:flex;align-items:center;gap:10px;width:100%;justify-content:center;flex-wrap:wrap}.btn-quantity,.modal-overlay{align-items:center;display:flex}.btn-quantity{width:40px;height:40px;padding:0;justify-content:center;font-size:1.5rem;background:#fef3c7;color:#92400e;border:2px solid #fcd34d}.modal,.modal-actions .btn{width:100%}.btn-quantity:hover{background:#fde68a}.btn-minus:hover,.btn-plus:hover{color:#b45309}.quantity{font-size:1.2rem;font-weight:700;color:#78350f;min-width:30px}.btn-remove{background:#fee2e2;color:#b91c1c;padding:8px 16px;font-size:.85rem}.btn-remove:hover{background:#fecaca}.modal-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.5);justify-content:center;z-index:1000;padding:20px;animation:.2s fadeIn}.modal{background:#fffbeb;border:3px solid #fcd34d;border-radius:20px;padding:30px;max-width:400px;box-shadow:0 20px 60px rgba(0,0,0,.3);animation:.3s slideUp}.modal-icon{width:70px;height:70px;background:#10b981;color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:700;margin:0 auto 20px}.modal h3{color:#78350f;margin-bottom:10px;font-size:1.5rem}.modal p{color:#92400e;margin-bottom:25px;font-size:1rem}.modal-actions{display:flex;flex-direction:column;gap:12px}@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}@media (max-width:768px){.menu-grid{grid-template-columns:1fr}.quantity-controls{flex-direction:column}.btn-remove{width:100%}}
</style>
