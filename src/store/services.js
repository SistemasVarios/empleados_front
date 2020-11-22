import Axios from 'axios'
import auth from '../auth'
import { isNullOrUndefined } from 'util';

import loginService from '../services/login/LoginService'

// Para desarrollo
let baseUrl = 'http://sistemas.test:8001/empleados/public/' //base url desarrollo
let token_data = $cookies.get('token_data')

// Axios Configuration
Axios.defaults.headers.common.Accept = 'application/json'
if (token_data !== null) {
    Axios.defaults.headers.common.Authorization = `Bearer ${token_data.access_token}`
}

const instance = Axios.create();
Axios.interceptors.response.use(response => {
    return response
}, error => {
    if (error.response.status === 401) {
        var token_data = $cookies.get('token_data')
        if (isNullOrUndefined(token_data)) { return error }

        var original_request = error.config
        return refreshToken().then(res => {
            auth.saveToken(res.data)
            original_request.headers['Authorization'] = 'Bearer ' + res.data.access_token
            return Axios.request(original_request)
        })
    }

    return error
});

function refreshToken() {
    var data = auth.getRefreshToken()
    return new Promise(function(resolve, reject) {
        instance.post(baseUrl + 'oauth/token', data)
            .then(r => {
                resolve(r)
            }).catch(e => {
                reject(r)
            })
    })
}

instance.interceptors.response.use(response => {
    return response
}, error => {
    if (error.response.status === 401) {
        auth.noAcceso()
    }

    return error
});

export default {
    loginService: new loginService(Axios, baseUrl)
}