<template>
  <q-dialog v-model="dialog">
    <q-card>
      <q-card-section>
        <q-form @submit="handleSubmit">
          <q-input
            v-model="list.name"
            label="List Name"
            
            required
          />
          <q-input
            v-model="list.date"
            label="Creation Date"
            mask="YYYY-MM-DD"
           
            required
          />
          <div>
            <q-btn label="Cancel" color="primary" flat @click="handleCancel" />
            <q-btn type="submit" label="Confirm" color="positive" />
          </div>
        </q-form>
      </q-card-section>
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
      default: false,
    },
  },
  data() {
    return {
      dialog: true,
      list: {},
      // requiredRule: (val) => (val && val.length > 0) || "Field is required",
    };
  },
  watch: {
    initialList: {
      immediate: true,
      handler(value) {
        this.list = { ...value };
      },
    },
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.$emit("confirm", this.list);
    },
    handleCancel() {
      this.dialog = false;
      this.$emit("cancel");
    },
  },
};
</script>

<style scoped>

</style>
