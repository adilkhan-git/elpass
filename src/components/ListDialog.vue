<template>
  <q-dialog v-model="showDialog">
    <q-card>
      <q-card-section>
        <q-input v-model="list.name" label="List Name" />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" @click="cancel" />
        <q-btn label="Confirm" color="primary" @click="confirm" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  props: {
    initialList: {
      type: Object,
      required: true,
    },
    isEdit: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      showDialog: true,
      list: Object.assign({}, this.initialList),
    };
  },
  methods: {
    confirm() {
      this.$emit("confirm", this.list);
      this.showDialog = false;
    },
    cancel() {
      this.$emit("cancel");
      this.showDialog = false;
    },
  },
  watch: {
    initialList: {
      handler(newValue) {
        this.list = Object.assign({}, newValue);
      },
      deep: true,
    },
  },
};
</script>
