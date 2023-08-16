<template lang="pug">
q-card.card
      q-card-section.card-header
        
        img.visitor-photo(:src="photoUrl" alt="Cropped image" )


        .visitor-info
          .visitor-name {{ visitor.firstName }} {{ visitor.lastName }}
          .visitor-iin {{ $t('visitorCard.iin', { iin: visitor.iin }) }}
          .visitor-phone
            q-icon(name="phone")
            | {{ $t('visitorCard.phoneNumber', { phoneNumber: visitor.phoneNumber }) }}
        .company-info
          .company-name {{ visitor.company }}
          .company-position {{ visitor.position }}
      q-card-section.card-body
        .id-type-last-login
          .visitor-id {{ $t('visitorCard.id', { id: visitor.id }) }}
          .visitor-type {{ $t('visitorCard.type', { type: visitor.type }) }}
          .last-login
            q-icon(name="access_time" class="clock-icon")
            | {{ $t('visitorCard.lastLogin', { lastLogin: formatDateTime(visitor.lastLogin || new Date()) }) }};
      q-card-actions.align-right
        q-btn( flat dense round icon="edit" color="orange" @click="toggleEditing")
        q-btn(v-if="isAdmin" flat dense round icon="delete" color="negative" @click="deleteVisitor(visitor.id)")
      visitor-card-dialog(:show="isEditing" :visitor="visitor" @save="saveVisitor")
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
  },
  name: "VisitorCard",
  props: {
    visitor: {
      type: Object,
      required: true,
    },
    photoUrl: String,
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
