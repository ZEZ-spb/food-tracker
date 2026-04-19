import axios from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('email')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

export default instance