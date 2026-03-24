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
.error,.login-link,.register h1{text-align:center}.register{max-width:450px;margin:80px auto;padding:40px;background:#fffbeb;border:2px solid #fcd34d;border-radius:15px}.error,.form-group{margin-bottom:20px}.register h1{color:#78350f;margin-bottom:30px;font-size:2rem}.btn,.form-group input{width:100%;font-size:1rem}.form-group label{display:block;color:#92400e;margin-bottom:8px;font-weight:600}.form-group input{padding:14px 16px;background:#fffbeb;border:2px solid #fcd34d;border-radius:10px;color:#78350f;transition:border-color .3s;box-sizing:border-box}.form-group input:focus{outline:0;border-color:#d97706}.form-group input::placeholder{color:#b45309;opacity:.6}.error{color:#dc2626;background:#fee2e2;padding:10px;border-radius:8px;border:2px solid #dc2626}.btn{padding:15px;border:none;border-radius:10px;font-weight:600;cursor:pointer;transition:.3s}.btn-primary{background:#d97706;color:#fff}.btn-primary:hover:not(:disabled){background:#b45309}.btn-primary:disabled{background:#9ca3af;cursor:not-allowed}.login-link{margin-top:20px;color:#92400e}.login-link a{color:#d97706;text-decoration:none;font-weight:600}.login-link a:hover{text-decoration:underline}
</style>