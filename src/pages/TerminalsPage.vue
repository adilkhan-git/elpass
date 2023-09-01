<template>
  <q-page>
    <h4>{{ $t("terminalsTitle") }}</h4>
    <q-btn
      color="primary"
      :label="$t('addTerminalButton')"
      @click="openDialogForAddTerminal"
    />

    <q-table
      :rows="terminals"
      row-key="id"
      :columns="translatedColumns"
      virtual-scroll
      v-model:pagination="pagination"
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn icon="edit" flat round @click="editTerminal(props.row.id)" />
          <q-btn icon="delete" flat round @click="handleDelete(props.row.id)" />
        </q-td>
      </template>
    </q-table>

    <terminal-dialog
      v-model="isDialogVisible"
      @added="fetchTerminals"
      @closeDialog="closeDialog"
      ref="terminalDialog"
    ></terminal-dialog>
  </q-page>
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
      columns: [
        {
          name: "terminal",
          required: true,
          label: "terminal",
          align: "left",
          field: (row) => row.name,
        },
        {
          name: "url",
          required: true,
          label: "url",
          align: "left",
          field: (row) => row.url,
        },
        {
          name: "type",
          required: true,
          label: "type",
          align: "left",
          field: (row) => row.type,
        },
        {
          name: "status",
          required: true,
          label: "status",
          align: "left",
          field: (row) => row.status,
        },
        {
          name: "actions",
          label: "actions",
          align: "left",
        },
      ],
    };
  },
  computed: {
    ...mapState(["terminals"]),
    translatedColumns() {
      return this.columns.map((column) => ({
        ...column,
        label: this.$t(column.label),
      }));
    },
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
      console.log("openDialogForAddTerminal called");
      this.isDialogVisible = true; // Добавьте эту строку
      this.$refs.terminalDialog.openForAdd();
    },

    // showAddTerminalDialog() {
    //   this.isDialogVisible = true;
    // },
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
  },
};
</script>

<style scoped>

</style>
