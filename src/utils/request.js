import axios from "axios"

const service = axios.create({
    baseURL: 'http://localhost:8090',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    }
})

service.interceptors.request.use(
    config => {
        config.headers.token = window.sessionStorage.getItem('token')
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

service.interceptors.response.use(
    config => {
        return config
    }
)

export default service