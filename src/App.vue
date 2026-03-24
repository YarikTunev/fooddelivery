<template>
  <div id="app">
    <nav v-if="showNavbar" class="navbar">
      <div class="container navbar-container">
        <router-link to="/" class="logo">
          <span class="logo-text">FoodDelivery</span>
        </router-link>
        <button 
          class="burger-btn" 
          :class="{ 'active': isMobileMenuOpen }"
          @click="toggleMobileMenu"
          aria-label="Меню"
          :aria-expanded="isMobileMenuOpen"
        >
          <span class="burger-line"></span>
          <span class="burger-line"></span>
          <span class="burger-line"></span>
        </button>

        <div class="nav-links" :class="{ 'active': isMobileMenuOpen }">
          <router-link to="/business-lunch" class="nav-link">Бизнес-ланчи</router-link>
          <router-link to="/reviews" class="nav-link" @click="closeMobileMenu">Отзывы</router-link>
          <router-link to="/" class="nav-link" @click="closeMobileMenu">Рестораны</router-link>
          
          <template v-if="isAuthenticated">
            <router-link to="/orders" class="nav-link" @click="closeMobileMenu">Заказы</router-link>
            <router-link to="/cart" class="nav-link" @click="closeMobileMenu">Корзина</router-link>
            
            <router-link 
              v-if="user?.role === 'admin'" 
              to="/admin" 
              class="nav-link admin-link"
              @click="closeMobileMenu"
            >
              Админка
            </router-link>
            
            <div class="mobile-user-block">
              <span class="user-info">{{ user?.name }} ({{ roleLabel }})</span>
              <button @click="handleLogout" class="btn btn-logout">Выход</button>
            </div>
          </template>
          
          <template v-else>
            <router-link to="/login" class="nav-link" @click="closeMobileMenu">Вход</router-link>
            <router-link to="/register" class="nav-link" @click="closeMobileMenu">Регистрация</router-link>
          </template>

          <template v-if="isAuthenticated">
            <div class="desktop-user-block">
              <span class="user-info">{{ user?.name }} ({{ roleLabel }})</span>
              <button @click="handleLogout" class="btn btn-logout">Выход</button>
            </div>
          </template>
        </div>
        
        <div 
          v-if="isMobileMenuOpen" 
          class="mobile-overlay" 
          @click="closeMobileMenu"
        ></div>
      </div>
    </nav>

    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <footer v-if="showFooter" class="footer">
      <div class="container footer-container">
        <div class="footer-column">
          <h3 class="footer-title">О компании</h3>
          <ul class="footer-links">
            <li><router-link to="/about-company">О компании</router-link></li>
            <li><router-link to="/staff">О сотрудниках</router-link></li>
            <li><router-link to="/feedback">Обратная связь</router-link></li>
          </ul>
        </div>

        <div class="footer-column">
          <h3 class="footer-title">Контакты</h3>
          <div class="contact-info">
            <p>+7 (999) 123-45-67</p>
            <p>support@fooddelivery.com</p>
            <p>г. Москва, ул. Вкусная, д. 1</p>
          </div>
          <div class="social-links">
            <a href="#" class="social-icon">ВК</a>
            <a href="#" class="social-icon">ТГ</a>
          </div>
        </div>

        <div class="footer-column">
          <h3 class="footer-title">Наши гарантии</h3>
          <ul class="guarantees-list">
            <li>100% Свежие продукты</li>
            <li>Лицензированные повара</li>
            <li>Доставка за 30 минут</li>
            <li>Возврат денег при ошибках</li>
          </ul>
        </div>

        <div class="footer-column faq-column">
          <h3 class="footer-title">Частые вопросы</h3>
          <div class="faq-list">
            <div v-for="(faq, index) in faqItems" :key="index" class="faq-item">
              <button @click="toggleFaq(index)" class="faq-question" :class="{ active: openFaqIndex === index }">
                {{ faq.question }}
                <span class="faq-toggle">{{ openFaqIndex === index ? '−' : '+' }}</span>
              </button>
              <transition name="slide">
                <div v-show="openFaqIndex === index" class="faq-answer">
                  {{ faq.answer }}
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="container">
          <p class="footer-text">&copy; 2026 FoodDelivery. Все права защищены.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { useMetaTags } from '../src/composables/useMetaTags'

