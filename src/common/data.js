import Cookies from "js-cookie";
import querystring from "querystring";
import env from "./env";

// 环境
const mode = env.mode;
// api json
export const hosts = env.getApiHost();

let host = "community-test.chelun.com";
if (mode === "production") {
  host = "chezhu.chelun.com";
}
//缓存数据
export const cacheData = {};

export default {
  ajax(host, pathname, param = {}, opt = {}, cache) {
    let url = "//" + host + pathname;

    // 客户端参数
    const appParam = querystring.parse(
      window.location.search.replace(/^\?*/, "")
    );
    // 公共参数
    const envParam = {
      _request_from: "h5",
      platform: "web",
      openUDID: Cookies.get("chelun_uuid"),
      appVersion: Cookies.get("chelun_appVersion"),
      os: Cookies.get("chelun_osType"),
    };
    // 合并参数
    param = { ...appParam, ...envParam, ...param };
    //参数处理
    if (opt.method === "POST") {
      const form = new FormData();
      for (let key in param) {
        form.append(key, param[key]);
      }
      opt.body = form;
    } else {
      url +=
        (url.indexOf("?") > -1 ? "&" : "?") + `${querystring.stringify(param)}`;
    }

    //缓存处理
    let cacheId = "";
    if (cache) {
      cacheId = host + pathname;
      for (let key in param) {
        cacheId += key + param;
      }
      if (cacheData && cacheData[cacheId]) {
        return Promise.resolve(cacheData[cacheId]);
      }
    }

    return Promise.race([
      fetch(url, {
        method: "GET",
        credentials: "include", //mode === "production" ? "include" : "omit",
        ...opt,
      })
        .then((str) => {
          return str.json();
        })
        .then((res) => {
          if (cache) {
            cacheData[cacheId] = res;
          }
          return res;
        })
        .catch((e) => {
          console.log(e);
        }),
      new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            code: 9999, //统一超时错误码
            msg: "网络请求超时，请检查你的网络是否正常",
          });
        }, opt.timeout || 20000); //默认超时时间20秒
      }),
    ]);
  },

  setSessionCache(name, value) {
    name = this.cacheKeyPrefix + name;
    window.sessionStorage.setItem(name, value);
  },
  getSessionCache(name) {
    if (!name || typeof name !== "string") {
      return null;
    }
    name = this.cacheKeyPrefix + name;
    return window.sessionStorage.getItem(name);
  },

  // 个人中心头部
  getHeadMsg() {
    return this.ajax(host, "/WheelNum/userCenterInfo?uid=19435386");
  },

  // 内容
  getContent(param) {
    return this.ajax(host, "/Headline/wheel_num_index?uid=19435386", param);
  },
};
