import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { store } from './store/store'
import axios from 'axios'
import { logout } from './store/slices/authSlice'

// 401 Unauthorized handle karne ke liye (jab token expire ho jaye)
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      store.dispatch(logout());
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// LocalStorage se token delete hone par automatic logout
setInterval(() => {
  const token = localStorage.getItem('token');
  const state = store.getState();
  // Agar redux state mein token hai par localStorage mein nahi, toh logout kar do
  if (state.auth.token && !token) {
    store.dispatch(logout());
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }
}, 2000);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
