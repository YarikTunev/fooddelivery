<template>
  <div class="admin-section">
    <h1>Управление пользователями</h1>
    
    <div v-if="loading && users.length === 0" class="loading">Загрузка...</div>
    
    <div v-else-if="error" class="error-message">
      <p>⚠️ {{ error }}</p>
      <button @click="loadUsers" class="btn-retry">Попробовать снова</button>
    </div>
    
    <div v-else-if="users.length === 0" class="empty">
      <p>📭 Нет пользователей</p>
    </div>
    
    <table v-else class="users-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Имя</th>
          <th>Email</th>
          <th>Роль</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id" :class="{ 'current-user': user.id === currentUserId }">
          <td>{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>
            <select 
              v-model="user.role" 
              @change="updateRole(user)" 
              class="role-select"
              :disabled="updatingUserId === user.id"
            >
              <option value="client">Клиент</option>
              <option value="admin">Админ</option>
            </select>
          </td>
          <td>
            <button 
              @click="deleteUser(user)" 
              class="btn btn-delete"
              :disabled="user.id === currentUserId"
              :title="user.id === currentUserId ? 'Нельзя удалить себя' : 'Удалить'"
            >
              {{ user.id === currentUserId ? '—' : 'Удалить' }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'AdminUsers',
  data() {
    return {
      users: [],
      loading: false,
      error: null,
      updatingUserId: null,
      API_URL: 'http://fooddelivery.s99220rx.beget.tech/api'
    }
  },
  computed: {
    currentUserId() {
      try {
        const user = JSON.parse(localStorage.getItem('user') || 'null')
        return user?.id
      } catch {
        return null
      }
    }
  },
  created() {
    this.loadUsers()
  },
  methods: {
    async loadUsers() {
      this.loading = true
      this.error = null

      try {
        const token = localStorage.getItem('token')
        const url = `${this.API_URL}/users`

        const res = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        })

        if (!res.ok) {
          if (res.status === 401) throw new Error('Требуется авторизация')
          if (res.status === 403) throw new Error('Доступ запрещён. Требуются права супер‑администратора')
          const errorData = await res.json().catch(() => ({}))
          throw new Error(errorData.message || `HTTP ${res.status}: ${res.statusText}`)
        }

        const data = await res.json()
        this.users = Array.isArray(data?.data) ? data.data :
          Array.isArray(data) ? data : []
      } catch (e) {
        console.error('Ошибка загрузки пользователей:', e)
        if (e.message.includes('Failed to fetch')) {
          this.error = 'Не удалось соединиться с сервером. Проверьте интернет и настройки CORS.'
        } else {
          this.error = e.message || 'Ошибка при загрузке пользователей'
        }
      } finally {
        this.loading = false
      }
    },

    async updateRole(user) {
      const originalRole = user.role

      try {
        const token = localStorage.getItem('token')
        this.updatingUserId = user.id

        const url = `${this.API_URL}/users/${user.id}`
        const res = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ role: user.role })
        })

        if (!res.ok) {
          if (res.status === 401) throw new Error('Требуется авторизация')
          if (res.status === 403) throw new Error('Нет прав для изменения роли')
          if (res.status === 422) {
            const errorData = await res.json().catch(() => ({}))
            const firstError = Object.values(errorData.errors || {})[0]?.[0]
            throw new Error(firstError || 'Ошибка валидации')
          }
          const errorData = await res.json().catch(() => ({}))
          throw new Error(errorData.message || `HTTP ${res.status}`)
        }

        const data = await res.json()
        if (data?.data) {
          const index = this.users.findIndex(u => u.id === user.id)
          if (index !== -1) {
            this.users[index] = { ...this.users[index], ...data.data }
          }
        }
        alert('Роль обновлена!')
      } catch (e) {
        console.error('Ошибка обновления роли:', e)
        user.role = originalRole
        if (e.message.includes('Failed to fetch')) {
          alert('Не удалось соединиться с сервером. Проверьте интернет и настройки CORS.')
        } else {
          alert('Ошибка: ' + e.message)
        }
      } finally {
        this.updatingUserId = null
      }
    },

    async deleteUser(user) {
      if (user.id === this.currentUserId) {
        alert('Нельзя удалить самого себя')
        return
      }

      if (!confirm(`Удалить пользователя "${user.name}"?`)) return

      try {
        const token = localStorage.getItem('token')
        const url = `${this.API_URL}/users/${user.id}`

        const res = await fetch(url, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        })

        if (!res.ok) {
          if (res.status === 401) throw new Error('Требуется авторизация')
          if (res.status === 403) throw new Error('Нет прав для удаления пользователя')
          const errorData = await res.json().catch(() => ({}))
          throw new Error(errorData.message || `HTTP ${res.status}`)
        }

        this.users = this.users.filter(u => u.id !== user.id)
        alert('Пользователь удалён!')
      } catch (e) {
        console.error('Ошибка удаления:', e)
        if (e.message.includes('Failed to fetch')) {
          alert('Не удалось соединиться с сервером. Проверьте интернет и настройки CORS.')
        } else {
          alert('Ошибка при удалении: ' + e.message)
        }
      }
    }
  }
}
</script>


<style scoped>
.admin-section {
  max-width: 1400px;
  margin: 0 auto;
}

.admin-section h1 {
  color: #78350F;
  font-size: 2rem;
  margin-bottom: 30px;
}

.loading,
.error-message,
.empty {
  text-align: center;
  color: #92400E;
  font-size: 1.3rem;
  padding: 60px;
  background: #FFFBEB;
  border: 2px solid #FCD34D;
  border-radius: 15px;
}

.error-message {
  background: #FEF2F2;
  border-color: #FCA5A5;
  color: #DC2626;
}

.btn-retry {
  margin-top: 20px;
  padding: 10px 25px;
  background: #D97706;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.btn-retry:hover {
  background: #B45309;
}

.users-table {
  width: 100%;
  background: #FFFBEB;
  border: 2px solid #FCD34D;
  border-radius: 15px;
  overflow: hidden;
}

.users-table th,
.users-table td {
  padding: 18px 20px;
  text-align: left;
  border-bottom: 2px solid #FCD34D;
  color: #92400E;
}

.users-table th {
  background: #D97706;
  color: #ffffff;
  font-weight: 600;
  font-size: 1rem;
}

.users-table tr:last-child td {
  border-bottom: none;
}

.users-table tr:hover {
  background: #FDE68A;
}

.users-table tr.current-user {
  background: #FEF3C7;
  font-weight: 500;
}

.role-select {
  padding: 8px 14px;
  background: #FFFBEB;
  border: 2px solid #FCD34D;
  border-radius: 10px;
  color: #78350F;
  font-weight: 600;
  cursor: pointer;
}

.role-select:focus {
  outline: none;
  border-color: #D97706;
}

.role-select:disabled {
  opacity: 0.6;
  cursor: wait;
}

.btn-delete {
  background: #DC2626;
  color: #ffffff;
  border: none;
  padding: 10px 18px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s;
}

.btn-delete:hover:not(:disabled) {
  background: #B91C1C;
}

.btn-delete:disabled {
  background: #9CA3AF;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .users-table {
    font-size: 0.9rem;
  }
  
  .users-table th,
  .users-table td {
    padding: 12px 15px;
  }
  
  .users-table {
    display: block;
    overflow-x: auto;
  }
}
</style>