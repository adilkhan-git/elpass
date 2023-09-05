<template lang="pug">
q-page.q-pa-lg
  h4 {{ $t("listsPage.lists") }}
  q-btn(v-if="isAdmin", label="Add List", @click="showEditDialog")
  q-table(
    :rows="lists",
    row-key="code",
    :columns="columns",
    virtual-scroll,
    v-model:pagination="pagination"
  )
    template(v-slot:body-cell-name="props")
      q-td(:props="props")
        div {{ props.row.name }}
        small {{ props.row.note }}

    template(v-slot:body-cell-date="props")
      q-td(:props="props")
        div {{ formatDate(props.row.created_at) }}
        small {{ formatDate(props.row.updated_at) }} Изменили

    template(v-slot:body-cell-start="props")
      q-td(:props="props") {{ formatDate(props.row.valid_from_at, true) }}

    template(v-slot:body-cell-end="props")
      q-td(:props="props") {{ formatDate(props.row.valid_to_at, true) }}

    template(v-slot:body-cell-upload="props")
      q-td(:props="props")
        div(v-if="props.row.stats_")
          span.text-yellow-9 {{ props.row.stats_.cntOk || 0 }}/{{ props.row.stats_.csv || 0 }}
            q-icon.q-ml-xs(name="folder", @click="showUploadDialog")
          span.text-black {{ props.row.stats_.cntOkBlack || 0 }}/
            q-icon.q-ml-xs(name="folder", @click="showUploadDialog")

    template(v-slot:body-cell-sync="props")
      q-td(:props="props")
        q-icon.text-yellow-9(name="sync")

    template(v-slot:body-cell-actions="props")
      q-td(:props="props")
        q-btn(
          v-if="isAdmin",
          icon="edit",
          flat,
          round,
          @click="showEditDialog(props.row)"
        )
        q-btn(
          v-if="isAdmin",
          icon="delete",
          flat,
          round,
          @click="confirmDelete(props.row.code)"
        )
  list-dialog(
    v-model="uploadDialog",
    :initialList="selectedList",
    @cancel="handleDialogCancel"
  )
  batch-upload-dialog(
    :modelValue="batchUploadDialogVisible",
    @update:modelValue="batchUploadDialogVisible = $event"
  )
</template>

<script>
import { mapState, mapActions } from "vuex";
import ListDialog from "src/components/ListDialog.vue";
import BatchUploadDialog from "src/components/BatchUploadDialog.vue";
import { date } from "quasar";

export default {
  components: {
    ListDialog,
    BatchUploadDialog,
  },
  data() {
    return {
      uploadDialog: false,
      selectedList: {
        id: null,
        name: "",
        date: "",
      },
      batchUploadDialogVisible: false,
      pagination: {
        rowsPerPage: 10,
      },
      columns: [
        {
          name: "name",
          label: "Наименование",
          align: "left",
          field: (row) => row.name,
        },
        { name: "date", label: "Дата создания", align: "left" },
        { name: "start", label: "Дата с", align: "left" },
        { name: "end", label: "Дата по", align: "left" },
        { name: "upload", label: "Загрузка", align: "left" },
        { name: "sync", label: "Синхронизация", align: "center" },
        { name: "actions", label: "Действия", align: "center" },
      ],
    };
  },
  computed: {
    ...mapState(["lists", "user"]),
    isAdmin() {
      return this.user?.role === "admin";
    },
    formatDate() {
      return (dateTime, withTime = false) => {
        if (withTime) {
          return date.formatDate(dateTime, "DD MMM YY HH:mm");
        }
        return date.formatDate(dateTime, "DD MMM YY");
      };
    },
  },
  mounted() {
    this.fetchLists();
  },
  methods: {
    ...mapActions(["fetchLists", "deleteList", "editList"]),
    showEditDialog(list = { id: null, name: "", date: "" }) {
      this.selectedList = { ...list };
      this.uploadDialog = true;
    },

    showUploadDialog() {
      this.batchUploadDialogVisible = true;
    },
    handleDialogCancel() {
      this.uploadDialog = false;
    },
    async handleConfirm(list) {
      try {
        if (list.id) {
          await this.editList(list);
        } else {
          await this.addList(list);
        }
        this.fetchLists();
      } catch (error) {
        console.error("Error handling list:", error);
      }
      this.uploadDialog = false;
    },
    confirmDelete(id) {
      this.$q
        .dialog({
          title: this.$t("listsPage.confirmTitle"),
          message: this.$t("listsPage.confirmMessage"),
          ok: { label: this.$t("listsPage.confirmDelete"), color: "negative" },
          cancel: {
            label: this.$t("listsPage.confirmCancel"),
            color: "primary",
          },
        })
        .onOk(() => this.handleDelete(id));
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

<style scoped></style>
