<template>
  <div class="card">
    <div class="card-header">
      <div class="visitor-info">
        <div class="visitor-name">
          {{ visitor.firstName }} {{ visitor.lastName }}
        </div>
        <div class="visitor-iin">ИИН: {{ visitor.iin }}</div>
        <div class="visitor-phone">
          <font-awesome-icon :icon="['fas', 'phone']" />{{
            visitor.phoneNumber
          }}
        </div>
      </div>
      <div class="company-info">
        <div class="company-name">{{ visitor.company }}</div>
        <div class="company-position">{{ visitor.position }}</div>
      </div>
    </div>

    <div class="visitor-id">ID: {{ visitor.id }}</div>
    <div class="visitor-type">{{ visitor.type }}</div>
    <div class="last-login">
      <font-awesome-icon :icon="['fas', 'clock']" class="clock-icon" />
      {{ formatDateTime(new Date().toISOString()) }}
    </div>

    <div class="delete-icon" @click="deleteVisitor(visitor.id)">
      <font-awesome-icon
        :icon="['fas', 'trash-alt']"
        class="delete-icon-style"
      />
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";

library.add(fas);
export default {
  components: {
    FontAwesomeIcon,
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
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  margin: 5px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 1560px;
  background-color: rgb(245, 244, 244);
  height: 100px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  flex-basis: 16%;
  align-items: center;
}

.visitor-info {
  flex-grow: 1;
  flex-basis: 20%;
  margin-right: 190px;
  margin-left: 10px;
  align-content: center;
  color: rgb(255, 166, 0);
}

.visitor-name {
  font-weight: bold;
  padding-top: 5px;
  white-space: nowrap;
}

.visitor-iin,
.visitor-phone {
  padding-top: 5px;
  color: #666;
  white-space: nowrap;
}

.delete-icon {
  color: red;
}

.company-info {
  flex-grow: 1;
  text-align: left;
  flex-basis: 20%;
  margin-left: 100px;
  margin-right: 200px;
}

.company-name {
  font-weight: bold;
}

.company-position {
  color: #666;
}

.card-body {
  font-size: 14px;
  flex-basis: 20%;
}

.visitor-id {
  margin-bottom: 5px;
  flex-basis: 16%;
}

.visitor-type {
  font-weight: bold;
  flex-basis: 16%;
}

.last-login {
  color: #666;
  margin-bottom: 10px;
  flex-basis: 16%;
}

.delete-button {
  background-color: #f44336;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  flex-basis: 5%;
  margin-top: 10px;
}

.delete-icon:hover {
  cursor: pointer;
}
</style>