export default {
  name: 'App',
  setup() {
    const { setMetaTags } = useMetaTags()
    return { setMetaTags }
  },
  watch: {
    '$route'(to) {
      this.setMetaTags(to.meta)
    }
  },
  data() {
    return {
      user: null,
      isMobileMenuOpen: false,
      feedbackForm: {
        name: '',
        email: '',
        message: ''
      },
      formStatus: '',
      formError: '',
      isSubmitting: false,
      openFaqIndex: null,
      API_URL: '/api',
      faqItems: [
        {
          question: 'Как быстро доставляют заказ?',
          answer: 'Среднее время доставки — 30–45 минут. Точное время зависит от загруженности ресторана и расстояния.'
        },
        {
          question: 'Можно ли оплатить картой?',
          answer: 'Да, мы принимаем банковские карты, электронные кошельки и наличные при получении.'
        },
        {
          question: 'Что делать, если заказ не понравился?',
          answer: 'Свяжитесь с поддержкой в течение 30 минут после получения заказа. Мы вернём деньги или заменим блюдо.'
        },
        {
          question: 'Есть ли минимальная сумма заказа?',
          answer: 'Минимальная сумма заказа — 500 ₽. При заказе от 1500 ₽ доставка бесплатная.'
        }
      ]
    }
  },
  computed: {
    isAuthenticated() {
      return this.user !== null
    },
    roleLabel() {
      const labels = { admin: 'Админ', client: 'Клиент' }
      return labels[this.user?.role] || this.user?.role
    },
    showNavbar() {
      return !['/login', '/register'].includes(this.$route.path)
    },
    showFooter() {
      return !['/login', '/register'].includes(this.$route.path) &&
            !this.$route.path.startsWith('/admin')
    }
  },
  created() {
    this.setMetaTags(this.$route.meta)
    this.loadUser()
    window.addEventListener('userLoggedIn', this.loadUser)
    window.addEventListener('userLoggedOut', this.loadUser)

    // Заменяем $router.afterEach на навигационные guards Vue Router
    this.$router.beforeEach(() => {
      this.closeMobileMenu()
    })
  },
  beforeUnmount() {
    window.removeEventListener('userLoggedIn', this.loadUser)
    window.removeEventListener('userLoggedOut', this.loadUser)
  },
  methods: {
    loadUser() {
      try {
        const userData = localStorage.getItem('user')
        this.user = userData ? JSON.parse(userData) : null
      } catch (error) {
        console.error('Ошибка загрузки пользователя:', error)
        this.user = null
      }
    },
    handleLogout() {
      this.logout()
      this.closeMobileMenu()
    },
    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.dispatchEvent(new Event('userLoggedOut'))
      this.$router.push('/')
    },
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen
      document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : ''
    },
    closeMobileMenu() {
      this.isMobileMenuOpen = false
      document.body.style.overflow = ''
    },

    async submitFeedback() {
      this.isSubmitting = true
      this.formError = ''
      this.formStatus = ''

      // Валидация формы перед отправкой
      if (!this.feedbackForm.name.trim()) {
        this.formError = 'Введите ваше имя'
        this.isSubmitting = false
        return
      }
      if (!this.feedbackForm.email.trim()) {
        this.formError = 'Введите email'
        this.isSubmitting = false
        return
      }
      if (!this.feedbackForm.message.trim()) {
        this.formError = 'Введите сообщение'
        this.isSubmitting = false
        return
      }

      try {
        const token = localStorage.getItem('token')
        const url = `${this.API_URL}/feedback`

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
          body: JSON.stringify({
            name: this.feedbackForm.name.trim(),
            email: this.feedbackForm.email.trim(),
            message: this.feedbackForm.message.trim(),
            page: window.location.pathname,
            user_agent: navigator.userAgent
          })
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))

          if (response.status === 401) {
            throw new Error('Требуется авторизация')
          } else if (response.status === 422) {
            const firstError = Object.values(errorData.errors || {})[0]?.[0]
            throw new Error(firstError || 'Ошибка валидации данных')
          }
          throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
        }

        await response.json()
        this.formStatus = 'Спасибо! Ваше сообщение отправлено.'
        this.feedbackForm = { name: '', email: '', message: '' }

        setTimeout(() => { this.formStatus = '' }, 4000)
      } catch (error) {
        console.error('Ошибка отправки отзыва:', error)

        if (error.message.includes('Failed to fetch')) {
          this.formError = 'Не удалось соединиться с сервером. Проверьте интернет и настройки CORS.'
        } else {
          this.formError = error.message || 'Не удалось отправить сообщение. Попробуйте позже.'
        }
        setTimeout(() => { this.formError = '' }, 5000)
      } finally {
        this.isSubmitting = false
      }
    },

    toggleFaq(index) {
      this.openFaqIndex = this.openFaqIndex === index ? null : index
    }
  }
}
</script>

<style scoped>
.burger-btn {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
}

.burger-line {
  width: 25px;
  height: 3px;
  border-radius: 2px;
  transition: all 0.3s;
}

.burger-btn.active .burger-line:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}
.burger-btn.active .burger-line:nth-child(2) {
  opacity: 0;
}
.burger-btn.active .burger-line:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

@media (max-width: 1400px) {
  .burger-btn {
    display: flex;
  }
  
  .nav-links {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    flex-direction: column;
    padding: 20px;
    border-bottom: 2px solid #FCD34D;
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 100;
  }
  
  .nav-links.active {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }
  
  .mobile-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 99;
  }
  
  .mobile-user-block,
  .desktop-user-block {
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #FCD34D;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
  }
  
  .desktop-user-block {
    display: none;
  }
}

@media (min-width: 769px) {
  .mobile-user-block {
    display: none;
  }
  
  .desktop-user-block {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-left: 20px;
  }
}

/* Анимации */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>