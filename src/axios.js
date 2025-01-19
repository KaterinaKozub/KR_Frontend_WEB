import axios from "axios";

// Створення екземпляра axios з базовим URL
const instance = axios.create({
    baseURL: 'http://localhost:4444', // Базовий URL для всіх запитів
});

// Додавання інтерсептора для кожного запиту
instance.interceptors.request.use((config) => {
    config.headers.Authorization = window.localStorage.getItem("token"); // Додавання токена автентифікації з локального сховища до заголовків запиту
    return config; // Повернення зміненого конфігу запиту
});


export default instance;