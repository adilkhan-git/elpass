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
          <q-btn
            icon="cloud_upload"
            color="orange"
            flat
            round
            @click="openUploadDialog"
          />
          <q-btn
            icon="block"
            color="black"
            flat
            round
            @click="openBlockDialog"
          />
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
    <q-dialog v-model="uploadDialog">
      <q-card>
        <q-card-section>
          <q-tabs v-model="tab" align="justify">
            <q-tab name="csv" label="CSV" />
            <q-tab name="zip" label="ZIP" />
          </q-tabs>

          <q-tab-panels v-model="tab">
            <q-tab-panel name="csv">
              <q-file
                v-model="csvFiles"
                label="Choose CSV files"
                accept=".csv"
                multiple
              />
              <q-btn label="Upload CSV" @click="uploadCSV" />
            </q-tab-panel>
            <q-tab-panel name="zip">
              <q-file
                v-model="zipFiles"
                label="Choose ZIP files"
                accept=".zip"
                multiple
              />
              <q-btn label="Upload ZIP" @click="uploadZIP" />
            </q-tab-panel>
          </q-tab-panels>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Закрыть" @click="uploadDialog = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
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
      uploadDialog: false,
      tab: "csv",
      csvFiles: [],
      zipFiles: [],
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
    openUploadDialog() {
      this.uploadDialog = true;
    },
    openBlockDialog() {
      this.uploadDialog = true;
    },
    async uploadCSV() {
      // Обработка и загрузка CSV файлов
    },
    async uploadZIP() {
      // Обработка и загрузка ZIP файлов
    },
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
    async handleConfirm(list) {
      console.log("Data received from dialog:", list);
      this.dialogShown = false;
      try {
        if (this.isEdit) {
          await this.editList(list);
        } else {
          await this.addList(list);
        }
        this.fetchLists();
      } catch (error) {
        console.error("Error handling list:", error);
      }
    },
    handleCancel() {
      this.dialogShown = false;
    },

    async editListInStore(list) {
      try {
        await this.editList(list);
        await this.fetchLists();
      } catch (error) {}
    },
    async addListToStore(list) {
      try {
        await this.fetchLists();
      } catch (error) {}
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
    async handleDelete(id) {
      try {
        await this.deleteList(id);
        await this.fetchLists();
        this.$q.notify({
          color: "green-4",
          textColor: "white",
          icon: "check",
          message: this.$t("listsPage.deleteSuccess"),
        });
      } catch (error) {
        this.$q.notify({
          color: "red-5",
          textColor: "white",
          icon: "error",
          message: this.$t("listsPage.deleteError"),
        });
      }
    },
  },
};
</script>

<style scoped>

</style>
