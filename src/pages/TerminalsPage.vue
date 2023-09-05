<template lang="pug">
q-page.q-pa-lg
  h4 {{ $t("terminalsTitle") }}
  q-btn(
    color="primary",
    :label="$t('addTerminalButton')",
    @click="openDialogForAddTerminal"
  )

  q-table(
    :rows="terminals",
    row-key="id",
    virtual-scroll,
    flat,
    bordered,
    v-model:pagination="pagination",
    :columns="tableColumns"
  )
    template(v-slot:body-cell-status="props")
      q-td(:props="props")
        span(:class="statusClass(props.row.online)") {{ statusText(props.row.online) }}

    template(v-slot:body-cell-actions="props")
      q-td(:props="props")
        q-btn(
          icon="edit",
          flat,
          round,
          dense,
          @click="editTerminal(props.row.id)"
        )
        q-btn(
          icon="delete",
          flat,
          round,
          dense,
          @click="handleDelete(props.row.id)"
        )

  terminal-dialog(
    v-model="isDialogVisible",
    @added="fetchTerminals",
    @closeDialog="closeDialog",
    ref="terminalDialog"
  )
</template>

<script>
import { mapState, mapActions } from "vuex";
import TerminalDialog from "../components/TerminalDialog.vue";

export default {
  components: {
    TerminalDialog,
  },
  data() {
    return {
      isDialogVisible: false,
      pagination: {
        rowsPerPage: 10,
      },
      tableColumns: [
        {
          name: "name",
          label: "Name",
          align: "left",
          field: (row) => row.name,
        },
        { name: "url", label: "URL", align: "left", field: (row) => row.url },
        {
          name: "type",
          label: "Type",
          align: "left",
          field: (row) => row.meta_.direction,
        },
        {
          name: "status",
          label: "Status",
          align: "left",
          field: (row) => (row.online ? "Онлайн" : "Оффлайн"),
        },
        { name: "actions", label: "Actions", align: "left" },
      ],
    };
  },
  computed: {
    ...mapState(["terminals"]),
  },
  mounted() {
    this.fetchTerminals();
  },
  methods: {
    ...mapActions(["fetchTerminals", "deleteTerminal"]),
    closeDialog() {
      this.isDialogVisible = false;
    },
    openDialogForAddTerminal() {
      this.isDialogVisible = true;
      this.$refs.terminalDialog.openForAdd();
    },
    editTerminal(id) {
      const terminal = this.terminals.find((terminal) => terminal.id === id);
      if (terminal) {
        this.isDialogVisible = true;
        this.$refs.terminalDialog.openForEdit(terminal);
      }
    },
    handleDelete(id) {
      this.$q
        .dialog({
          title: "Подтверждение",
          message: "Вы действительно хотите удалить этот терминал?",
          ok: {
            label: "Да",
            color: "negative",
          },
          cancel: { label: "Отмена" },
          persistent: true,
        })
        .onOk(() => {
          this.deleteTerminal(id)
            .then(() => {
              this.$q.notify({
                type: "positive",
                message: "Терминал успешно удален!",
              });
              this.fetchTerminals();
            })
            .catch(() => {
              this.$q.notify({
                type: "negative",
                message: "Ошибка при удалении терминала.",
              });
            });
        });
    },
    statusClass(online) {
      return online ? "text-green-6" : "text-red";
    },
    statusText(online) {
      return online ? "Онлайн" : "Оффлайн";
    },
  },
};
</script>

<style scoped></style>
