import  env  from "./env";
import querystring from "querystring";

const cacheKeyPrefix = '2019-chezhu-choujiang-';
export default {
  jumpLink(link) {
    window.location.href = link;
  },
  /**
 * @method 判断是否是 IOS 系统
 * @description  Microsoft injected the word iPhone in IE11's userAgent in order to try and fool Gmail somehow. Therefore we need to exclude it.
 *  @returns {Boolean}
 */
  isIOS: function () {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  },

  /**
   * @method 判断是否是 Android 系统
   * @description
   * @returns {Boolean}
   */

  isAndroid: function () {
    return /android/i.test(navigator.userAgent);
  },
  //获取url参数
  getParam(name) {
    let maps = {};
    let search = window.location.search.replace(/^\?*/, '');
    let hash = window.location.hash;
    let hashSearchIndex = hash.indexOf('?');
    let hashSearch = '';
    if (hashSearchIndex >= 0) {
      hashSearch = hash.substr(hashSearchIndex + 1);
    }

    if (hashSearch) {
      search += '&' + hashSearch;
    }

    var cookArr = search.split('&');
    for (var i in cookArr) {
      var tmp = cookArr[i].replace(/^\s*/, '');
      if (tmp) {
        var nv = tmp.split('=');
        maps[nv[0]] = nv[1] || '';
      }
    }
    return maps[name] || '';
  },

  setCache(name, value) {
    name = cacheKeyPrefix + name;
    window.localStorage.setItem(name, value);
  },
  getCache(name) {
    if (!name || typeof name !== 'string') {
      return null;
    }
    name = cacheKeyPrefix + name;
    return window.localStorage.getItem(name);
  },
  debunce(fn, sec) {
    var timer = null;
    return function (...args) {
      clearTimeout(timer)
      timer = setTimeout(() => {
        timer = null;
        fn.apply(this, args)
      }, sec)
    }
  },
  fastclick() {
    // 高版本浏览器通过touch-action解决点击300ms延迟问题
    if (!this.testCss("touchAction", "manipulation")) {
      import("fastclick").then(FastClick => {
        FastClick.attach(document.body);
      });
    }
  },
  // 该方法用户修复安卓机上，用户修改系统字体后，导致根元素字体大小和实际设置不一致
  resetFontSize() {
    const designWidth = 750,
      baseSize = 100,
      maxWidth = 540,
      minWidth = 320;
    // 计算设置的字体大小
    const width = Math.min(Math.max(window.innerWidth, minWidth), maxWidth);
    const calcSize = (width * baseSize) / designWidth;
    // 获取当前实际html字体大小
    const realSize = window
      .getComputedStyle(document.documentElement)
      .fontSize.replace("px", "");
    // 检查实际字体大小和设置大小是否一致
    if (Math.floor(realSize) !== Math.floor(calcSize)) {
      document.documentElement.style.cssText =
        "font-size: " + calcSize * (calcSize / realSize) + "px";
    }
  },
  // 插入Script promise
  loadScript(url) {
    return new Promise(resolve => {
      const body = document.body;
      const script = document.createElement("script");
      script.src = url;
      body.appendChild(script);
      script.onload = () => {
        setTimeout(() => {
          resolve(script);
        }, 0);
      };
    });
  },
  // 调试工具，在非正式环境下加载
  debug() {
    if (env.mode !== "production") {
      this.loadScript("//cdn.jsdelivr.net/npm/eruda").then(() => {
        window.eruda && window.eruda.init();
      });
    }
  },
  // 检查某个css属性是否支持
  testCss(property, value) {
    // 根元素
    const root = document.documentElement;
    // 查看当前属性是否在root.style上
    if (property in root.style) {
      // 设置样式
      root.style[property] = value;
      // 查看样式是否生效
      if (root.style[property]) {
        return true;
      }
    }
    return false;
  },
  fastclick() {
    // 高版本浏览器通过touch-action解决点击300ms延迟问题
    if (!this.testCss("touchAction", "manipulation")) {
      import("fastclick").then(FastClick => {
        FastClick.attach(document.body);
      });
    }
  },
  // 百度统计初始化
  initbaidu() {
    window._hmt = window._hmt || [];
    this.loadScript(
      "https://hm.baidu.com/hm.js?cb9bd9d99b80e6c533943ecebbfbb151"
    );
  },
  // 百度统计上报
  baiduReport(type = "", action = "", label = "") {
    if (window._hmt && window._hmt.push) {
      window._hmt.push(["_trackEvent", type, action, label]);
    }
  },
  // 获取url参数
  getParam(name) {
    let maps = {};
    let searchArr = [
      window.location.search,
      window.location.hash.split("?")[1] || ""
    ];
    for (let search of searchArr) {
      if (search.replace(/^\?*/, "")) {
        let param = querystring.parse(search.replace(/^\?*/, ""));
        maps = {
          ...maps,
          ...param
        };
      }
    }
    return decodeURIComponent(maps[name] || "");
  },
}