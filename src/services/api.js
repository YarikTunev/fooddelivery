const API_URL = '/api/'

function getHeaders() {
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

export async function apiRequest(url, options = {}) {
  const fullUrl = url.startsWith('http') ? url : `${API_URL}${url}`
  
  const response = await fetch(fullUrl, {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers
    },
    credentials: 'include'
  })
  
  if (response.status === 401) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.dispatchEvent(new Event('userLoggedOut'))
    window.location.href = '/login'
    throw new Error('Unauthorized')
  }
  
  return response
}

export default apiRequest