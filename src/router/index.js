import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import RestaurantView from '../views/RestaurantView.vue'
import CartView from '../views/CartView.vue'
import OrdersView from '../views/OrdersView.vue'
import AdminView from '../views/AdminView.vue'
import AdminRestaurants from '../views/admin/AdminRestaurants.vue'
import AdminMenu from '../views/admin/AdminMenu.vue'
import AdminOrders from '../views/admin/AdminOrders.vue'
import AdminReviewsModeration from '../views/admin/AdminReviewsModeration.vue'
import AdminUsers from '../views/admin/AdminUsers.vue'
import AdminFeedbackView from '../views/admin/AdminFeedbackView.vue'
import AboutCompany from '../views/Company/AboutCompany.vue'
import AboutStaff from '../views/Company/AboutStaff.vue'
import NotFound from '../views/NotFound.vue'
import Reviews from '../views/Reviews.vue'
import FeedbackView from '../views/FeedbackForm.vue'
import BusinessLunchView from '../views/BusinessLunchView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
  //Главная страница
  { 
    path: '/', 
    name: 'home', 
    component: HomeView,
    meta: { 
      title: 'FoodDelivery — Доставка еды из ресторанов в Перми',
      description: 'Закажите доставку еды из ресторанов Перми. Пицца, суши, бургеры от 299 ₽. Доставка от 30 минут. Скидка 10% на первый заказ. Отзывы клиентов.',
      keywords: 'доставка еды, доставка еды перми, заказать еду на дом, доставка пиццы, доставка суши, еда с доставкой'
    }
  },
  
  //Вход
  { 
    path: '/login', 
    name: 'login', 
    component: LoginView,
    meta: { 
      title: 'Вход в личный кабинет | FoodDelivery',
      description: 'Войдите в личный кабинет FoodDelivery. История заказов, отслеживание доставки, повторные заказы. Авторизация за 1 минуту.',
      keywords: 'вход, личный кабинет, авторизация'
    }
  },
  
  //Регистрация
  { 
    path: '/register', 
    name: 'register', 
    component: RegisterView,
    meta: { 
      title: 'Регистрация на FoodDelivery — Скидка 10%',
      description: 'Зарегистрируйтесь на FoodDelivery и получите скидку 10% на первый заказ. Быстрая регистрация. Доставка еды из ресторанов Перми.',
      keywords: 'регистрация, создать аккаунт, скидка на первый заказ'
    }
  },
  
  //Страница ресторана
  { 
    path: '/restaurant/:id', 
    name: 'restaurant', 
    component: RestaurantView,
    meta: { 
      title: 'Меню ресторана — Доставка еды | FoodDelivery',
      description: 'Закажите доставку из ресторана онлайн. Актуальное меню с ценами, отзывы клиентов. Быстрая доставка на дом или в офис по Перми.',
      keywords: 'меню ресторана, заказать из ресторана, доставка из ресторана, цены на еду'
    }
  },
  
  // Корзина
  { 
    path: '/cart', 
    name: 'cart', 
    component: CartView, 
    meta: { 
      requiresAuth: true,
      title: 'Корзина заказов | FoodDelivery',
      description: 'Ваша корзина заказов FoodDelivery. Оформите заказ доставки еды онлайн. Оплата картой или при получении. Быстрое оформление.',
      keywords: 'корзина, заказ, оформление заказа'
    }
  },
  
  //Заказы
  { 
    path: '/orders', 
    name: 'orders', 
    component: OrdersView, 
    meta: { 
      requiresAuth: true,
      title: 'Мои заказы — История доставок | FoodDelivery',
      description: 'История ваших заказов доставки еды. Отслеживайте статус доставки, повторяйте заказы. Все заказы в личном кабинете клиента.',
      keywords: 'мои заказы, история заказов, статус доставки'
    }
  },
  
  //О компании
  { 
    path: '/about-company', 
    name: 'about-company',
    component: AboutCompany, 
    meta: { 
      hideLayout: false,
      title: 'О компании FoodDelivery — Доставка еды с 2020 года',
      description: 'FoodDelivery — сервис доставки еды из ресторанов Перми с 2020 года. Более 100 ресторанов-партнёров. Гарантия качества и свежести.',
      keywords: 'о компании, fooddelivery, доставка еды перми, сервис доставки'
    }
  },
  
  //О сотрудниках
  { 
    path: '/staff', 
    name: 'staff',
    component: AboutStaff, 
    meta: { 
      hideLayout: false,
      title: 'Наша команда — Сотрудники FoodDelivery',
      description: 'Познакомьтесь с командой FoodDelivery. Курьеры, повара, операторы — более 200 сотрудников. Профессиональная доставка еды в Перми.',
      keywords: 'сотрудники, команда, курьеры, повара'
    }
  },
  
  //Обратная связь
  { 
    path: '/feedback', 
    name: 'Feedback', 
    component: FeedbackView, 
    meta: { 
      title: 'Обратная связь | FoodDelivery',
      description: 'Есть вопрос или предложение? Напишите нам! Отвечаем в течение 24 часов. Поддержка клиентов FoodDelivery. Контакты для связи.',
      keywords: 'обратная связь, написать нам, поддержка, контакты'
      
    }
  },
  
  // Отзывы
  { 
    path: '/reviews', 
    name: 'Reviews',
    component: Reviews, 
    meta: { 
      requiresAuth: false,
      title: 'Отзывы клиентов о FoodDelivery — Реальные мнения',
      description: 'Читайте отзывы клиентов о доставке еды FoodDelivery. Реальные мнения, оценки ресторанов и качества доставки. Оставьте свой отзыв.',
      keywords: 'отзывы, отзывы о доставке, отзывы fooddelivery, мнения клиентов'
    }
  },
  

  // Новый маршрут
  { 
    path: '/business-lunch', 
    name: 'BusinessLunch', 
    component: BusinessLunchView,
    meta: { 
      title: 'Доставка бизнес-ланчей в офис — Цены от 299 ₽ | FoodDelivery',
      description: 'Закажите доставку бизнес-ланчей в офис Перми. От 299 ₽, доставка от 30 минут. Скидки компаниям до 10%. Более 50 блюд в меню. Звоните!',
      keywords: 'доставка бизнес ланчей, бизнес ланч с доставкой, доставка обедов в офис, корпоративное питание перми, заказать бизнес ланч, комплексные обеды доставка'
    }
  },
  { 
    path: '/adminowno', 
    name: 'admin', 
    component: AdminView, 
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      { path: '', redirect: '/adminowno/restaurants' },
      { path: 'restaurants', name: 'admin-restaurants', component: AdminRestaurants },
      { path: 'menu', name: 'admin-menu', component: AdminMenu },
      { path: 'orders', name: 'admin-orders', component: AdminOrders },
      { path: 'users', name: 'admin-users', component: AdminUsers },
      { path: 'reviews', name: 'admin-reviews', component:AdminReviewsModeration },
      { path: 'feedback', name: 'admin-feedback',  component: AdminFeedbackView }
    ]
  },
  { 
  path: '/:pathMatch(.*)*', 
  name: 'NotFound', 
  component: NotFound,
  meta: { 
    showFooter: true,
    title: 'Страница не найдена — 404 | FoodDelivery',
    description: 'Запрашиваемая страница не найдена. Вернитесь на главную и выберите ресторан для заказа доставки еды в Перми.',
    keywords: '404, страница не найдена, ошибка'
  }
  },
  ]
  
})

router.beforeEach((to, from, next) => {
  if (to.meta?.title) {
    document.title = to.meta.title
  } else {
    document.title = 'FoodDelivery — Доставка еды в Перми'
  }
  next()
})

export default router
