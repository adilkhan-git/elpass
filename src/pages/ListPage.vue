<template>
  <q-page>
    <h4>{{ $t("listsPage.lists") }}</h4>
    <q-table
      :rows="lists"
      row-key="id"
      :columns="translatedColumns"
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
          label: "listName",
          align: "left",
          field: (row) => row.name,
        },
        {
          name: "date",
          required: true,
          label: "creationDate",
          align: "left",
          field: (row) => row.date,
        },
        {
          name: "upload",
          required: true,
          label: "upload",
          align: "left",
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
    ...mapState(["lists"]),
    translatedColumns() {
      return this.columns.map((column) => ({
        ...column,
        label: this.$t(`listsPage.${column.label}`),
      }));
    },
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
          title: this.$t("listsPage.confirmTitle"),
          message: this.$t("listsPage.confirmMessage"),
          ok: {
            label: this.$t("listsPage.confirmDelete"),
            color: "negative",
          },
          cancel: {
            label: this.$t("listsPage.confirmCancel"),
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
            message: this.$t("listsPage.deleteSuccess"),
          });
        })
        .catch(() => {
          this.$q.notify({
            color: "red-5",
            textColor: "white",
            icon: "error",
            message: this.$t("listsPage.deleteError"),
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
