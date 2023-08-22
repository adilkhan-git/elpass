<template>
  <q-page padding>
    <q-card class="my-card">
      <q-card-section>
        <div class="text-h6">Edit Profile</div>
      </q-card-section>
      <q-card-section>
        <q-form @submit="updateUser">
          <q-input
            filled
            v-model="user.firstName"
            label="First name"
            class="q-mb-md"
          />
          <q-input
            filled
            v-model="user.lastName"
            label="Last name"
            class="q-mb-md"
          />
          <q-input
            filled
            v-model="user.position"
            label="Position"
            class="q-mb-md"
          />
          <q-input
            filled
            v-model="user.phoneNumber"
            label="Phone number"
            class="q-mb-md"
          />
          <q-input
            filled
            v-model="newPassword"
            :type="showPassword ? 'text' : 'password'"
            label="New password"
            class="q-mb-md"
          >
            <template v-slot:append>
              <q-icon
                :name="showPassword ? 'visibility' : 'visibility_off'"
                class="cursor-pointer"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>
          <q-btn label="Save" type="submit" color="primary" class="q-mt-md" />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const user = ref({ ...store.state.user });
    const newPassword = ref("");
    const showPassword = ref(false);

    const updateUser = () => {
      if (newPassword.value) {
        user.value.password = newPassword.value;
      }
      store.dispatch("updateUser", user.value);
    };

    return { user, updateUser, newPassword, showPassword };
  },
};
</script>

<style>
.my-card {
  max-width: 600px;
  margin: 0 auto;
  border-radius: 10px;

  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>
