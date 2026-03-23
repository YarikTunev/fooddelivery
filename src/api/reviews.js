import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'https://fooddelivery.s99220rx.beget.tech/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const reviewsApi = {
  getReviews(params = {}) {
    return api.get('/reviews', { params });
  },
  
  getStats() {
    return api.get('/reviews/stats');
  },
  
  createReview(data) {
    return api.post('/reviews', data);
  },
  
  updateReview(id, data) {
    return api.put(`/reviews/${id}`, data);
  },
  
  deleteReview(id) {
    return api.delete(`/reviews/${id}`);
  },
  
  toggleHelpful(id) {
    return api.post(`/reviews/${id}/helpful`);
  },
  
  getRestaurants() {
    return api.get('/restaurants?limit=50&active=1');
  }
};

export default reviewsApi;
