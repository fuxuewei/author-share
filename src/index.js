import "./init";
import './scss/base.scss';
import { Loading } from "cl-util";
import * as serviceWorker from "./serviceWorker";

window["CHELUN_SHOW_OPTION_MENU"] = 1;
window["CHELUN_SHOW_MENU_ITEMS"] = [
  "menu:refresh"
];

// 需要预加载的图片列表，只有>10K的图片才需要预加载
const preLoadList = [
];

// 图片预加载
async function loadImage(src) {
  return new Promise(resolve => {
    const img = new Image();
    const onload = () => resolve();
    img.onload = onload;
    img.onerror = onload;
    img.src = src;
  });
}

function showPage(){
  document.getElementById('body').style.visibility = 'visible'
}
(async () => {
  document.body.addEventListener("touchstart", () => {});
  // 预加载所有图片
  for (let src of preLoadList) {
    await loadImage(src);
  }

  // 加载入口文件
  const entry = await import(`./main`);
  await entry.Start();
  setTimeout(showPage,1)
  // 全部加载完成，取消loading

})();