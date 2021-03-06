import Axios from 'axios'
import router from '../router'
import store from '../store'

export default {

    data_refresh_token: {
        grant_type: 'refresh_token',
        refresh_token: '',
        client_id: '',
        cliente_secret: ''
    },

    getRefreshToken() {
        var token_data = $cookies.get('token_data')
        this.data_refresh_token.refresh_token = token_data.refresh_token
        this.data_refresh_token.client_id = store.state.client_id,
        this.data_refresh_token.client_secret = store.state.client_secret

        return this.data_refresh_token
    },

    saveToken(token) {
        store.dispatch('guardarToken', token)
    },

    noAcceso() {
        store.dispatch('logout')
        router.push('/login')
    },

    getUser() {
        store.state.services.loginService.me()
            .then(r => {
                store.dispatch('setUser', r.data)
                //this.getMenus(r.data.id)
            }).catch(e => {

            })
    },

    getMenus(id) {
        let self = this
        self.loading = true
        store.state.services.loginService
            .menu_usuario(id)
            .then(r => {
                self.loading = false
                if (r.response !== undefined) {
                    self.$toastr.error(r.response.data.error, 'error')
                    return
                }
                this.mapMenu(r.data)

            }).catch(e => {

            })
    },

    mapMenu(items) {
        var menu = []
        var permisions = []
        items.forEach(function (item) {
            permisions.push(item.menus.route_name)
            if (item.menus.father == 0 && !item.menus.hide) {
                var object = new Object
                object.icon = item.menus.icon
                object.text = item.menus.name
                object.path = item.menus.route_name
                object.childrens = []
                items.forEach(function (child, i) {
                    if (item.menus.id == child.menus.father && !child.menus.hide) {
                        var object2 = new Object()
                        object2.icon = child.menus.icon
                        object2.text = child.menus.name
                        object2.path = child.menus.route_name

                        object.childrens.push(object2)
                    }
                });
                menu.push(object)
            }
        })
        store.dispatch('setMenu', {
            items: menu,
            permissions: permisions
        }
        )
    }
}