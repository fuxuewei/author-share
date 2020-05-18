import React from "react";
import ReactDOM from "react-dom";
import "./scss/base.scss";
import { HashRouter, Route } from "react-router-dom";
import { Normalize, touchHover } from "cl-util";
import util from "./common/util";
import Wrapper from "./component/Wrapper";
import data from "./common/data";

export async function Start() {
  // 百度统计
  util.initbaidu();
  // 开启快速点击
  util.fastclick();
  // 调试工具
  util.debug();
  // hover
  touchHover.attach();

  await ReactDOM.render(
    <HashRouter>
      <Normalize designWidth={750} />
      <Route path="/" component={Wrapper} />
    </HashRouter>,
    document.getElementById("root")
  );
}
