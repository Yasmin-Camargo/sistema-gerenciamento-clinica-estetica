import axios from 'axios'

const api = axios.create({
baseURL: 'http://localhost:8080/beauty-clinic-system',
  timeout: 5000,
})

export default api
