<template>
  <q-card class="card">
    <q-card-section class="card-header">
      <div class="visitor-info">
        <div class="visitor-name">
          {{ visitor.firstName }} {{ visitor.lastName }}
        </div>
        <div class="visitor-iin">ИИН: {{ visitor.iin }}</div>
        <div class="visitor-phone">
          <q-icon name="phone" />{{ visitor.phoneNumber }}
        </div>
      </div>
      <div class="company-info">
        <div class="company-name">{{ visitor.company }}</div>
        <div class="company-position">{{ visitor.position }}</div>
      </div>
    </q-card-section>

    <q-card-section class="card-body">
      <div class="id-type-last-login">
        <div class="visitor-id">ID: {{ visitor.id }}</div>
        <div class="visitor-type">{{ visitor.type }}</div>
        <div class="last-login">
          <q-icon name="access_time" class="clock-icon" />
          {{ formatDateTime(new Date().toISOString()) }}
        </div>
      </div>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn
        flat
        dense
        round
        icon="delete"
        color="negative"
        @click="deleteVisitor(visitor.id)"
      />
    </q-card-actions>
  </q-card>
</template>

<script>
import { QCard, QCardSection, QCardActions, QBtn, QIcon } from "quasar";

export default {
  components: {
    QCard,
    QCardSection,
    QCardActions,
    QBtn,
    QIcon,
  },
  name: "VisitorCard",
  props: {
    visitor: {
      type: Object,
      required: true,
    },
  },
  methods: {
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
      return new Date().toLocaleString("en-US", options);
    },
  },
};
</script>

<style>
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
