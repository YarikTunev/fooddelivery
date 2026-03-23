<template>
  <div class="register">
    <h1>Регистрация</h1>
    <form @submit.prevent="register">
      <div class="form-group">
        <label>Имя</label>
        <input v-model="form.name" type="text" placeholder="Ваше имя" required>
      </div>
      
      <div class="form-group">
        <label>Email</label>
        <input v-model="form.email" type="email" placeholder="example@mail.ru" required>
      </div>
      
      <div class="form-group">
        <label>Пароль</label>
        <input v-model="form.password" type="password" placeholder="Минимум 6 символов" required minlength="6">
      </div>
      
      <div class="form-group">
        <label>Подтверждение пароля</label>
        <input v-model="form.password_confirmation" type="password" placeholder="Повторите пароль" required>
      </div>

      <div v-if="error" class="error">{{ error }}</div>
      
      <button type="submit" class="btn btn-primary" :disabled="loading">
        {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
      </button>
    </form>
    
    <p class="login-link">
      Уже есть аккаунт? <router-link to="/login">Войти</router-link>
    </p>
  </div>
</template>

<script>
export default {
  name: 'RegisterView',
  data() {
    return {
      form: {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone: '',
        address: ''
      },
      loading: false,
      error: null,
      API_URL: '/api'
    }
  },
  methods: {
    async register() {
      this.loading = true;
      this.error = null;

      // Валидация формы
      if (!this.form.name || this.form.name.trim() === '') {
        this.error = 'Введите имя';
        this.loading = false;
        return;
      }

      if (!this.form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) {
        this.error = 'Введите корректный email';
        this.loading = false;
        return;
      }

      if (!this.form.password || this.form.password.length < 6) {
        this.error = 'Пароль должен содержать минимум 6 символов';
        this.loading = false;
        return;
      }

      if (this.form.password !== this.form.password_confirmation) {
        this.error = 'Пароли не совпадают';
        this.loading = false;
        return;
      }

      try {
        const url = `${this.API_URL}/auth/register`;

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: this.form.name.trim(),
            email: this.form.email.trim(),
            password: this.form.password,
            password_confirmation: this.form.password_confirmation,
            phone: this.form.phone?.trim() || null,
            address: this.form.address?.trim() || null
          })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));

          if (errorData.errors) {
            const firstError = Object.values(errorData.errors)[0]?.[0];
            throw new Error(firstError);
          }
          throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (data.token && data.user) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          window.dispatchEvent(new Event('userLoggedIn'));
        }

        const role = data.user?.role || 'client';
        const redirectPath = role === 'admin' ? '/admin' : '/';
        this.$router.push(redirectPath);

      } catch (err) {
        console.error('Ошибка регистрации:', err);

        if (err.message.includes('Failed to fetch')) {
          this.error = 'Не удалось соединиться с сервером. Проверьте интернет и настройки CORS.';
        } else {
          this.error = err.message || 'Не удалось зарегистрироваться. Проверьте данные.';
        }
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>


<style scoped>
.register {
  max-width: 450px;
  margin: 80px auto;
  padding: 40px;
  background: #FFFBEB;
  border: 2px solid #FCD34D;
  border-radius: 15px;
}

.register h1 {
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

.login-link {
  text-align: center;
  margin-top: 20px;
  color: #92400E;
}

.login-link a {
  color: #D97706;
  text-decoration: none;
  font-weight: 600;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>