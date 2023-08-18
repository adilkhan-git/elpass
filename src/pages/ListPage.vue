<template>
  <q-page>
    <h4>{{ $t("listsPage.lists") }}</h4>
    <q-btn v-if="isAdmin" label="Add List" @click="addList" />
    <q-table
      :rows="lists"
      row-key="id"
      :columns="translatedColumns"
      virtual-scroll
      v-model:pagination="pagination"
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            v-if="isAdmin"
            icon="edit"
            flat
            round
            @click="editList(props.row.id)"
          />
          <q-btn
            v-if="isAdmin"
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
    <list-dialog
      :initial-list="selectedList"
      :is-edit="isEdit"
      v-if="dialogShown"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />
  </q-page>
</template>

<script>
import { mapState, mapActions } from "vuex";
import ListDialog from "src/components/ListDialog.vue";

export default {
  components: {
    ListDialog,
  },
  data() {
    return {
      dialogShown: false,
      isEdit: false,
      selectedList: null,
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
    ...mapState(["lists", "user"]),
    isAdmin() {
      return this.user && this.user.role === "admin";
    },
    isOperator() {
      return this.user && this.user.role === "operator";
    },
    isEmployee() {
      return this.user && this.user.role === "employee";
    },
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
    ...mapActions(["fetchLists", "deleteList", "editList"]),
    addList() {
      this.selectedList = { id: null, name: "", date: "" };
      this.isEdit = false;
      this.dialogShown = true;
    },
    editList(id) {
      const list = this.lists.find((item) => item.id === id);
      this.selectedList = Object.assign({}, list);
      this.isEdit = true;
      this.dialogShown = true;
    },
    handleConfirm(list) {
      console.log("Data received from dialog:", list);
      this.dialogShown = false;
      if (this.isEdit) {
        this.editList(list);
      } else {
        // logic for adding a new list
      }
      this.fetchLists();
    },
    handleCancel() {
      this.dialogShown = false;
    },

    async editListInStore(list) {
      try {
        await this.editList(list);
        await this.fetchLists();
        // Показать уведомление об успешном редактировании
      } catch (error) {
        // Обработать ошибку и показать уведомление
      }
    },
    async addListToStore(list) {
      try {
        // Реализовать метод добавления списка в хранилище
        await this.fetchLists();
        // Показать уведомление о успешном добавлении
      } catch (error) {
        // Обработать ошибку и показать уведомление
      }
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
