<template>
  <div class="career">
    <div class="page-header">
      <h1>Карьера в FoodDelivery</h1>
      <p class="subtitle">Станьте частью нашей команды и стройте будущее с нами</p>
    </div>

    <section class="benefits-section">
      <h2>Почему стоит работать у нас?</h2>
      <div class="benefits-grid">
        <div class="benefit-card">
          <span class="benefit-icon">💰</span>
          <h3>Конкурентная зарплата</h3>
          <p>Мы предлагаем достойную оплату труда и регулярные премии за результаты.</p>
        </div>
        <div class="benefit-card">
          <span class="benefit-icon">📚</span>
          <h3>Обучение</h3>
          <p>Бесплатные курсы, тренинги и доступ к образовательным платформам.</p>
        </div>
        <div class="benefit-card">
          <span class="benefit-icon">🏥</span>
          <h3>Медицина</h3>
          <p>ДМС для сотрудников и их семей после испытательного срока.</p>
        </div>
        <div class="benefit-card">
          <span class="benefit-icon">🏠</span>
          <h3>Удалёнка</h3>
          <p>Гибридный формат работы для большинства позиций.</p>
        </div>
        <div class="benefit-card">
          <span class="benefit-icon">🎉</span>
          <h3>Мероприятия</h3>
          <p>Корпоративы, тимбилдинги и совместные праздники.</p>
        </div>
        <div class="benefit-card">
          <span class="benefit-icon">📈</span>
          <h3>Рост</h3>
          <p>Прозрачная система карьерного роста и внутренние повышения.</p>
        </div>
      </div>
    </section>

    <section class="process-section">
      <h2>Процесс трудоустройства</h2>
      <div class="process-steps">
        <div class="step">
          <div class="step-number">1</div>
          <h3>Отклик</h3>
          <p>Оставьте заявку на вакансию</p>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <h3>Собеседование</h3>
          <p>Встреча с HR и руководителем</p>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <h3>Тестовое</h3>
          <p>Выполнение тестового задания</p>
        </div>
        <div class="step">
          <div class="step-number">4</div>
          <h3>Офер</h3>
          <p>Получение предложения о работе</p>
        </div>
      </div>
    </section>

    <section class="cta-section">
      <h2>Готовы начать?</h2>
      <p>Посмотрите наши открытые вакансии и найдите позицию по душе</p>
      <router-link to="/vacancies" class="btn btn-primary">Смотреть вакансии</router-link>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Career'
}
</script>

<style scoped>
.career {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 50px;
}

.page-header h1 {
  font-size: 2.5rem;
  color: #78350F;
  margin-bottom: 15px;
}

.subtitle {
  font-size: 1.2rem;
  color: #92400E;
}

.benefits-section {
  margin-bottom: 50px;
}

.benefits-section h2 {
  text-align: center;
  font-size: 1.8rem;
  color: #78350F;
  margin-bottom: 30px;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
}

.benefit-card {
  background: #FEF3C7;
  padding: 25px;
  border-radius: 12px;
  text-align: center;
  border: 2px solid #D97706;
}

.benefit-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 15px;
}

.benefit-card h3 {
  color: #78350F;
  margin-bottom: 10px;
  font-size: 1.2rem;
}

.benefit-card p {
  color: #92400E;
  line-height: 1.5;
}

.process-section {
  background: #92400E;
  padding: 40px;
  border-radius: 12px;
  margin-bottom: 50px;
}

.process-section h2 {
  text-align: center;
  color: #FEF3C7;
  font-size: 1.8rem;
  margin-bottom: 30px;
}

.process-steps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.step {
  text-align: center;
  color: #FEF3C7;
}

.step-number {
  width: 50px;
  height: 50px;
  background: #D97706;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 auto 15px;
}

.step h3 {
  margin-bottom: 10px;
  color: #FDE68A;
}

.step p {
  opacity: 0.9;
}

.cta-section {
  text-align: center;
  background: #FEF3C7;
  padding: 40px;
  border-radius: 12px;
  border: 2px solid #D97706;
}

.cta-section h2 {
  color: #78350F;
  margin-bottom: 15px;
}

.cta-section p {
  color: #92400E;
  margin-bottom: 25px;
}

.btn-primary {
  display: inline-block;
  background: #D97706;
  color: white;
  padding: 15px 40px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: background 0.3s;
}

.btn-primary:hover {
  background: #B45309;
}

@media (max-width: 991px) {
  .benefits-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .process-steps {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 767px) {
  .page-header h1 {
    font-size: 2rem;
  }
  
  .benefits-grid {
    grid-template-columns: 1fr;
  }
  
  .process-steps {
    grid-template-columns: 1fr;
  }
  
  .process-section {
    padding: 25px;
  }
}
</style>