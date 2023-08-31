import { boot } from "quasar/wrappers";
import axios from "axios";
// import axiosRetry from "axios-retry";
import { i18n } from "src/boot/i18n";

import { Notify } from "quasar";

let _debug = false;

const http = axios.create();
let log = null;

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

  // const controller = new AbortController();

  log = function (message) {
    if (message && _debug) {
      Notify.create({ group: "axios", message, color: "primary" });
      console.log("log", ...arguments);
    }
  };

  log.error = function (err) {
    Notify.create({ group: "axios", message: err, type: "negative" });
    // console.error('axios log error',...arguments);
  };

  let currentRequest = null;

  let requestHdl = (config, isFullfilled) => {
    if (config.title) log(config.title);
    if (config.notify)
      config._notify = Notify.create({
        group: false,
        message: config.notify + " ...",
        spinner: true,
        timeout: 0,
      });

    // console.log('----config--->',config,'CHUHA');

    

    return config;
  };
  let responseHdl = (res) => {
    // Notify.create({message:res.config?.title||res.config.url,type: 'positive'});
    if (res.config && res.config._notify)
      res.config._notify({
        icon: "done",
        message: "Done! " + res.config.notify,
        spinner: false,
        timeout: 2500,
        color: "primary",
      });
    return res.data && res.data.data ? res.data.data : res.data;
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

    console.log("subtitle", subtitle, subtitle == "canceled");

    // if (data?.errors?.message == "Token expired") {
    //   console.log("Obtaining new token");
    //   const originalRequest = err.config;
    //   originalRequest._retry = true;
    //   await HTTPOFD.token();
    //   return http(originalRequest);
    // }

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
    // else Notify.create({message,type: 'negative', position:'top'});

    // currentRequest.response = { data, message };

    return Promise.reject(message);
  };

  http.interceptors.response.use(responseHdl, handleErr);

  http.interceptors.request.use(requestHdl, handleErr);
});

export { http, log };
