<template>
  <div class="home">
    <h1>Выберите ресторан</h1>
    <p class="subtitle">Заказывайте еду из лучших ресторанов города</p>
    
    <div v-if="loading" class="loading">Загрузка...</div>
    
    <div v-else class="restaurants-grid">
      <div v-for="r in restaurants" :key="r.id" class="restaurant-card" :class="{ inactive: !r.is_active }">
        <img v-if="r.image" :src="r.image" :alt="r.name" :title="r.name">
        
        <span v-if="!r.is_active" class="status-badge inactive">
          ✗ Не активен
        </span>
        
        <h3>{{ r.name }}</h3>
        <p>{{ r.description }}</p>
        <p class="address">{{ r.address }}</p>
        
        <button 
          v-if="!r.is_active" 
          class="btn btn-disabled" 
          disabled
        >
          Временно закрыто
        </button>
        <router-link 
          v-else 
          :to="`/restaurant/${r.id}`" 
          class="btn btn-primary"
        >
          Перейти в меню
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  data() {
    return {
      restaurants: [],
      loading: false,
      user: null,
      API_URL: '/api'
    }
  },
  created() {
    this.loadUser()
    this.loadRestaurants()
  },
  methods: {
    loadUser() {
      try {
        this.user = JSON.parse(localStorage.getItem('user') || 'null')
      } catch (e) {
        console.error('Ошибка парсинга данных пользователя из localStorage:', e)
        this.user = null
      }
    },

    async loadRestaurants() {
      this.loading = true

      try {
        const url = `${this.API_URL}/restaurants`
        const res = await fetch(url, {
          headers: { 'Accept': 'application/json' }
        })

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`)
        }

        const data = await res.json()
        this.restaurants = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
            ? data
            : []
      } catch (e) {
        console.error('Ошибка загрузки ресторанов:', e)

        if (e.message.includes('Failed to fetch')) {
          console.error('Проверьте: запущен ли сервер, настройки CORS, HTTPS')
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>


<style scoped>
.home {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
}

.home h1 {
  color: #78350F;
  text-align: center;
  margin-bottom: 10px;
  font-size: 2.5rem;
}

.subtitle {
  color: #B45309;
  text-align: center;
  font-size: 1.2rem;
  margin-bottom: 50px;
}

.loading {
  text-align: center;
  color: #92400E;
  font-size: 1.3rem;
  padding: 60px;
}

.restaurants-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 30px;
}

.restaurant-card {
  background: #FFFBEB;
  border: 2px solid #FCD34D;
  border-radius: 15px;
  padding: 25px;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.restaurant-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(245, 158, 11, 0.15);
}

.restaurant-card.inactive {
  background: #FEF2F2;
  border-color: #FCA5A5;
}

.status-badge {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 15px;
}

.status-badge.active {
  background: #DCFCE7;
  color: #16A34A;
  border: 2px solid #16A34A;
}

.status-badge.inactive {
  background: #FEE2E2;
  color: #DC2626;
  border: 2px solid #DC2626;
}

.restaurant-card h3 {
  color: #78350F;
  margin-bottom: 10px;
  font-size: 1.4rem;
}

.restaurant-card p {
  color: #92400E;
  margin-bottom: 8px;
}

.restaurant-card .address {
  font-size: 0.95rem;
  color: #B45309;
}

.btn {
  display: block;
  width: 100%;
  padding: 14px 30px;
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

.btn-disabled {
  background: #9CA3AF;
  color: #ffffff;
  cursor: not-allowed;
}

.btn-disabled:hover {
  background: #9CA3AF;
}

@media (max-width: 768px) {
  .restaurants-grid {
    grid-template-columns: 1fr;
  }
}
</style>
