<template>
  <div class="business-lunch-page">
    <h1>Доставка бизнес-ланчей в офис — от 299 ₽</h1>

    <section class="intro">
      <p>
        <strong>Доставка бизнес-ланчей</strong> — удобное решение для тех, кто хочет вкусно 
        и недорого поесть во время рабочего дня. Мы привезём горячие обеды прямо в ваш 
        офис в Перми. <strong>Заказать бизнес-ланч с доставкой</strong> можно онлайн за 2 минуты.
      </p>
    </section>

    <section class="benefits">
      <h2>Преимущества доставки бизнес-ланчей</h2>
      <ul>
        <li><strong>Быстрая доставка</strong> — от 30 минут в любое время</li>
        <li><strong>Выгодные цены</strong> — комплексные обеды от 299 ₽</li>
        <li><strong>Разнообразное меню</strong> — более 50 блюд ежедневно</li>
        <li><strong>Регулярная доставка</strong> — составим график на неделю</li>
        <li><strong>Документы для бухгалтерии</strong> — предоставляем чеки</li>
        <li> <strong>Бесплатная доставка</strong> — при заказе от 3000 ₽</li>
      </ul>
    </section>

    <section class="menu-preview">
      <h2>Популярные бизнес-ланчи</h2>
      <div class="lunch-cards">
        <div class="lunch-card">
          <img 
            src="../assets/image/lunch-office.webp" 
            alt="Бизнес-ланч Офисный — салат суп горячее напиток"
            loading="lazy"
            width="300"
            height="200"
            title="Бизнес-ланч Офисный"
          >
          <figcaption>Комплекс «Офисный» — 299 ₽</figcaption>
          <h3>«Офисный»</h3>
          <ul>
            <li>Салат сезонный</li>
            <li>Суп дня</li>
            <li>Горячее блюдо</li>
            <li>Напиток на выбор</li>
          </ul>
          <p class="price">299 ₽</p>
        </div>
        
        <div class="lunch-card">
          <img 
            src="../assets/image/lunch-premium.webp" 
            alt="Бизнес-ланч Премиум с десертом и напитком"
            loading="lazy"
            width="300"
            height="200"
            title="Бизнес-ланч Премиум"
          >
          <figcaption>Комплекс «Премиум» — 449 ₽</figcaption>
          <h3>«Премиум»</h3>
          <ul>
            <li>Салат из овощей</li>
            <li>Суп фирменный</li>
            <li>Горячее премиум</li>
            <li>Десерт</li>
            <li>Напиток</li>
          </ul>
          <p class="price">449 ₽</p>
        </div>
        
        <div class="lunch-card">
          <img 
            src="../assets/image/lunch-fitness.webp" 
            alt="Фитнес бизнес-ланч для здорового питания"
            loading="lazy"
            width="300"
            height="200"
            title="Фитнес бизнес-ланч"
          >
          <figcaption>Комплекс «Фитнес» — 399 ₽</figcaption>
          <h3>«Фитнес»</h3>
          <ul>
            <li>Салат зелёный</li>
            <li>Курица гриль</li>
            <li>Овощи на пару</li>
            <li>Смузи</li>
          </ul>
          <p class="price">399 ₽</p>
        </div>
      </div>
    </section>

    <section class="how-to-order">
      <h2>Как заказать доставку бизнес-ланчей</h2>
      <ol>
        <li>Выберите подходящие комплексы из <router-link to="/">меню ресторанов</router-link></li>
        <li>Укажите адрес офиса и удобное время доставки</li>
        <li>Оплатите онлайн картой или при получении наличными</li>
        <li>Получите горячий обед в назначенное время</li>
        <li>Оставьте <router-link to="/reviews">отзыв</router-link> о качестве доставки</li>
      </ol>
    </section>

    <section class="delivery-conditions">
      <h2>Условия доставки бизнес-ланчей</h2>
      <div class="conditions-grid">
        <div class="condition-item">
          <h3>Время доставки</h3>
          <p>Ежедневно с 11:00 до 16:00 в рабочие дни</p>
        </div>
        <div class="condition-item">
          <h3>Минимальный заказ</h3>
          <p>От 3-х комплексов для одного адреса</p>
        </div>
        <div class="condition-item">
          <h3>Оплата</h3>
          <p>Карта онлайн, наличные, счёт для юрлиц</p>
        </div>
      </div>
    </section>

    <section class="cta">
      <h2>Специальное предложение для компаний</h2>
      <p>
        При заказе от 5 человек — <strong>скидка 10%</strong> на первый заказ!
      </p>
      <p>
        При регулярных заказах — <strong>персональный менеджер</strong> и особые условия.
      </p>
      <div class="cta-buttons">
        <router-link to="/feedback" class="btn-primary">Оставить заявку</router-link>
        <router-link to="/" class="btn-secondary">Смотреть меню</router-link>
      </div>
    </section>

    <section class="faq">
      <h2>Частые вопросы о доставке бизнес-ланчей</h2>
      <div class="faq-list">
        <div class="faq-item">
          <h3>За сколько нужно заказывать бизнес-ланч?</h3>
          <p>Минимум за 1 час до желаемого времени доставки. При регулярных заказах — возможно составление графика на неделю.</p>
        </div>
        <div class="faq-item">
          <h3>Можно ли изменить состав комплекса?</h3>
          <p>Да, можно заменить салат или напиток на аналогичный по цене. Горячее блюдо меняется с доплатой.</p>
        </div>
        <div class="faq-item">
          <h3>Предоставляете ли вы документы для бухгалтерии?</h3>
          <p>Да, предоставляем все закрывающие документы: чеки, акты, счета для юридических лиц.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'BusinessLunchView'
}
</script>

