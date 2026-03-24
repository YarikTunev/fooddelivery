<template>
  <div class="about-staff">
    <div class="page-header">
      <h1>Наша команда</h1>
      <p class="subtitle">Профессионалы, которые заботятся о вашем комфорте</p>
    </div>

    <section class="team-members-section">
      <div class="team-grid">
        <div v-for="member in teamMembers" :key="member.id" class="member-card">
          <div class="member-photo-wrapper">
            <img :src="member.photo" :alt="member.name" class="member-photo" />
            <div class="member-role-badge">{{ member.role }}</div>
          </div>
          
          <div class="member-info">
            <h3 class="member-name">{{ member.name }} {{ member.surname }}</h3>
            <p class="member-position">{{ member.position }}</p>
            
            <div class="member-expertise">
              <span class="expertise-icon"></span>
              <p>{{ member.expertise }}</p>
            </div>

            <blockquote class="member-quote">
              "{{ member.quote }}"
            </blockquote>

            <div class="member-contacts">
              <a v-if="member.email" :href="`mailto:${member.email}`" class="contact-link" title="Email">
                {{ member.email }}
              </a>
              <a v-if="member.phone" :href="`tel:${member.phone}`" class="contact-link" title="Телефон">
                {{ member.phone }}
              </a>
              <a v-if="member.telegram" :href="member.telegram" target="_blank" class="contact-link" title="Telegram">
                Telegram
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="culture-section">
      <h2>Почему нам доверяют</h2>
      <div class="culture-grid">
        <div class="culture-item">
          <h3>Постоянное обучение</h3>
          <p>Каждый сотрудник проходит сертификацию каждые 6 месяцев.</p>
        </div>
        <div class="culture-item">
          <h3>Гарантия качества</h3>
          <p>Мы несём личную ответственность за каждый заказ.</p>
        </div>
        <div class="culture-item">
          <h3>Забота о клиентах</h3>
          <p>98% наших клиентов возвращаются к нам снова.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'AboutStaff',
  data() {
    return {
      teamMembers: [
        {
          id: 2,
          name: 'Мария',
          surname: 'Иванова',
          role: 'Старший курьер',
          position: 'Логистика',
          photo: 'https://cdn.forbes.ru/forbes-static/c/1082x722/new/2021/10/TASS-48256605-6169afa00cbe0-6169afa031659.webp',
          expertise: 'Знает каждый переулок города',
          quote: 'Ваш обед будет горячим, обещаю!',
          email: 'maria.i@fooddelivery.com',
          phone: '+79991112244',
          telegram: '#'
        },
        {
          id: 3,
          name: 'Дмитрий',
          surname: 'Петров',
          role: 'Руководитель службы поддержки',
          position: 'Офис',
          photo: 'https://s0.rbk.ru/v6_top_pics/media/img/6/57/756781333421576.webp',
          expertise: 'Решил более 10,000 клиентских вопросов',
          quote: 'Мы не просто отвечаем, мы решаем проблемы.',
          email: 'support.lead@fooddelivery.com',
          phone: '+79991112255',
          telegram: '#'
        },
        {
          id: 4,
          name: 'Елена',
          surname: 'Соколова',
          role: 'Технолог',
          position: 'Контроль качества',
          photo: 'https://www.e-xecutive.ru/uploads/article/image/1990772/thumb_Irina_Travkina_executive_ru.jpg',
          expertise: 'Эксперт по санитарным нормам',
          quote: 'Безопасность и вкус — наши главные приоритеты.',
          email: 'tech@fooddelivery.com',
          phone: '+79991112266',
          telegram: '#'
        },
      ]
    }
  }
}
</script>

<style scoped>
.about-staff{max-width:1400px;margin:0 auto;padding:40px 20px}.page-header{text-align:center;margin-bottom:50px}.page-header h1{font-size:2.5rem;color:#78350f;margin-bottom:15px}.subtitle{font-size:1.2rem;color:#92400e}.team-members-section{margin-bottom:60px}.culture-grid,.team-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:30px}.member-card{background:#fef3c7;border-radius:16px;overflow:hidden;box-shadow:0 4px 15px rgba(120,53,15,.1);transition:transform .3s,box-shadow .3s;border:1px solid #d97706;display:flex;flex-direction:column}.member-card:hover{transform:translateY(-5px);box-shadow:0 10px 25px rgba(120,53,15,.2)}.member-photo-wrapper{position:relative;height:250px;overflow:hidden}.member-photo{width:100%;height:100%;object-fit:cover;transition:transform .5s}.member-card:hover .member-photo{transform:scale(1.05)}.member-role-badge{position:absolute;top:15px;right:15px;background:#92400e;color:#fef3c7;padding:5px 12px;border-radius:20px;font-size:.85rem;font-weight:600;box-shadow:0 2px 5px rgba(0,0,0,.2)}.member-info{padding:25px;flex:1;display:flex;flex-direction:column}.member-name{font-size:1.4rem;color:#78350f;margin-bottom:5px}.member-position{color:#d97706;font-weight:600;font-size:.95rem;margin-bottom:15px;text-transform:uppercase;letter-spacing:.5px}.member-expertise{background:rgba(217,119,6,.1);padding:10px;border-radius:8px;margin-bottom:15px;display:flex;align-items:flex-start;gap:10px}.expertise-icon{font-size:1.2rem}.member-expertise p{font-size:.9rem;color:#78350f;margin:0;line-height:1.4}.member-quote{font-style:italic;color:#92400e;font-size:.95rem;margin:0 0 20px;border-left:3px solid #d97706;padding-left:15px;flex:1}.member-contacts{display:flex;flex-direction:column;gap:8px;border-top:1px solid rgba(120,53,15,.1);padding-top:15px}.contact-link{font-size:.9rem;color:#78350f;text-decoration:none;transition:color .2s;display:flex;align-items:center;gap:8px}.contact-link:hover{color:#d97706;text-decoration:underline}.culture-section{background:#78350f;padding:50px 40px;border-radius:16px;color:#fef3c7}.culture-section h2{text-align:center;margin-bottom:40px;font-size:2rem;color:#fde68a}.culture-item{text-align:center;background:rgba(255,255,255,.05);padding:25px;border-radius:12px}.culture-item h3{font-size:1.3rem;margin-bottom:15px;color:#fde68a}.culture-item p{line-height:1.6;opacity:.9}@media (max-width:1200px){.team-grid{grid-template-columns:repeat(2,1fr)}}@media (max-width:991px){.team-grid{grid-template-columns:repeat(2,1fr);gap:20px}.culture-grid{grid-template-columns:1fr}}@media (max-width:767px){.page-header h1{font-size:2rem}.team-grid{grid-template-columns:1fr}.member-photo-wrapper{height:300px}.culture-section{padding:30px 20px}}@media (max-width:479px){.about-staff{padding:20px 10px}.member-info{padding:20px}.member-name{font-size:1.2rem}.member-photo-wrapper{height:250px}}
</style>