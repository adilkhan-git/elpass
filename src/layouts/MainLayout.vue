<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> elpass-frontend-vue-app </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>
          <div class="profile-container">
            <img
              src="/avatar.svg"
              alt="Profile Avatar"
              class="profile-avatar"
            />
            <div class="profile-details">
              <div class="profile-name">Adilkhan</div>
              <div class="profile-status">
                <span class="online-dot"></span>
                Online
              </div>
            </div>
          </div>
        </q-item-label>

        <q-item-label header> Essential Links </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";

const linksList = [
  {
    title: "Посещения",
    caption: "",
    icon: "folder_open",
    link: "http://localhost:9000/#/visits",
  },
  {
    title: "Карточки посетителей",
    caption: "",
    icon: "person_pin",
    link: "http://localhost:9000/#/cards",
  },
  {
    title: "Настройки",
    caption: "",
    icon: "settings",
    link: "#",
  },
];

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>

<style>
.profile-container {
  display: flex;
  align-items: center;
  padding: 10px;
}

.profile-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.profile-details {
  margin-left: 10px;
}

.profile-name {
  font-weight: bold;
}

.profile-status {
  display: flex;
  align-items: center;
  color: #777;
}

.online-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: green;
  margin-right: 5px;
}
</style>
