<template lang="pug">
q-dialog(v-model="dialogVisible" @keyup.enter="save")
  q-card(class="dialog")
    q-card-section
      div.text-h6 {{ isEditMode ? "Edit Visitor" : "Add a Visitor" }}
    q-card-section
      q-input(filled v-model="localVisitor.firstName" label="First Name" required)
      q-input(filled v-model="localVisitor.lastName" label="Last Name" required)
      q-input(filled v-model="localVisitor.iin" label="ИИН" required)
      q-input(filled v-model="localVisitor.phoneNumber" label="Phone Number" required)
      q-input(filled v-model="localVisitor.company" label="Company" required)
      q-input(filled v-model="localVisitor.position" label="Position" required)
      q-select(
        filled
        v-model="localVisitor.type"
        label="Type"
        :options="['Многоразовый', 'Временный']"
        required
      )
    q-card-actions(align="right")
      q-btn(flat label="Cancel" color="primary" @click="cancel")
      q-btn(
        flat
        :label="isEditMode ? 'Edit' : 'Save'"
        color="primary"
        :disabled="!canSave"
        @click="save"
       )
</template>


<script>
export default {
  props: {
    show: Boolean,
    visitor: Object,
  },
  data() {
    return {
      dialogVisible: this.show,
      localVisitor: null,
      isEditMode: false,
    };
  },
  watch: {
    show(val) {
      this.dialogVisible = val;
    },
    visitor: {
      handler(val) {
        this.localVisitor = { ...val };
        this.isEditMode = !!val;
      },
      immediate: true,
    },
  },
  methods: {
    cancel() {
      this.dialogVisible = false;
      this.$emit("update:show", false);
      this.resetForm();
    },
    save() {
      this.dialogVisible = false;
      this.$emit("update:show", false);
      this.$emit("save", this.localVisitor);
      this.resetForm();
    },
    resetForm() {
      this.localVisitor = {
        firstName: "",
        lastName: "",
        iin: "",
        phoneNumber: "",
        company: "",
        position: "",
        type: "",
      };
    },
  },
  computed: {
    canSave() {
      return (
        this.localVisitor.firstName &&
        this.localVisitor.lastName &&
        this.localVisitor.iin &&
        this.localVisitor.phoneNumber &&
        this.localVisitor.company &&
        this.localVisitor.position &&
        this.localVisitor.type
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
