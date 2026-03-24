<template>
  <div class="home">
    <h1>Выберите ресторан</h1>
    <p class="subtitle">Заказывайте еду из лучших ресторанов города</p>
    
    <div v-if="loading" class="loading">Загрузка...</div>
    <div v-else-if="restaurants.length > 0" class="restaurants-grid">
      
      <div class="restaurant-card" :class="{ inactive: !restaurants[0].is_active }">
        <img 
          v-if="restaurants[0].image" 
          :src="restaurants[0].image" 
          :alt="restaurants[0].name" 
          :title="restaurants[0].name"
          loading="eager"
          fetchpriority="high"
          decoding="async"
        >
        
        <span v-if="!restaurants[0].is_active" class="status-badge inactive">
          ✗ Не активен
        </span>
        
        <h3>{{ restaurants[0].name }}</h3>
        <p>{{ restaurants[0].description }}</p>
        <p class="address">{{ restaurants[0].address }}</p>
        
        <button 
          v-if="!restaurants[0].is_active" 
          class="btn btn-disabled" 
          disabled
        >
          Временно закрыто
        </button>
        <router-link 
          v-else 
          :to="`/restaurant/${restaurants[0].id}`" 
          class="btn btn-primary"
        >
          Перейти в меню
        </router-link>
      </div>
      <div 
        v-for="r in restaurants.slice(1)" 
        :key="r.id" 
        class="restaurant-card" 
        :class="{ inactive: !r.is_active }"
      >
        <img 
          v-if="r.image" 
          :src="r.image" 
          :alt="r.name" 
          :title="r.name"
          loading="lazy"
        >
        
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

    <div v-else-if="!loading" class="loading">Рестораны не найдены</div>
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
.home h1,.restaurant-card h3{color:#78350f;margin-bottom:10px}.btn,.home h1,.loading,.subtitle{text-align:center}.home{max-width:1400px;margin:0 auto;padding:40px 20px}.home h1{font-size:2.5rem}.subtitle{color:#b45309;font-size:1.2rem;margin-bottom:50px}.loading{color:#92400e;font-size:1.3rem;padding:60px}.restaurants-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:30px}.restaurant-card{background:#fffbeb;border:2px solid #fcd34d;border-radius:15px;padding:25px;transition:.3s;position:relative;display:flex;flex-direction:column;align-items:center;justify-content:space-between}.restaurant-card:hover{transform:translateY(-5px);box-shadow:0 8px 25px rgba(245,158,11,.15)}.restaurant-card.inactive{background:#fef2f2;border-color:#fca5a5}.status-badge{display:inline-block;padding:6px 14px;border-radius:20px;font-size:.85rem;font-weight:600;margin-bottom:15px}.status-badge.active{background:#dcfce7;color:#16a34a;border:2px solid #16a34a}.status-badge.inactive{background:#fee2e2;color:#dc2626;border:2px solid #dc2626}.restaurant-card h3{font-size:1.4rem}.restaurant-card p{color:#92400e;margin-bottom:8px}.restaurant-card .address{font-size:.95rem;color:#b45309}.btn{display:block;width:100%;padding:14px 30px;border-radius:10px;text-decoration:none;font-weight:600;transition:.3s;border:none;cursor:pointer;margin-top:20px}.btn-primary{background:#d97706;color:#fff}.btn-primary:hover{background:#b45309}.btn-disabled,.btn-disabled:hover{background:#9ca3af}.btn-disabled{color:#fff;cursor:not-allowed}@media (max-width:768px){.restaurants-grid{grid-template-columns:1fr}}
</style>
