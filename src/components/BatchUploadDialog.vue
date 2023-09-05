<template>
  <q-dialog :value="modelValue" @input="$emit('update:modelValue', $event)">
    <q-card>
      <q-card-section>
        <q-form @submit="handleSubmit">
          <q-input v-model="formData.name" label="Наименование" required />

          <q-input
            v-model="formData.date"
            label="Дата"
            mask="DD.MM.YYYY HH:mm"
            required
          />

          <q-file
            v-model="formData.csvFile"
            label="CSV Файл ( Список )"
            accept=".csv"
          />

          <q-file
            v-model="formData.zipFile"
            label="ZIP Файл ( Фотографии )"
            accept=".zip"
          />

          <div>
            <q-btn label="Отмена" color="primary" flat @click="handleCancel" />
            <q-btn type="submit" label="Подтвердить" color="positive" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      formData: {
        name: "",
        date: "",
        csvFile: null,
        zipFile: null,
      },
    };
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();

      this.$emit("update:modelValue", false);
    },
    handleCancel() {
      this.$emit("update:modelValue", false);
    },
  },
};
</script>

<style scoped></style>
