const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      { path: "cards", component: () => import("pages/CardsPage.vue") },
      { path: "visits", component: () => import("pages/UserVisits.vue") },
    ],
  },
  // отдельные роуты для страниц логина и регистрации
  { path: "/login", component: () => import("src/pages/LoginForm.vue") },
  { path: "/register", component: () => import("src/pages/RegisterForm.vue") },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
