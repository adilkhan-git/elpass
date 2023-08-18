import store from "../store"; // Подключите ваш Vuex store

const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      { path: "cards", component: () => import("pages/CardsPage.vue") },
      { path: "visits", component: () => import("pages/UserVisits.vue") },
      { path: "list", component: () => import("pages/ListPage.vue") },
      { path: "profile", component: () => import("pages/UserProfile.vue") },
      {
        path: "userlist",
        component: () => import("pages/UserList.vue"),
        beforeEnter: (to, from, next) => {
          if (store.state.user && store.state.user.role === "admin") {
            next();
          } else {
            next("/login");
          }
        },
      },
      {
        path: "terminals",
        component: () => import("pages/TerminalsPage.vue"),
        beforeEnter: (to, from, next) => {
          if (store.state.user && store.state.user.role === "admin") {
            next();
          } else {
            next("/login");
          }
        },
      },
      {
        path: "audit",
        component: () => import("pages/AuditPage.vue"),
        beforeEnter: (to, from, next) => {
          if (store.state.user && store.state.user.role === "admin") {
            next();
          } else {
            next("/login");
          }
        },
      },
    ],
  },

  { path: "/login", component: () => import("src/pages/LoginForm.vue") },
  ,
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
