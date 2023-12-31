import { boot } from "quasar/wrappers";
import axios from "axios";
// import axiosRetry from "axios-retry";
import { i18n } from "src/boot/i18n";

import { Notify } from "quasar";

let _debug = false;

const http = axios.create({
  baseURL: 'https://api.elpass.uz'
});

let log = function (message) {
  if (message && _debug) {
    Notify.create({ group: "axios", message, color: "primary" });
    console.log("log", ...arguments);
  }
};

log.error = function (err) {
  Notify.create({ group: "axios", message: err, type: "negative" });
  // console.error('axios log error',...arguments);
};


export default boot(({ app, store }) => {
  app.config.globalProperties.$http = http;

  // console.log('app.$t',i18n.global.t('Тест'));
  store.watch(
    () => store.state.debug,
    (v) => {
      console.log("--> debug", v);
      _debug = v;
    },
    { immediate: true }
  );

  let requestHdl = (config, isFullfilled) => {
    if (config.title) log(config.title);
    if (config.notify)
      config._notify = Notify.create({
        group: false,
        message: config.notify + " ...",
        spinner: true,
        timeout: 0,
      });
    return config;
  };

  let responseHdl = (res) => {
    if (res.config && res.config._notify)
      res.config._notify({
        icon: "done",
        message: "Done! " + res.config.notify,
        spinner: false,
        timeout: 2500,
        color: "primary",
      });
    // return res.data && res.data.data ? res.data.data : res.data;
    return res;
  };

  let handleErr = async (err) => {
    let data = err.response?.data;

    let message = err.config && err.config.title ? err.config.title + ": " : "";

    let subtitle =
      data?.errors?.message ||
      data?.error?.message ||
      data?.message ||
      data?.reason ||
      err.message ||
      err;

    if (subtitle.indexOf("timeout") > 1) {
      subtitle = "Превышено время ожидание сервера";
    }

    message =
      i18n.global.t("Ошибка!") + " " + message + i18n.global.t(subtitle);

    if (err.config && err.config._notify)
      err.config._notify({
        icon: "error",
        message: "Ошибка! " + err.config.notify,
        caption: message,
        spinner: false,
        timeout: 2500,
        type: "negative",
      });
    else if (subtitle == "canceled") log.error(i18n.global.t(subtitle));
    else log.error(message);
    return Promise.reject(message);
  };

  http.interceptors.response.use(responseHdl, handleErr);
  http.interceptors.request.use(requestHdl, handleErr);
});

export { http, log };
