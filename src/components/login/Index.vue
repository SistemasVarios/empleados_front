<template>
  <v-row align="center" justify="center">
    <v-overlay :value="loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-col cols="12" md="4">
      <v-list-item style="background: #444140;">
        <v-list-item-content class="text-center" style="color: white;">
          <img :src="logo" />
          <v-list-item-title class="headline">Inicio de Sesión</v-list-item-title>
          <v-list-item-subtitle style="color: white;">Sistema MRM</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-card class="elevation-12">
        <v-card-text>
          <v-form>
            <v-text-field
              type="text"
              v-model="credentials.email"
              name="correo"
              prepend-icon="mdi-account"
              data-vv-as="correo electronico"
              placeholder="Email"
              v-validate="'required|email'"
              :class="{'input':true,'has-errors': errors.has('correo')}"
            ></v-text-field>
            <FormError :attribute_name="'correo'" :errors_form="errors"></FormError>

            <v-text-field
              @keypress.enter="beforeLogin"
              type="password"
              name="contraseña"
              prepend-icon="mdi-lock"
              v-model="credentials.password"
              placeholder="Password"
              v-validate="'required|min:6'"
              :class="{'input':true,'has-errors': errors.has('contraseña')}"
            ></v-text-field>
            <FormError :attribute_name="'contraseña'" :errors_form="errors"></FormError>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="beforeLogin" x-large color="primary">INGRESAR</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import FormError from "../shared/FormError";
import auth from "../../auth";
export default {
  name: "Login",
  components: {
    FormError,
  },

  data() {
    return {
      loading: false,
      credentials: {
        email: "",
        password: "",
      },
    };
  },

  created() {
    let self = this;
  },
  methods: {
    login() {
      let self = this;
      self.loading = true;
      self.$store.state.services.loginService
        .login(self.credentials)
        .then((r) => {
          self.loading = false;
          if (self.$store.state.global.captureError(r)) {
            self.loading = false;
            return;
          }
          console.log(r.data)
          self.$store.dispatch("guardarToken", r.data);
          //auth.getUser();
          self.$router.push("/");
        })
        .catch((e) => {});
    },

    beforeLogin() {
      let self = this;
      self.$validator.validateAll().then((result) => {
        if (result) {
          self.login();
        }
      });
    },
  },

  computed: {
    logo() {
      return ""
    },
  },
};
</script>