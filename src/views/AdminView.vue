<template>
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <div class="sidebar-header">
        <h6>Админ-панель</h6>
      </div>
      
      <nav class="sidebar-nav">
        <router-link to="/admin/restaurants" class="nav-item" active-class="active">
          <span class="nav-text">Рестораны</span>
        </router-link>
        
        <router-link to="/admin/menu" class="nav-item" active-class="active">
          <span class="nav-text">Меню</span>
        </router-link>
        
        <router-link to="/admin/orders" class="nav-item" active-class="active">
          <span class="nav-text">Заказы</span>
        </router-link>
        
        <router-link to="/admin/users" class="nav-item" active-class="active">
          <span class="nav-text">Пользователи</span>
        </router-link>

        <router-link to="/admin/reviews" class="nav-item" active-class="active">
          <span class="nav-text">Отзывы</span>
        </router-link>
        <router-link to="/admin/feedback" class="nav-item" active-class="active">
          <span class="nav-text">Обратная связь</span>
        </router-link>
      </nav>
    </aside>

    <main class="admin-content">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'AdminView',
  methods: {
    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.dispatchEvent(new Event('userLoggedOut'))
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #FFFBEB;
}

.admin-sidebar {
  width: 260px;
  background: #92400E;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  overflow-y: auto;
}

.sidebar-header {
  padding: 25px 20px;
  border-bottom: 2px solid #78350F;
}

.sidebar-header h2 {
  color: #FEF3C7;
  font-size: 1.3rem;
  margin: 0;
}

.sidebar-nav {
  flex: 1;
  padding: 20px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  color: #FEF3C7;
  text-decoration: none;
  transition: all 0.3s;
  border-left: 4px solid transparent;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  width: 100%;
  text-align: left;
}

.nav-item:hover {
  background: #78350F;
  color: #ffffff;
}

.nav-item.active {
  background: #D97706;
  border-left-color: #FCD34D;
  color: #ffffff;
}

.nav-icon {
  font-size: 1.3rem;
}

.nav-text {
  font-weight: 500;
}

.sidebar-footer {
  padding: 20px 0;
  border-top: 2px solid #78350F;
}

.logout-btn {
  color: #FECACA;
}

.logout-btn:hover {
  background: #DC2626;
  color: #ffffff;
}

.admin-content {
  flex: 1;
  margin-left: 260px;
  padding: 60px 40px;
  background: #FFFBEB;
  min-height: 100vh;
}

@media (max-width: 768px) {
  .admin-sidebar {
    width: 70px;
  }
  
  .sidebar-header h2,
  .nav-text {
    display: none;
  }
  
  .nav-item {
    justify-content: center;
    padding: 14px 10px;
  }
  
  .admin-content {
    margin-left: 70px;
    padding: 20px;
  }
}
</style>