<template lang="pug">
q-dialog(v-model="dialogVisible" @keyup.enter="addTerminal")
      q-card.dialog
        q-card-section
          div.text-h6 Add Terminal
        q-card-section
          q-input(filled v-model="terminal.name" label="Терминал" required)
          q-input(filled v-model="terminal.url" label="URL" required)
          q-input(filled v-model="terminal.type" label="Тип" required)
          q-input(filled v-model="terminal.status" label="Статус" required)
        q-card-actions(align="right")
          q-btn(flat label="Cancel" color="primary" @click="closeDialog")
          q-btn(flat label="Добавить" color="primary" :disabled="!canAdd" @click="addAndClose")
</template>

<script>
export default {
  props: {
    value: Boolean,
  },
  data() {
    return {
      dialogVisible: this.value,
      terminal: {
        name: "",
        url: "",
        type: "",
        status: "",
      },
    };
  },
  watch: {
    value(val) {
      this.dialogVisible = val;
    },
  },
  methods: {
    closeDialog() {
      this.dialogVisible = false;
      this.$emit("input", false);
    },
    addAndClose() {
      this.$store
        .dispatch("addTerminal", this.terminal)
        .then(() => {
          this.$q.notify({
            type: "positive",
            message: "Терминал успешно добавлен!",
          });
          this.closeDialog();
        })
        .catch(() => {
          this.$q.notify({
            type: "negative",
            message: "Ошибка при добавлении терминала.",
          });
        });
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
