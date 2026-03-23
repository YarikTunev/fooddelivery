<!-- src/components/FeedbackForm.vue -->
<template>
  <div class="feedback-widget">
    <form @submit.prevent="submitForm" class="feedback-form">
      <div class="form-group">
        <label for="name">Ваше имя *</label>
        <input 
          id="name"
          type="text" 
          v-model="form.name" 
          placeholder="Иван Иванов" 
          required 
          class="form-input"
          :disabled="isSubmitting"
        >
      </div>
      
      <div class="form-group">
        <label for="email">Email *</label>
        <input 
          id="email"
          type="email" 
          v-model="form.email" 
          placeholder="example@mail.ru" 
          required 
          class="form-input"
          :disabled="isSubmitting"
        >
      </div>
      
      <div class="form-group">
        <label for="message">Сообщение *</label>
        <textarea 
          id="message"
          v-model="form.message" 
          placeholder="Расскажите, чем мы можем помочь..." 
          rows="4" 
          required 
          class="form-input"
          :disabled="isSubmitting"
        ></textarea>
      </div>
      
      <button 
        type="submit" 
        class="btn btn-submit"
        :disabled="isSubmitting"
      >
        <span v-if="isSubmitting" class="spinner"></span>
        {{ isSubmitting ? 'Отправка...' : 'Отправить сообщение' }}
      </button>
      
      <!-- Статусы -->
      <transition name="fade">
        <p v-if="status" :class="['form-status', statusType]">
          {{ status }}
        </p>
      </transition>
    </form>
  </div>
</template>

<script>
export default {
  name: 'FeedbackForm',
  props: {
    apiUrl: {
      type: String,
      default: 'https://fooddelivery.s99220rx.beget.tech/api/feedback'
    },
    onSuccess: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      form: {
        name: '',
        email: '',
        message: ''
      },
      status: '',
      statusType: '',
      isSubmitting: false
    }
  },
  methods: {
    async submitForm() {
      this.isSubmitting = true
      this.status = ''
      
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(this.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
          body: JSON.stringify({
            name: this.form.name.trim(),
            email: this.form.email.trim(),
            message: this.form.message.trim(),
            page: window.location.pathname,
            user_agent: navigator.userAgent
          })
        })
        
        const result = await response.json()
        
        if (!response.ok) {
          throw new Error(result.message || 'Ошибка отправки')
        }
        
        this.status = 'Спасибо! Ваше сообщение отправлено.'
        this.statusType = 'success'
        this.form = { name: '', email: '', message: '' }

        if (this.onSuccess) {
          this.onSuccess(result)
        }
        setTimeout(() => {
          if (this.statusType === 'success') {
            this.status = ''
          }
        }, 4000)
        
      } catch (error) {
        console.error('Feedback error:', error)
        this.status = 'Не удалось отправить. Попробуйте позже.'
        this.statusType = 'error'
        setTimeout(() => {
          if (this.statusType === 'error') {
            this.status = ''
          }
        }, 5000)
      } finally {
        this.isSubmitting = false
      }
    }
  }
}
</script>

<style scoped>
.feedback-widget {
  background: #FFFBEB;
  border: 2px solid #FCD34D;
  border-radius: 16px;
  padding: 25px;
  max-width: 500px;
  margin: 0 auto;
}

.feedback-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-weight: 600;
  color: #78350F;
  font-size: 0.95rem;
}

.form-input {
  padding: 12px 16px;
  border: 2px solid #FCD34D;
  border-radius: 10px;
  font-size: 1rem;
  background: white;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #D97706;
}

.form-input:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

textarea.form-input {
  resize: vertical;
  min-height: 100px;
}

.btn-submit {
  background: #D97706;
  color: white;
  padding: 14px 24px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.btn-submit:hover:not(:disabled) {
  background: #B45309;
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.form-status {
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 0.95rem;
  text-align: center;
  margin-top: 8px;
}

.form-status.success {
  background: #D1FAE5;
  color: #065F46;
  border: 1px solid #A7F3D0;
}

.form-status.error {
  background: #FEE2E2;
  color: #991B1B;
  border: 1px solid #FECACA;
}

/* Спиннер загрузки */
.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Анимации статусов */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@media (max-width: 600px) {
  .feedback-widget {
    padding: 20px;
    margin: 0 10px;
  }
}
</style>