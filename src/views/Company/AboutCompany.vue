<template>
  <div class="about-company">
    <div class="page-header">
      <div class="header-bg">
        <h1>О компании FoodDelivery</h1>
        <p class="subtitle">Ваш надёжный партнёр в мире доставки еды с 2020 года</p>
      </div>
    </div>
    <section class="content-section">
      <div class="about-grid">
        <div class="about-text">
          <h2>Кто мы</h2>
          <p>
            <strong>FoodDelivery</strong> — это современный сервис доставки еды, который работает на рынке 
            с 2020 года. За это время мы выросли из небольшого стартапа в крупную компанию, 
            которой доверяют более 100 000 клиентов по всей России.
          </p>
          <p>
            Мы сотрудничаем с лучшими ресторанами, кафе и кухнями вашего города, чтобы вы могли 
            наслаждаться любимыми блюдами, не выходя из дома. Наша команда работает круглосуточно, 
            чтобы каждый заказ был доставлен вовремя и в идеальном состоянии.
          </p>
        </div>
        
        <div class="about-image">
          <div class="image-placeholder">
            <p>Команда FoodDelivery</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Миссия и ценности -->
    <section class="content-section">
      <div class="mission-card">
        <h2>Наша миссия</h2>
        <p class="mission-text">
          Сделать доставку еды максимально быстрой, удобной и доступной для каждого клиента. 
          Мы верим, что вкусная еда должна быть рядом — достаточно одного клика.
        </p>
        
        <div class="values-grid">
          <div class="value-item">
            <h3>Качество</h3>
            <p>Только свежие продукты и проверенные рестораны-партнёры</p>
          </div>
          
          <div class="value-item">
            <h3>Скорость</h3>
            <p>Среднее время доставки — 30-45 минут</p>
          </div>
          
          <div class="value-item">
            <h3>Надёжность</h3>
            <p>Гарантия возврата средств при любых проблемах</p>
          </div>
          
          <div class="value-item">
            <h3>Экологичность</h3>
            <p>Используем перерабатываемую упаковку</p>
          </div>
        </div>
      </div>
    </section>
    <section class="content-section">
      <h2 class="section-title">Наши достижения</h2>
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-number">100+</span>
          <span class="stat-label">Ресторанов-партнёров</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">100K+</span>
          <span class="stat-label">Довольных клиентов</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">24/7</span>
          <span class="stat-label">Поддержка клиентов</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">10к+</span>
          <span class="stat-label">Заказов доставлено</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">4.8</span>
          <span class="stat-label">Средний рейтинг</span>
        </div>
      </div>
    </section>
    <!-- Контакты -->
    <section class="content-section">
      <div class="contact-card">
        <h2>Свяжитесь с нами</h2>
        <div class="contact-grid">
          <div class="contact-item">
            <div>
              <h4>Адрес офиса</h4>
              <p>г. Москва, ул. Вкусная, д. 1, офис 500</p>
            </div>
          </div>
          
          <div class="contact-item">
            <div>
              <h4>Телефон</h4>
              <p>+7 (999) 123-45-67</p>
            </div>
          </div>
          
          <div class="contact-item">
            <div>
              <h4>Email</h4>
              <p>info@fooddelivery.com</p>
            </div>
          </div>
          
          <div class="contact-item">
            <div>
              <h4>Режим работы</h4>
              <p>Круглосуточно, без выходных</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'AboutCompany'
}
</script>

