<template>
  <div class="not-found">
    <div class="nf-container">
      
      <div class="nf-visual">
        <div class="error-code">
          <span class="digit digit-1">4</span>
          <span class="digit digit-2">0</span>
          <span class="digit digit-3">4</span>
        </div>
        <div class="food-illustration">
          <span class="food-icon">🍽️</span>
          <span class="food-icon floating icon-1">🍕</span>
          <span class="food-icon floating icon-2">🍔</span>
          <span class="food-icon floating icon-3">🥗</span>
        </div>
      </div>
      <div class="nf-content">
        <h1 class="nf-title">Упс! Страница не найдена</h1>
        <p class="nf-description">
          Похоже, блюдо, которое вы искали, закончилось на нашей кухне. 
          Не переживайте — у нас ещё много вкусного!
        </p>

        <div class="nf-actions">
          <router-link to="/" class="btn btn-primary btn-large">
            На главную
          </router-link>
        </div>

        <div class="nf-support">
          <p>Не получается найти нужное?</p>
          <a href="mailto:support@fooddelivery.com" class="support-link">
            Напишите в поддержку
          </a>
          <span class="support-or">или</span>
          <a href="tel:+79991234567" class="support-link">
            +7 (999) 123-45-67
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
  data() {
    return {
      searchQuery: ''
    }
  },
  computed: {
    isAuthenticated() {
      const user = JSON.parse(localStorage.getItem('user') || 'null')
      return user !== null
    }
  },
  methods: {
    handleSearch() {
      if (this.searchQuery.trim()) {
        this.$router.push({ path: '/search', query: { q: this.searchQuery } })
      }
    }
  },
  mounted() {
    document.title = '404 — Страница не найдена | FoodDelivery'
  },
  beforeUnmount() {
    document.title = 'FoodDelivery'
  }
}
</script>

<style scoped>
.digit,.food-icon,.nf-container,.nf-visual,.not-found{position:relative}.btn,.link-item{transition:.3s;text-decoration:none}.btn,.link-item,.support-link{text-decoration:none}.not-found{display:flex;align-items:center;justify-content:center;padding:40px 20px;overflow:hidden}.error-code,.food-illustration{justify-content:center;display:flex}.nf-container{max-width:900px;width:100%;text-align:center;z-index:2}.nf-visual{margin-bottom:30px}.error-code{gap:10px;margin-bottom:20px}.digit{font-size:8rem;font-weight:900;color:transparent;-webkit-text-stroke:3px #92400E;line-height:1;animation:2s ease-in-out infinite pulse}@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}.food-illustration{position:relative;height:120px;align-items:center}.food-icon{font-size:4rem}.floating{position:absolute;animation:3s ease-in-out infinite float;opacity:.8}.icon-1{top:-20px;left:-40px;animation-delay:0s;font-size:2.5rem}.icon-2{top:10px;right:-50px;animation-delay:1s;font-size:2rem}.icon-3{bottom:-10px;left:50%;animation-delay:2s;font-size:2.2rem}@keyframes float{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-15px) rotate(5deg)}}.nf-content{background:rgba(255,255,255,.6);backdrop-filter:blur(10px);padding:40px;border-radius:24px;border:2px solid #d97706;box-shadow:0 10px 40px rgba(120,53,15,.15)}.nf-title{font-size:2rem;color:#78350f;margin-bottom:15px;font-weight:700}.nf-description{font-size:1.1rem;color:#92400e;margin-bottom:30px;line-height:1.6;max-width:600px;margin-left:auto;margin-right:auto}.nf-actions{display:flex;gap:15px;justify-content:center;margin-bottom:35px;flex-wrap:wrap}.btn{padding:14px 28px;border:none;border-radius:12px;cursor:pointer;font-weight:600;font-size:1rem;display:inline-flex;align-items:center;gap:8px}.btn-large{padding:16px 32px;font-size:1.05rem}.btn-primary{background:#d97706;color:#fff}.btn-primary:hover{background:#b45309;transform:translateY(-2px);box-shadow:0 5px 20px rgba(217,119,6,.4)}.btn-secondary:hover,.link-item:hover{background:#fde68a;transform:translateY(-2px)}.btn-secondary{background:#fef3c7;color:#78350f;border:2px solid #d97706}.btn-secondary:hover{box-shadow:0 5px 20px rgba(217,119,6,.2)}.nf-links{margin-bottom:30px}.links-label{color:#78350f;font-weight:500;margin-bottom:15px;font-size:.95rem}.links-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;justify-content:center}.link-item{background:#fef3c7;color:#78350f;padding:12px 16px;border-radius:10px;font-size:.9rem;font-weight:500;border:1px solid transparent}.link-item:hover{border-color:#d97706}.nf-support{padding-top:25px;border-top:2px dashed rgba(146,64,14,.3)}.nf-support p{color:#78350f;margin-bottom:12px;font-size:.95rem}.support-link{color:#92400e;font-weight:600;margin:0 8px;transition:color .3s}.support-link:hover{color:#d97706;text-decoration:underline}.support-or{color:#92400e;opacity:.6;margin:0 5px}.nf-decoration{position:absolute;top:0;left:0;right:0;bottom:0;pointer-events:none;z-index:1}@media (max-width:991px){.digit{font-size:6rem}.food-icon{font-size:3rem}.icon-1{left:-30px;font-size:2rem}.icon-2{right:-40px;font-size:1.8rem}.nf-content{padding:30px 25px}.links-grid{grid-template-columns:repeat(2,1fr)}}@media (max-width:767px){.nf-actions,.search-form{flex-direction:column}.btn-large,.btn-search{width:100%}.not-found{padding:20px 15px}.digit{font-size:4.5rem}.food-illustration{height:100px}.food-icon{font-size:2.5rem}.floating,.support-or{display:none}.nf-title{font-size:1.6rem}.nf-description{font-size:1rem}.nf-actions{align-items:center}.btn-large{max-width:300px;justify-content:center}.links-grid{grid-template-columns:1fr}.nf-support{display:flex;flex-direction:column;align-items:center;gap:8px}}@media (max-width:479px){.digit{font-size:3.5rem}.nf-content{padding:25px 20px;border-radius:20px}.nf-title{font-size:1.4rem}.btn,.nf-description,.search-input{font-size:.95rem}.search-input{padding:12px 16px}.btn{padding:12px 24px}.link-item{padding:10px 14px;font-size:.85rem}.deco-1,.deco-2{display:none}}@media (min-width:1600px){.digit{font-size:10rem}.food-icon{font-size:5rem}.nf-content{padding:50px}.nf-title{font-size:2.3rem}}@media (min-width:1920px){.digit{font-size:12rem}.nf-container{max-width:1100px}}
</style>