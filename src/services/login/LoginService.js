class LoginService {
    axios
    baseUrl

    constructor(axios,baseUrl) {
        this.axios = axios
        this.baseUrl = baseUrl + 'seguridad/autenticacion'
    }

    login(credentials) {
        let self = this
        return self.axios.post(`${self.baseUrl}/login`,credentials)
    }

    logout() {
        let self = this
        return self.axios.get(`${self.baseUrl}/logout`)
    }
}

export default LoginService