<template>
    <div>
      <VisitorCardDialog :visitor="currentVisitor" @save="updateVisitor" />
    </div>
  </template>
  
  <script>
  import VisitorCardDialog from '@/components/VisitorCardDialog.vue';
  
  export default {
    components: {
      VisitorCardDialog
    },
    data() {
      return {
        currentVisitor: null // Здесь вы можете загрузить данные текущего посетителя из вашего API или хранилища
      };
    },
    methods: {
      updateVisitor(updatedData) {
        // Обновите данные в вашем API или хранилище
      }
    }
  }
  </script>
  