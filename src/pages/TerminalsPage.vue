<template>
  <q-page>
    <h4>Терминалы</h4>
    <q-btn
      color="primary"
      label="Добавить терминал"
      @click="showAddTerminalDialog"
    />

    <q-table
      :rows="terminals"
      row-key="id"
      :columns="columns"
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
    ></terminal-dialog>
  </q-page>
</template>

<script>
import { mapState, mapActions } from "vuex";
import TerminalDialog from "../components/TerminalDialog.vue"

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
          name: "name",
          required: true,
          label: "Терминал",
          align: "left",
          field: (row) => row.name,
        },
        {
          name: "url",
          required: true,
          label: "URL",
          align: "left",
          field: (row) => row.url,
        },
        {
          name: "type",
          required: true,
          label: "Тип",
          align: "left",
          field: (row) => row.type,
        },
        {
          name: "status",
          required: true,
          label: "Статус",
          align: "left",
          field: (row) => row.status,
        },
        {
          name: "actions",
          label: "Действия",
          align: "left",
        },
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
    showAddTerminalDialog() {
      this.isDialogVisible = true;
    },
    editTerminal(id) {
      // TODO: логика редактирования терминала
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
.q-page {
  padding: 25px;
}
</style>
