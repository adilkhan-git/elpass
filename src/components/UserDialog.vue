<template lang="pug">
q-dialog(v-model="dialogVisible" @keyup.enter="save")
        q-card.dialog
          q-card-section
            div.text-h6 {{ isEditMode ? "Edit User" : "Add User" }}
          q-card-section
            q-input(filled v-model="localUser.firstName" label="First Name" required)
            q-input(filled v-model="localUser.lastName" label="Last Name" required)
            q-input(filled v-model="localUser.email" label="Email" required)
            q-input(filled v-model="localUser.position" label="Position" required)
            q-input(filled v-model="localUser.role" label="Role" required)
            q-input(filled v-model="localUser.phoneNumber" label="Phone Number" required)
            q-input(type="password" filled v-model="localUser.password" label="Password" required)
    
          q-card-actions(align="right")
            q-btn(flat label="Cancel" color="primary" @click="cancel")
            q-btn(flat :label="isEditMode ? 'Edit' : 'Save'" color="primary" :disabled="!canSave" @click="save")
</template>

<script>
export default {
  props: {
    show: Boolean,
    user: Object,
  },
  data() {
    return {
      dialogVisible: this.show,
      localUser: null,
      isEditMode: false,
    };
  },
  watch: {
    show(val) {
      this.dialogVisible = val;
    },
    user: {
      handler(val) {
        this.localUser = { ...val };
        this.isEditMode = !!val;
      },
      immediate: true,
    },
  },
  methods: {
    closeDialog() {
      this.dialogVisible = false;
      this.$emit("update:show", false);
    },
    cancel() {
      this.closeDialog();
      this.resetForm();
    },
    save() {
      this.closeDialog();
      this.$emit("save", this.localUser);
      this.resetForm();
    },
    resetForm() {
      this.localUser = {
        firstName: "",
        lastName: "",
        email: "",
        position: "",
        role: "",
        phoneNumber: "",
        password: "",
      };
    },
  },
  computed: {
    canSave() {
      return (
        this.localUser.firstName &&
        this.localUser.lastName &&
        this.localUser.email &&
        this.localUser.position &&
        this.localUser.role &&
        this.localUser.phoneNumber &&
        this.localUser.password
      );
    },
  },
};
</script>

<style scoped>
.dialog {
  width: 80vw;
}
</style>
