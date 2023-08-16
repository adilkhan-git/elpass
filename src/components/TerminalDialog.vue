<template lang="pug">
q-dialog(v-model="internalDialogVisible" @keyup.enter="addAndClose")
  q-card.dialog
    q-card-section
      div.text-h6 Add Terminal
    q-card-section
      q-form(ref="dialogForm")
        q-input(filled v-model="terminal.name" label="Терминал" required)
        q-input(filled v-model="terminal.url" label="URL" required)
        q-input(filled v-model="terminal.type" label="Тип" required)
        q-input(filled v-model="terminal.status" label="Статус" required)
    q-card-actions(align="right")
      q-btn(flat label="Cancel" color="primary" @click="closeAndReset")
      q-btn(flat label="Добавить" color="primary" :disabled="!canAdd" @click="addAndClose")

</template>

<script>
import { mapActions } from "vuex";

export default {
  props: {
    value: Boolean,
  },
  data() {
    return {
      internalDialogVisible: this.value,
      terminal: {
        name: "",
        url: "",
        type: "",
        status: "",
      },
      editMode: false,
    };
  },
  watch: {
    value(val) {
      this.internalDialogVisible = val;
    },
  },
  methods: {
    ...mapActions(["updateTerminal", "addTerminal"]),

    closeAndReset() {
      this.resetValidation();
      this.clear();
      this.editMode = false; 
      this.closeDialog();
    },
    openForEdit(terminal) {
      this.editMode = true;
      this.internalDialogVisible = true;
      this.terminal = { ...terminal };
    },

    addAndClose() {
      const action = this.editMode ? "updateTerminal" : "addTerminal";
      this.$store
        .dispatch(action, this.terminal)
        .then(() => {
          this.$q.notify({
            type: "positive",
            message: this.editMode
              ? "Терминал успешно обновлен!"
              : "Терминал успешно добавлен!",
          });
          this.editMode = false; 
          this.closeAndReset();
        })
        .catch((error) => {
          console.error(
            `Ошибка при ${
              this.editMode ? "обновлении" : "добавлении"
            } терминала:`,
            error
          );
          this.$q.notify({
            type: "negative",
            message: `Ошибка при ${
              this.editMode ? "обновлении" : "добавлении"
            } терминала: ${error.message}`,
          });
        });
    },

    resetValidation() {
      this.$refs.dialogForm.resetValidation();
    },
    clear() {
      this.terminal = {
        name: "",
        url: "",
        type: "",
        status: "",
      };
    },
    closeDialog() {
      this.$emit("closeDialog");
      this.internalDialogVisible = false;
    },
  },
  computed: {
    canAdd() {
      return (
        this.terminal.name &&
        this.terminal.url &&
        this.terminal.type &&
        this.terminal.status
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
