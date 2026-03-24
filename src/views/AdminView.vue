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
.admin-layout{display:flex;min-height:100vh;background:#fffbeb}.admin-sidebar{width:260px;background:#92400e;display:flex;flex-direction:column;position:fixed;left:0;top:0;bottom:0;overflow-y:auto}.sidebar-header{padding:25px 20px;border-bottom:2px solid #78350f}.sidebar-header h2{color:#fef3c7;font-size:1.3rem;margin:0}.sidebar-nav{flex:1;padding:20px 0}.nav-item{display:flex;align-items:center;gap:12px;padding:14px 20px;color:#fef3c7;text-decoration:none;transition:.3s;border-left:4px solid transparent;background:0 0;border:none;cursor:pointer;font-size:1rem;width:100%;text-align:left}.nav-item:hover{background:#78350f;color:#fff}.nav-item.active{background:#d97706;border-left-color:#fcd34d;color:#fff}.nav-icon{font-size:1.3rem}.nav-text{font-weight:500}.sidebar-footer{padding:20px 0;border-top:2px solid #78350f}.logout-btn{color:#fecaca}.logout-btn:hover{background:#dc2626;color:#fff}.admin-content{flex:1;margin-left:260px;padding:60px 40px;background:#fffbeb;min-height:100vh}@media (max-width:768px){.admin-sidebar{width:70px}.nav-text,.sidebar-header h2{display:none}.nav-item{justify-content:center;padding:14px 10px}.admin-content{margin-left:70px;padding:20px}}
</style>