<style scoped>
.business-lunch-page{max-width:1000px;margin:0 auto;padding:40px 20px}.condition-item,.lunch-card{background:#fff;padding:20px;text-align:center}.business-lunch-page h1{color:#78350f;font-size:2.2rem;margin-bottom:25px;text-align:center;line-height:1.3}section{margin-bottom:40px;padding:25px;background:#fffbeb;border-radius:12px;border:2px solid #fcd34d}section h2{color:#92400e;margin-bottom:20px;font-size:1.6rem}section h3{color:#78350f;margin-bottom:10px;font-size:1.2rem}.intro p{font-size:1.1rem;line-height:1.7;color:#78350f}.benefits ul{list-style:none;padding:0}.benefits li{padding:12px 0;font-size:1.05rem;color:#78350f;border-bottom:1px dashed #fcd34d}.benefits li:last-child{border-bottom:none}.lunch-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:25px;margin-top:20px}.lunch-card{border-radius:12px;border:2px solid #fcd34d;transition:transform .3s}.lunch-card:hover{transform:translateY(-5px)}.lunch-card img{width:100%;height:180px;object-fit:cover;border-radius:10px;margin-bottom:10px}.lunch-card figcaption{font-size:.9rem;color:#92400e;margin-bottom:10px;font-style:italic}.lunch-card h3{color:#78350f;margin-bottom:12px}.lunch-card ul{text-align:left;padding-left:20px;margin-bottom:15px;color:#92400e}.lunch-card li{margin-bottom:5px}.lunch-card .price{font-size:1.6rem;color:#d97706;font-weight:700;margin-top:15px}.how-to-order ol{padding-left:25px}.how-to-order li{margin-bottom:12px;color:#78350f;line-height:1.6;font-size:1.05rem}.how-to-order a{color:#000;text-decoration:none;font-weight:500}.how-to-order a:hover{text-decoration:underline}.conditions-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:20px}.condition-item{border-radius:10px;border:2px solid #fcd34d}.condition-item h3{margin-bottom:10px}.condition-item p{color:#92400e;font-size:.95rem}.cta{text-align:center;background:#fef3c7;border-color:#f59e0b}.cta h2{color:#78350f}.cta p{font-size:1.1rem;margin:12px 0;color:#92400e}.cta-buttons{display:flex;gap:15px;justify-content:center;flex-wrap:wrap;margin-top:25px}.btn-primary,.btn-secondary{padding:14px 32px;text-decoration:none;border-radius:10px;font-weight:600;display:inline-block}.btn-primary{background:#d97706;color:#fff;transition:background .3s}.btn-primary:hover{background:#b45309}.btn-secondary{background:#fff;color:#d97706;border:2px solid #d97706;transition:.3s}.btn-secondary:hover{background:#d97706;color:#fff}.faq-item{background:#fff;padding:20px;border-radius:10px;margin-bottom:15px;border:2px solid #fcd34d}.faq-item h3{margin-bottom:10px;color:#78350f}.faq-item p{color:#92400e;line-height:1.6}@media (max-width:768px){.business-lunch-page{padding:25px 15px}.business-lunch-page h1{font-size:1.6rem}section{padding:18px}section h2{font-size:1.3rem}.conditions-grid,.lunch-cards{grid-template-columns:1fr}.cta-buttons{flex-direction:column}.btn-primary,.btn-secondary{width:100%;text-align:center}}@media (min-width:769px) and (max-width:1024px){.business-lunch-page{max-width:900px}.lunch-cards{grid-template-columns:repeat(2,1fr)}}
</style>
