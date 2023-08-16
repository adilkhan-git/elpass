<template lang="pug">


q-page
  

  div {{ $t('message.hello') }}
    q-table(
      :rows="audits"
      row-key="date"
      :columns="columns"
      :pagination.sync="pagination"
    )
    
</template>

<script>
export default {
  data() {
    return {
      pagination: {
        rowsPerPage: 10,
      },
      columns: [
        {
          name: "user",
          label: "Пользователь",
          align: "left",
          field: (row) => row.user,
        },
        {
          name: "date",
          label: "Дата",
          align: "left",
          field: (row) => row.date,
        },
        { name: "type", label: "Тип", align: "left", field: (row) => row.type },
        {
          name: "object",
          label: "Объект",
          align: "left",
          field: (row) => row.object,
        },
        // If you want to display details directly in the table, you can add more columns
      ],
      audits: [
        {
          user: "Саня",
          date: "2023-08-11 22:55:45",
          type: "Update",
          object: "el_tcardgroups",
          details: [
            { key: "code", value: "16d5ebb3" },
            { key: "name", value: "Форум ВОЗ" },
            // ...other details
          ],
        },
        // ...more audits
      ],
    };
  },
};
</script>
