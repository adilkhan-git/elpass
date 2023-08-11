<template>
  <q-page padding>
    <q-btn color="primary" label="Add User" @click="openDialogForNewUser" />

    <q-table :rows="users" :columns="columns" row-key="id">
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
          label: "First Name",
          align: "left",
          field: (row) => row.firstName,
        },
        {
          name: "lastName",
          required: true,
          label: "Last Name",
          align: "left",
          field: (row) => row.lastName,
        },
        {
          name: "email",
          required: true,
          label: "Email",
          align: "left",
          field: (row) => row.email,
        },
        {
          name: "position",
          required: true,
          label: "Position",
          align: "left",
          field: (row) => row.position,
        },
        {
          name: "role",
          required: true,
          label: "Role",
          align: "left",
          field: (row) => row.role,
        },
        {
          name: "phoneNumber",
          required: true,
          label: "Phone",
          align: "left",
          field: (row) => row.phoneNumber,
        },
        { name: "actions", label: "Actions", align: "left" },
      ],

      loading: true,
      editDialog: false,
      editedUser: null,
    };
  },

  computed: {
    ...mapState(["users"]),
  },

  methods: {
    ...mapActions(["fetchUsers", "updateUser", "deleteUser", "addUser"]),

    openDialogForNewUser() {
      this.editedUser = {}; // создаем пустого пользователя
      this.editDialog = true;
    },
    editUser(user) {
      this.editedUser = Object.assign({}, user); // редактирование существующего пользователя
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
          title: "Confirm",
          message: "Do you really want to delete this user?",
          ok: {
            color: "negative",
            label: "Delete",
          },
          cancel: {
            color: "primary",
            label: "Cancel",
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
                message: "Error deleting user",
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

<style>

</style>
