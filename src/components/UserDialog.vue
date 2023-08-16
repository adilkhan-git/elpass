<template lang="pug">
q-dialog(v-model="dialogVisible" @hide="handleHide" @keyup.enter="save")
          q-card.dialog
            q-card-section
              div.text-h6 {{ isEditMode ? $t('editUser') : $t('addUser') }}
            q-card-section
              q-input(filled v-model="localUser.firstName" :label="$t('firstName')" required)
              q-input(filled v-model="localUser.lastName" :label="$t('lastName')" required)
              q-input(filled v-model="localUser.email" :label="$t('email')" required)
              q-input(filled v-model="localUser.position" :label="$t('positionTitle')" required)
              q-input(filled v-model="localUser.role" :label="$t('role')" required)
              q-input(filled v-model="localUser.phoneNumber" :label="$t('phoneNumber')" required)
              q-input(type="password" filled v-model="localUser.password" :label="$t('password')" required)
      
            q-card-actions(align="right")
              q-btn(flat :label="$t('cancel')" color="primary" @click="cancel")
              q-btn(flat :label="isEditMode ? $t('edit') : $t('save')" color="primary" :disabled="!canSave" @click="save")
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
        this.isEditMode = val && val.id !== undefined;
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    handleHide() {
      this.$emit("update:show", false);
    },
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
