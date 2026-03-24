<template>
  <div class="login">
    <h1>Вход</h1>
    <form @submit.prevent="login">
      <div class="form-group">
        <label>Email</label>
        <input v-model="formData.email" type="email" required placeholder="example@mail.ru">
      </div>
      <div class="form-group">
        <label>Пароль</label>
        <input v-model="formData.password" type="password" required placeholder="••••••••">
      </div>
      <div v-if="error" class="error">{{ error }}</div>
      <button type="submit" class="btn btn-primary" :disabled="loading">
        {{ loading ? 'Вход...' : 'Войти' }}
      </button>
    </form>
    <p class="register-link">
      Нет аккаунта? <router-link to="/register">Зарегистрироваться</router-link>
    </p>
  </div>
</template>

<script>
export default {
  name: 'LoginView',
  data() {
    return {
      formData: { email: '', password: '' },
      loading: false,
      error: null,
      API_URL: '/api'
    }
  },
  created() {},
  methods: {
    async login() {
      this.loading = true
      this.error = null

      try {
        const url = `${this.API_URL}/auth/login`

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(this.formData)
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))

          if (response.status === 401) {
            throw new Error('Неверный email или пароль')
          } else if (response.status === 422) {
            const firstError = Object.values(errorData.errors || {})[0]?.[0]
            throw new Error(firstError || 'Ошибка валидации данных')
          }
          throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()

        if (data.token && data.user) {
          localStorage.setItem('token', data.token)
          localStorage.setItem('user', JSON.stringify(data.user))
          window.dispatchEvent(new Event('userLoggedIn'))
        }

        const role = data.user?.role || 'client'
        const redirectPath = role === 'admin' ? '/admin' : '/restaurants'
        this.$router.push(redirectPath)
      } catch (err) {
        console.error('Ошибка входа:', err)

        if (err.message.includes('Failed to fetch')) {
          this.error = 'Не удалось соединиться с сервером. Проверьте интернет и настройки CORS.'
        } else {
          this.error = err.message || 'Не удалось войти. Проверьте данные.'
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>


<style scoped>
.error,.login h1,.register-link{text-align:center}.login{max-width:450px;margin:80px auto;padding:40px;background:#fffbeb;border:2px solid #fcd34d;border-radius:15px}.error,.form-group{margin-bottom:20px}.login h1{color:#78350f;margin-bottom:30px;font-size:2rem}.btn,.form-group input{width:100%;font-size:1rem}.form-group label{display:block;color:#92400e;margin-bottom:8px;font-weight:600}.form-group input{padding:14px 16px;background:#fffbeb;border:2px solid #fcd34d;border-radius:10px;color:#78350f;transition:border-color .3s;box-sizing:border-box}.form-group input:focus{outline:0;border-color:#d97706}.form-group input::placeholder{color:#b45309;opacity:.6}.error{color:#dc2626;background:#fee2e2;padding:10px;border-radius:8px;border:2px solid #dc2626}.btn{padding:15px;border:none;border-radius:10px;font-weight:600;cursor:pointer;transition:.3s}.btn-primary{background:#d97706;color:#fff}.btn-primary:hover:not(:disabled){background:#b45309}.btn-primary:disabled{background:#9ca3af;cursor:not-allowed}.register-link{margin-top:20px;color:#92400e}.register-link a{color:#d97706;text-decoration:none;font-weight:600}.register-link a:hover{text-decoration:underline}
</style>