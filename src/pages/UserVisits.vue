<template>
  <div class="container">
    <h4>Отчет о посещениях</h4>
    <hr class="hr" />
    <h5>Список для отчета</h5>
    <div class="srch">
      <input type="search" placeholder="ID" />
      <input type="search" placeholder="ФИО" />
      <input type="search" placeholder="Дата с" />
      <input type="search" placeholder="Дата до" />
      <button>Очистить</button>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
.container {
  padding: 15px;
}

.srch {
  display: flex;
  gap: 40px;
  justify-content: flex-start;
}

.hr {
  background-color: orange;
  height: 4px;
  border: none;
}
</style>
