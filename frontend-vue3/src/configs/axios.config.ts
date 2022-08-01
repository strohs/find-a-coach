import axios from "axios";


const instance = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}`,
    timeout: 3000,
    // headers: {'X-Custom-Header': 'foobar'}
})

export default instance;