<style scoped>
/* === Основной контейнер === */
.about-company {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* === Заголовок страницы === */
.page-header {
  text-align: center;
  margin-bottom: 50px;
  background: linear-gradient(135deg, #92400E 0%, #78350F 100%);
  border-radius: 16px;
  padding: 60px 40px;
  color: #FEF3C7;
}

.header-bg h1 {
  font-size: 2.5rem;
  margin-bottom: 15px;
  color: #FEF3C7;
}

.subtitle {
  font-size: 1.2rem;
  color: #FDE68A;
  opacity: 0.9;
}

/* === Секции контента === */
.content-section {
  margin-bottom: 50px;
}

.section-title {
  font-size: 2rem;
  color: #78350F;
  text-align: center;
  margin-bottom: 30px;
  position: relative;
  padding-bottom: 15px;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 3px;
  background: #D97706;
  border-radius: 2px;
}

/* === Сетка "О нас" === */
.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;
}

.about-text h2 {
  font-size: 1.8rem;
  color: #78350F;
  margin-bottom: 20px;
}

.about-text p {
  color: #92400E;
  line-height: 1.8;
  margin-bottom: 15px;
  font-size: 1.05rem;
}

.about-image .image-placeholder {
  background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
  border-radius: 16px;
  padding: 60px 40px;
  text-align: center;
  border: 2px solid #D97706;
}

.image-placeholder .emoji {
  font-size: 5rem;
  display: block;
  margin-bottom: 15px;
}

.image-placeholder p {
  color: #78350F;
  font-weight: 600;
  font-size: 1.1rem;
}

/* === Карточка миссии === */
.mission-card {
  background: #FEF3C7;
  padding: 40px;
  border-radius: 16px;
  border-left: 5px solid #D97706;
}

.mission-card h2 {
  color: #78350F;
  font-size: 1.8rem;
  margin-bottom: 20px;
}

.mission-text {
  color: #92400E;
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 30px;
  padding: 20px;
  background: rgba(217, 119, 6, 0.1);
  border-radius: 12px;
  font-style: italic;
}

/* === Сетка ценностей === */
.values-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.value-item {
  background: white;
  padding: 25px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(120, 53, 15, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.value-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(120, 53, 15, 0.2);
}

.value-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 15px;
}

.value-item h3 {
  color: #78350F;
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.value-item p {
  color: #92400E;
  font-size: 0.9rem;
  line-height: 1.5;
}

/* === Статистика === */
.stats-grid {
  display: flex;
  gap: 20px;
  justify-content: space-evenly;
}

.stat-item {
  background: linear-gradient(135deg, #92400E 0%, #78350F 100%);
  color: #FEF3C7;
  padding: 30px 20px;
  width: 20%;
  border-radius: 16px;
  text-align: center;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s;
}

.stat-item:hover {
  transform: scale(1.05);
}

.stat-number {
  display: block;
  font-size: 2.2rem;
  font-weight: bold;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 0.85rem;
  opacity: 0.9;
  display: block;
  line-height: 1.4;
}

.stat-icon {
  position: absolute;
  bottom: 10px;
  right: 10px;
  font-size: 1.5rem;
  opacity: 0.3;
}

/* === Таймлайн истории === */
.timeline {
  position: relative;
  padding: 20px 0;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 3px;
  height: 100%;
  background: #D97706;
  border-radius: 2px;
}

.timeline-item {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
  position: relative;
}

.timeline-item:nth-child(odd) {
  flex-direction: row;
}

.timeline-item:nth-child(even) {
  flex-direction: row-reverse;
}

.timeline-year {
  background: #D97706;
  color: white;
  padding: 10px 20px;
  border-radius: 30px;
  font-weight: bold;
  font-size: 1.1rem;
  z-index: 1;
  min-width: 100px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(217, 119, 6, 0.4);
}

.timeline-content {
  background: #FEF3C7;
  padding: 20px 30px;
  border-radius: 12px;
  margin: 0 40px;
  flex: 1;
  max-width: 400px;
  border-left: 4px solid #92400E;
}

.timeline-content h3 {
  color: #78350F;
  font-size: 1.2rem;
  margin-bottom: 8px;
}

.timeline-content p {
  color: #92400E;
  font-size: 0.95rem;
  line-height: 1.5;
}

/* === Команда === */
.team-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 25px;
}

.team-card {
  background: white;
  padding: 30px 20px;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(120, 53, 15, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  border: 2px solid transparent;
}

.team-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(120, 53, 15, 0.2);
  border-color: #D97706;
}

.team-avatar {
  font-size: 4rem;
  margin-bottom: 15px;
  display: block;
}

.team-card h3 {
  color: #78350F;
  font-size: 1.1rem;
  margin-bottom: 5px;
}

.team-role {
  color: #D97706;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 10px;
}

.team-desc {
  color: #92400E;
  font-size: 0.85rem;
  line-height: 1.4;
}

/* === Контакты === */
.contact-card {
  background: linear-gradient(135deg, #92400E 0%, #78350F 100%);
  padding: 40px;
  border-radius: 16px;
  color: #FEF3C7;
}

.contact-card h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #FEF3C7;
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 25px;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 12px;
}

.contact-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.contact-item h4 {
  color: #FDE68A;
  font-size: 1rem;
  margin-bottom: 5px;
}

.contact-item p {
  color: #FEF3C7;
  font-size: 0.95rem;
  opacity: 0.9;
}

/* === Адаптивность === */
@media (max-width: 991px) {
  .about-grid {
    grid-template-columns: 1fr;
  }
  
  .values-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .team-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .timeline::before {
    left: 20px;
  }
  
  .timeline-item,
  .timeline-item:nth-child(odd),
  .timeline-item:nth-child(even) {
    flex-direction: row;
    justify-content: flex-start;
    padding-left: 50px;
  }
  
  .timeline-year {
    position: absolute;
    left: 0;
  }
  
  .timeline-content {
    margin: 0;
    max-width: none;
  }
}

@media (max-width: 767px) {
  .page-header {
    padding: 40px 20px;
  }
  
  .header-bg h1 {
    font-size: 1.8rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .values-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .team-grid {
    grid-template-columns: 1fr;
  }
  
  .contact-grid {
    grid-template-columns: 1fr;
  }
  
  .mission-card {
    padding: 25px;
  }
}

@media (max-width: 479px) {
  .about-company {
    padding: 20px 15px;
  }
  
  .page-header {
    padding: 30px 15px;
  }
  
  .header-bg h1 {
    font-size: 1.5rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-number {
    font-size: 1.8rem;
  }
  
  .contact-card {
    padding: 25px;
  }
  
  .contact-item {
    flex-direction: column;
    text-align: center;
    align-items: center;
  }
}

/* === Большие экраны === */
@media (min-width: 1600px) {
  .about-company {
    max-width: 1500px;
  }
}

@media (min-width: 1920px) {
  .about-company {
    max-width: 1800px;
  }
}
</style>