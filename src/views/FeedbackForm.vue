<!-- src/views/FeedbackView.vue -->
<template>
  <div class="feedback-page">
    <router-link to="/" class="back-link">← Назад</router-link>
    
    <div class="feedback-container">
      <div class="feedback-header">
        <h1>Напишите нам</h1>
        <p class="subtitle">Есть вопрос, предложение или жалоба? Мы обязательно ответим!</p>
      </div>
      
      <div class="feedback-content">
        <div class="form-section">
          <FeedbackForm 
            :onSuccess="handleSuccess"
          />
        </div>
        <div class="info-section">
          <div class="info-card">
            <h3>Контакты поддержки</h3>
            <ul>
              <li>support@fooddelivery.com</li>
              <li>+7 (999) 123-45-67</li>
              <li>Telegram: @fooddelivery_support</li>
            </ul>
          </div>
          
          <div class="info-card">
            <h3>Время ответа</h3>
            <p>Мы отвечаем на все сообщения в течение <strong>24 часов</strong> в рабочие дни.</p>
          </div>
          
          <div class="info-card">
            <h3>Конфиденциальность</h3>
            <p>Ваши данные защищены и не передаются третьим лицам. Подробнее в <router-link to="/privacy">Политике конфиденциальности</router-link>.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FeedbackForm from '../components/FeedbackForm.vue'

export default {
  name: 'FeedbackView',
  components: { FeedbackForm },
  methods: {
    handleSuccess(result) {
      console.log('Feedback sent:', result)
    }
  }
}
</script>

<style scoped>
.feedback-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  min-height: calc(100vh - 200px);
}

.back-link {
  color: #92400E;
  text-decoration: none;
  font-size: 1rem;
  margin-bottom: 25px;
  display: inline-block;
  transition: color 0.3s;
}

.back-link:hover {
  color: #D97706;
}

.feedback-container {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.feedback-header {
  text-align: center;
  margin-bottom: 40px;
  padding-bottom: 25px;
  border-bottom: 2px solid #FEF3C7;
}

.feedback-header h1 {
  color: #78350F;
  font-size: 2rem;
  margin-bottom: 10px;
}

.subtitle {
  color: #92400E;
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto;
}

.feedback-content {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 40px;
  align-items: start;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-card {
  background: #FFFBEB;
  border: 2px solid #FCD34D;
  border-radius: 12px;
  padding: 20px;
}

.info-card h3 {
  color: #78350F;
  margin-bottom: 12px;
  font-size: 1.1rem;
}

.info-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-card li {
  color: #92400E;
  font-size: 0.95rem;
}

.info-card p {
  color: #92400E;
  font-size: 0.95rem;
  line-height: 1.5;
}

.info-card a {
  color: #000000;
  text-decoration: none;
  font-weight: 500;
}

.info-card a:hover {
  text-decoration: underline;
}

@media (max-width: 900px) {
  .feedback-content {
    grid-template-columns: 1fr;
  }
  
  .info-section {
    order: -1;
  }
}
</style>