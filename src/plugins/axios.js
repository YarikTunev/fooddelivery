
export function getAuthHeaders() {
  const token = localStorage.getItem('token')
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  return headers
}

export async function authFetch(url, options = {}) {
  const headers = {
    ...getAuthHeaders(),
    ...options.headers
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include'
  })
  
  if (response.status === 401) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.dispatchEvent(new Event('userLoggedOut'))
    window.location.href = '/login'
  }
  
  return response
}