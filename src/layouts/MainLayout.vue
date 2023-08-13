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
        <q-btn
          flat
          dense
          round
          icon="exit_to_app"
          aria-label="Logout"
          @click="logout"
        />
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
              <div class="profile-name">{{ userName }}</div>

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
        <q-item-label header> Администрирование </q-item-label>
        <q-expansion-item label="Настройки" icon="settings">
          <EssentialLink
            v-for="subLink in settingsLinks"
            :key="subLink.title"
            v-bind="subLink"
          />
        </q-expansion-item>
      </q-list>
      <div class="icon-container">
        <img class="icon" src="../../public/images/elpass.svg" alt="" />
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

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
    title: "Списки",
    caption: "",
    icon: "format_list_bulleted",
    link: "#",
  },
];

const settingsLinks = [
  {
    title: "Пользователи",
    link: "http://localhost:9000/#/userlist",
  },
  {
    title: "Терминалы",
    link: "http://localhost:9000/#/terminals",
  },
  {
    title: "Компании",
    link: "http://localhost:9000/#/companies",
  },
];

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
  },

  setup() {
    const store = useStore();
    const leftDrawerOpen = ref(false);
    const router = useRouter();

    const userName = computed(() => store.state.user?.firstName ?? "Guest");

    const logout = () => {
      store.dispatch("logout");
      router.push("/login");
    };

    return {
      essentialLinks: linksList,
      settingsLinks: settingsLinks,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      userName,
      logout,
    };
  },
});
</script>

<style>
.icon-container {
  position: absolute;
  bottom: 10px;   /* Отступ снизу */
  left: 50%;
  transform: translateX(-50%); /* Это центрирует иконку по горизонтали */
}

.icon {
  width: 100px;
  height: 100px;
}

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

.custom-link-style {
  padding-left: 150px;
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

.q-drawer {
  background-color: rgb(230, 230, 230);
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
