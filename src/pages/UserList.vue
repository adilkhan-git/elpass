<template>
  <q-page padding>
    <h4>{{ $t("usersListTitle") }}</h4>
    <q-btn
      color="primary"
      :label="$t('addUserButton')"
      @click="openDialogForNewUser"
    />

    <q-table :rows="users" :columns="translatedColumns" row-key="id">
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            flat
            color="primary"
            icon="edit"
            @click="editUser(props.row)"
          />
          <q-btn
            flat
            color="negative"
            icon="delete"
            @click="promptDeleteUser(props.row.id)"
          />
        </q-td>
      </template>
    </q-table>

    <user-dialog
      v-model:show="editDialog"
      :user="editedUser"
      @save="onUserSave"
    />
  </q-page>
</template>

<script>
import { mapState, mapActions } from "vuex";
import UserDialog from "../components/UserDialog.vue";

export default {
  name: "UserList",

  components: {
    UserDialog,
  },

  data() {
    return {
      columns: [
        {
          name: "id",
          required: true,
          label: "ID",
          align: "left",
          field: (row) => row.id,
        },
        {
          name: "firstName",
          required: true,
          label: "firstName",
          align: "left",
          field: (row) => row.firstName,
        },
        {
          name: "lastName",
          required: true,
          label: "lastName",
          align: "left",
          field: (row) => row.lastName,
        },
        {
          name: "email",
          required: true,
          label: "email",
          align: "left",
          field: (row) => row.email,
        },
        {
          name: "position",
          required: true,
          label: "positionTitle",
          align: "left",
          field: (row) => row.position,
        },
        {
          name: "role",
          required: true,
          label: "role",
          align: "left",
          field: (row) => row.role,
        },
        {
          name: "phoneNumber",
          required: true,
          label: "phoneNumber",
          align: "left",
          field: (row) => row.phoneNumber,
        },
        { name: "actions", label: "actions", align: "left" },
      ],

      loading: true,
      editDialog: false,
      editedUser: null,
    };
  },

  computed: {
    ...mapState(["users"]),
    translatedColumns() {
      return this.columns.map((column) => ({
        ...column,
        label: this.$t(column.label),
      }));
    },
  },

  methods: {
    ...mapActions(["fetchUsers", "updateUser", "deleteUser", "addUser"]),

    openDialogForNewUser() {
      this.editedUser = {};
      this.editDialog = true;
    },
    editUser(user) {
      this.editedUser = Object.assign({}, user);
      this.editDialog = true;
    },
    onUserSave(savedUser) {
      if (savedUser.id) {
        this.updateUser(savedUser)
          .then(() => {
            this.$q.notify({
              color: "green",
              message: "User updated successfully",
              icon: "check",
            });
            this.editDialog = false;
          })
          .catch(() => {
            this.$q.notify({
              color: "red",
              message: "Error updating user",
              icon: "error",
            });
          });
      } else {
        this.addUser(savedUser)
          .then(() => {
            this.$q.notify({
              color: "green",
              message: "User added successfully",
              icon: "check",
            });
            this.editDialog = false;
          })
          .catch(() => {
            this.$q.notify({
              color: "red",
              message: "Error adding user",
              icon: "error",
            });
          });
      }
    },

    promptDeleteUser(userId) {
      this.$q
        .dialog({
          title: this.$t("confirmTitle"),
          message: this.$t("confirmMessage"),
          ok: {
            color: "negative",
            label: this.$t("confirmDelete"),
          },
          cancel: {
            color: "primary",
            label: this.$t("confirmCancel"),
          },
        })
        .onOk(() => {
          this.deleteUser(userId)
            .then(() => {
              this.$q.notify({
                color: "green",
                message: "User deleted successfully",
                icon: "check",
              });
            })
            .catch(() => {
              this.$q.notify({
                color: "red",
                message: this.$t("Error deleting user"),
                icon: "error",
              });
            });
        });
    },
  },

  created() {
    this.fetchUsers().catch(() => {
      this.$q.notify({
        color: "red",
        message: "Error fetching users",
        icon: "error",
      });
    });
  },
};
</script>

<style></style>
