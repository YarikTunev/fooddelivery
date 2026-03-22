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
      API_URL: import.meta.env.VITE_API_URL || '/api'
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
.login {
  max-width: 450px;
  margin: 80px auto;
  padding: 40px;
  background: #FFFBEB;
  border: 2px solid #FCD34D;
  border-radius: 15px;
}

.login h1 {
  color: #78350F;
  text-align: center;
  margin-bottom: 30px;
  font-size: 2rem;
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
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #D97706;
}

.form-group input::placeholder {
  color: #B45309;
  opacity: 0.6;
}

.error {
  color: #DC2626;
  margin-bottom: 20px;
  text-align: center;
  background: #FEE2E2;
  padding: 10px;
  border-radius: 8px;
  border: 2px solid #DC2626;
}

.btn {
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1rem;
}

.btn-primary {
  background: #D97706;
  color: #ffffff;
}

.btn-primary:hover:not(:disabled) {
  background: #B45309;
}

.btn-primary:disabled {
  background: #9CA3AF;
  cursor: not-allowed;
}

.register-link {
  text-align: center;
  margin-top: 20px;
  color: #92400E;
}

.register-link a {
  color: #D97706;
  text-decoration: none;
  font-weight: 600;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>