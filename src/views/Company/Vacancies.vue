<template>
  <div class="vacancies">
    <div class="page-header">
      <h1>Открытые вакансии</h1>
      <p class="subtitle">Найдите свою идеальную позицию в нашей команде</p>
    </div>

    <div class="filters">
      <select v-model="filterDepartment" class="filter-select">
        <option value="">Все отделы</option>
        <option value="kitchen">Кухня</option>
        <option value="delivery">Доставка</option>
        <option value="office">Офис</option>
        <option value="support">Поддержка</option>
      </select>
      <select v-model="filterType" class="filter-select">
        <option value="">Все типы</option>
        <option value="full">Полная занятость</option>
        <option value="part">Частичная занятость</option>
        <option value="remote">Удалённо</option>
      </select>
    </div>

    <div class="vacancies-list">
      <div v-for="vacancy in filteredVacancies" :key="vacancy.id" class="vacancy-card">
        <div class="vacancy-header">
          <h3>{{ vacancy.title }}</h3>
          <span class="vacancy-salary">{{ vacancy.salary }}</span>
        </div>
        <div class="vacancy-info">
          <span class="tag">{{ vacancy.department }}</span>
          <span class="tag">{{ vacancy.type }}</span>
          <span class="tag">{{ vacancy.city }}</span>
        </div>
        <p class="vacancy-description">{{ vacancy.description }}</p>
        <div class="vacancy-requirements">
          <h4>Требования:</h4>
          <ul>
            <li v-for="(req, index) in vacancy.requirements" :key="index">{{ req }}</li>
          </ul>
        </div>
        <button @click="applyForVacancy(vacancy)" class="btn btn-apply">Откликнуться</button>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h3>Отклик на вакансию: {{ selectedVacancy?.title }}</h3>
        <form @submit.prevent="submitApplication">
          <input type="text" v-model="application.name" placeholder="Ваше имя" required class="form-input">
          <input type="email" v-model="application.email" placeholder="Email" required class="form-input">
          <input type="tel" v-model="application.phone" placeholder="Телефон" required class="form-input">
          <textarea v-model="application.coverLetter" placeholder="Сопроводительное письмо" rows="4" class="form-input"></textarea>
          <div class="modal-actions">
            <button type="submit" class="btn btn-submit">Отправить</button>
            <button type="button" @click="closeModal" class="btn btn-cancel">Отмена</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Vacancies',
  data() {
    return {
      filterDepartment: '',
      filterType: '',
      showModal: false,
      selectedVacancy: null,
      application: {
        name: '',
        email: '',
        phone: '',
        coverLetter: ''
      },
      vacancies: [
        {
          id: 1,
          title: 'Оператор поддержки',
          salary: 'от 45 000 ₽',
          department: 'Поддержка',
          type: 'Полная занятость',
          city: 'Удалённо',
          description: 'Обработка входящих запросов клиентов, решение проблемных ситуаций.',
          requirements: ['Грамотная речь', 'Опыт в поддержке от 1 года', 'Стрессоустойчивость']
        },
        {
          id: 2,
          title: 'Frontend-разработчик',
          salary: 'от 150 000 ₽',
          department: 'Офис',
          type: 'Удалённо',
          city: 'Удалённо',
          description: 'Разработка и поддержка клиентской части приложения.',
          requirements: ['Vue.js 3+', 'TypeScript', 'Опыт от 3 лет']
        },
      ]
    }
  },
  computed: {
    filteredVacancies() {
      return this.vacancies.filter(v => {
        const deptMatch = !this.filterDepartment || 
          (this.filterDepartment === 'kitchen' && v.department === 'Кухня') ||
          (this.filterDepartment === 'delivery' && v.department === 'Доставка') ||
          (this.filterDepartment === 'office' && v.department === 'Офис') ||
          (this.filterDepartment === 'support' && v.department === 'Поддержка')
        
        const typeMatch = !this.filterType ||
          (this.filterType === 'full' && v.type === 'Полная занятость') ||
          (this.filterType === 'part' && v.type === 'Частичная занятость') ||
          (this.filterType === 'remote' && v.type === 'Удалённо')
        
        return deptMatch && typeMatch
      })
    }
  },
  methods: {
    applyForVacancy(vacancy) {
      this.selectedVacancy = vacancy
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
      this.selectedVacancy = null
      this.application = { name: '', email: '', phone: '', coverLetter: '' }
    },
    submitApplication() {
      console.log('Отправка заявки:', this.application)
      alert('Ваша заявка отправлена! Мы свяжемся с вами в ближайшее время.')
      this.closeModal()
    }
  }
}
</script>

<style scoped>
.vacancies {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
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

.filters {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  justify-content: center;
}

.filter-select {
  padding: 12px 20px;
  border: 2px solid #D97706;
  border-radius: 8px;
  background: #FEF3C7;
  color: #78350F;
  font-size: 1rem;
  cursor: pointer;
}

.vacancies-list {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.vacancy-card {
  background: #FEF3C7;
  padding: 30px;
  border-radius: 12px;
  border: 2px solid #D97706;
}

.vacancy-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.vacancy-header h3 {
  color: #78350F;
  font-size: 1.4rem;
}

.vacancy-salary {
  color: #92400E;
  font-weight: bold;
  font-size: 1.2rem;
}

.vacancy-info {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.tag {
  background: #92400E;
  color: #FEF3C7;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
}

.vacancy-description {
  color: #92400E;
  margin-bottom: 20px;
  line-height: 1.6;
}

.vacancy-requirements {
  margin-bottom: 20px;
}

.vacancy-requirements h4 {
  color: #78350F;
  margin-bottom: 10px;
}

.vacancy-requirements ul {
  list-style: disc;
  margin-left: 20px;
  color: #92400E;
}

.vacancy-requirements li {
  margin-bottom: 5px;
}

.btn-apply {
  background: #D97706;
  color: white;
  padding: 12px 30px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s;
}

.btn-apply:hover {
  background: #B45309;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-content {
  background: #FEF3C7;
  padding: 30px;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  border: 2px solid #D97706;
}

.modal-content h3 {
  color: #78350F;
  margin-bottom: 20px;
}

.form-input {
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: 2px solid #D97706;
  border-radius: 8px;
  background: #FFFBEB;
  color: #78350F;
  font-size: 1rem;
}

.modal-actions {
  display: flex;
  gap: 15px;
}

.btn-submit {
  flex: 1;
  background: #D97706;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.btn-cancel {
  flex: 1;
  background: #DC2626;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

@media (max-width: 767px) {
  .page-header h1 {
    font-size: 2rem;
  }
  
  .filters {
    flex-direction: column;
  }
  
  .vacancy-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .vacancy-info {
    flex-wrap: wrap;
  }
  
  .modal-content {
    margin: 20px;
    padding: 20px;
  }
}
</style>