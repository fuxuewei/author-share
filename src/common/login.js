import { login, is } from "cl-util";
import Cookies from "js-cookie";
import util from "./util";

export function loginFn(callback) {
  login({
    onLogin(res) {
      window.location.reload();
    }
  });
}

export function isLogin() {
  let isLogin = Cookies.get("chelun_isLogin");
  if (!isLogin) {
    isLogin = "false";
  }
  return isLogin === "false" ? false : true;
}

export function openid() {
  return localStorage.getItem("wx-openid") || util.getParam("openid");
}

export function getOpenid() {
  if (is.weixin()) {
    if (openid()) {
      // 已存储openid
      localStorage.setItem("wx-openid", openid());
    } else {
      window.location.href =
        "http://wechatadmin.chelun.com/officialAccount/chelun?type=snsapi_base&url=" +
        encodeURIComponent(window.location.href);
    }
  }
}
