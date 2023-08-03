<template>
  <div class="login">
    <q-form @submit.prevent="login">
      <q-input
        v-model="user.email"
        label="Email"
        type="email"
        required
      ></q-input>
      <q-input
        v-model="user.password"
        label="Пароль"
        type="password"
        required
      ></q-input>
      <p v-if="error" class="error">{{ error }}</p>
      <q-btn color="primary" label="Войти" type="submit"></q-btn>
    </q-form>
  </div>
</template>

<script>
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
    async login() {
      try {
        const response = await this.$store.dispatch("login", this.user);
        if (response.status === 200) {
          this.$router.push("/");
        } else {
          this.error = "Неверный адрес электронной почты или пароль.";
        }
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
}

.error {
  color: red;
}
</style>
