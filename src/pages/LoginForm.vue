<template lang="pug">
div.login
  q-form(@submit.prevent="loginUser")
    h5(@click="admin") Sign In
    q-input(
      v-model="user.email"
      label="Email"
      type="email"
      required
    )
    q-input(
      v-model="user.password"
      label="Пароль"
      type="password"
      required
    )
    p.error(v-if="error") {{ error }}
    q-btn(color="primary", label="Войти", type="submit")
    q-btn(color="primary", label="Регистрация", type="button", to="/register")
</template>

<script>
import { mapActions } from "vuex";
import { QInput, QBtn } from "quasar";

export default {
  name: "LoginForm",
  components: {
    QInput,
    QBtn,
  },
  data() {
    return {
      user: {
        email: "",
        password: "",
      },
      error: null,
    };
  },
  methods: {
    ...mapActions(["login"]),
    admin(){
      console.log("admin");
      this.user.email = "admin@gmail.com";
      this.user.password = "admin";
    },
    async loginUser() {
      try {
        await this.login(this.user);
        this.$router.push("/");
      } catch (error) {
        if (error.response && error.response.status === 400) {
          this.error = "Неверный адрес электронной почты или пароль.";
        } else {
          this.error = "Произошла ошибка при попытке входа.";
        }
        console.error(error);
      }
    },
  },
};
</script>

<style>

.login {
  max-width: 300px;
  margin: auto;
  padding: 20px;
  margin-top: 250px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

</style>
