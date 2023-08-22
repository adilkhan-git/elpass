<template>
  <q-card class="card">
    <q-card-section class="card-header">
      <img class="visitor-photo" :src="photoUrl" alt="Visitor Photo" />
      <div class="visitor-info">
        <div class="visitor-name">
          {{ visitor.firstName }} {{ visitor.lastName }}
        </div>
        <div class="visitor-iin">
          {{ $t("visitorCard.iin", { iin: visitor.iin }) }}
        </div>
        <div class="visitor-phone">
          <q-icon name="phone" />
          {{
            $t("visitorCard.phoneNumber", { phoneNumber: visitor.phoneNumber })
          }}
        </div>
      </div>
      <div class="company-info">
        <div class="company-name">{{ visitor.company }}</div>
        <div class="company-position">{{ visitor.position }}</div>
      </div>
    </q-card-section>
    <q-card-section class="card-body">
      <div class="id-type-last-login">
        <div class="visitor-id">
          {{ $t("visitorCard.id", { id: visitor.id }) }}
        </div>
        <div class="visitor-type">
          {{ $t("visitorCard.type", { type: visitor.type }) }}
        </div>
        <div class="last-login">
          <q-icon name="access_time" class="clock-icon" />
          {{
            $t("visitorCard.lastLogin", {
              lastLogin: formatDateTime(visitor.lastLogin || new Date()),
            })
          }}
        </div>
      </div>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn
        v-if="isAdmin"
        flat
        dense
        round
        icon="edit"
        color="orange"
        @click="toggleEditing"
      />
      <q-btn
        v-if="isAdmin"
        flat
        dense
        round
        icon="delete"
        color="negative"
        @click="deleteVisitor(visitor.id)"
      />
    </q-card-actions>
    <visitor-card-dialog
      :show="isEditing"
      :visitor="visitor"
      @save="saveVisitor"
    />
  </q-card>
</template>

<script>
import VisitorCardDialog from "./VisitorCardDialog.vue";
import { mapState } from "vuex";

export default {
  components: {
    VisitorCardDialog,
  },
  data() {
    return {
      isEditing: false,
    };
  },
  name: "VisitorCard",
  props: {
    visitor: {
      type: Object,
      required: true,
    },
    croppedImage: {
      type: String,
      default: "",
    },
  },
  methods: {
    toggleEditing() {
      this.isEditing = !this.isEditing;
    },
    saveVisitor(visitor) {
      this.$emit("update", visitor);
      this.toggleEditing();
    },
    deleteVisitor(id) {
      this.$emit("delete", id);
    },
    formatDateTime(dateTime) {
      const options = {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        day: "numeric",
        month: "long",
        year: "numeric",
      };
      return new Date(dateTime).toLocaleString("ru-RU", options);
    },
  },
  watch: {
    croppedImage(newValue) {
      console.log("Cropped Image:", newValue);
    },
  },

  computed: {
    ...mapState(["user"]),
    isAdmin() {
      return this.user && this.user.role === "admin";
    },
    isOperator() {
      return this.user && this.user.role === "operator";
    },
    isEmployee() {
      return this.user && this.user.role === "employee";
    },
    photoUrl() {
      const url = this.croppedImage || this.visitor.photoUrl;
      console.log("Photo URL:", url);
      return url;
    },
  },
};
</script>

<style>
.visitor-photo {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
}

.card {
  margin: 10px;
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.visitor-info {
  flex-grow: 1;
  margin-right: 10px;
  color: #ffa600;
}

.visitor-name {
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 5px;
}

.visitor-iin,
.visitor-phone {
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 5px;
}

.company-info {
  flex-grow: 1;
  text-align: left;
  margin-left: 120px;
}

.company-name {
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 5px;
}

.company-position {
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 5px;
}

.card-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.id-type-last-login {
  display: flex;
  justify-content: space-between;
  gap: 100px;
}

.q-input {
  padding: 0;
  margin: 0;
}

.visitor-id,
.visitor-type,
.last-login {
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.visitor-type {
  font-weight: bold;
}

.last-login {
  color: #666;
}

.clock-icon {
  margin-right: 5px;
}

.delete-icon-style {
  font-size: 16px;
}

.delete-icon:hover {
  cursor: pointer;
}
</style>
