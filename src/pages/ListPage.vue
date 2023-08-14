<template>
  <q-page>
    <h4>Списки</h4>
    <q-table
      :rows="lists"
      row-key="id"
      :columns="columns"
      virtual-scroll
      v-model:pagination="pagination"
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn icon="edit" flat round @click="editList(props.row.id)" />
          <q-btn
            icon="delete"
            flat
            round
            @click="confirmDelete(props.row.id)"
          />
        </q-td>
      </template>

      <template v-slot:body-cell-upload="props">
        <q-td :props="props">
          <q-btn icon="cloud_upload" color="orange" flat round />
          <q-btn icon="block" color="black" flat round />
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      pagination: {
        rowsPerPage: 10,
      },
      columns: [
        {
          name: "name",
          required: true,
          label: "Наименование списка",
          align: "left",
          field: (row) => row.name,
        },
        {
          name: "date",
          required: true,
          label: "Дата создания",
          align: "left",
          field: (row) => row.date,
        },
        {
          name: "upload",
          required: true,
          label: "Загрузка",
          align: "left",
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
    ...mapState(["lists"]),
  },
  mounted() {
    this.fetchLists();
  },
  methods: {
    ...mapActions(["fetchLists", "deleteList"]),
    editList(id) {
      // логика редактирования
    },
    confirmDelete(id) {
      this.$q
        .dialog({
          title: "Подтвердите",
          message: "Вы уверены, что хотите удалить этот список?",
          ok: {
            label: "Удалить",
            color: "negative",
          },
          cancel: {
            label: "Отмена",
            color: "primary",
          },
        })
        .onOk(() => {
          this.handleDelete(id);
        });
    },
    handleDelete(id) {
      this.deleteList(id)
        .then(() => {
          this.fetchLists();
          this.$q.notify({
            color: "green-4",
            textColor: "white",
            icon: "check",
            message: "Список успешно удален",
          });
        })
        .catch(() => {
          this.$q.notify({
            color: "red-5",
            textColor: "white",
            icon: "error",
            message: "Произошла ошибка при удалении списка",
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
