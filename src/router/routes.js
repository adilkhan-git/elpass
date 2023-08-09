const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      { path: "cards", component: () => import("pages/CardsPage.vue") },
      { path: "visits", component: () => import("pages/UserVisits.vue") },
      { path: "userlist", component: () => import("pages/UserList.vue") },
      { path: "terminals", component: () => import("pages/TerminalsPage.vue") },
      { path: "companies", component: () => import("pages/CompaniesPage.vue") },
      {
        path: "cards/edit/:id",
        component: () => import("pages/EditPage.vue"),
        props: true, 
      },
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
