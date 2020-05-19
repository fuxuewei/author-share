import React, { useState, useEffect, useLayoutEffect } from "react";
import iconImg from "../img/icon.png";
import "../scss/home.scss";
import data from "../common/data";
import util from "../common/util";
import AllContent from "./All";
import ArticalContent from "./Artical";
import VideoContent from "./Video";

const Home = (props) => {
  let tags = [
    { id: "2", tagName: "全部" },
    { id: "0", tagName: "文章" },
    { id: "1", tagName: "视频" },
  ];

  let [headData, setHeadData] = useState(),
    [baseInfo, setBaseInfo] = useState(),
    [currentTag, setCurrentTag] = useState(),
    [tagHeadShow, setTagHeadShow] = useState(false),
    [contentData, setContentData] = useState();

  useEffect(() => {
    data.getHeadMsg().then((res) => {
      if (res.code === 1) {
        setHeadData(res.data.base_info);
        setBaseInfo(res.data.total_attainment);
      }
    });
    getInitData();
  }, []);

  useLayoutEffect(() => {
    judge();
  }, [currentTag]);

  /**获取文章 | 视频列表
   * @params type 类型 不传全部  0 文章  1 视频
   * @params pos  页数
   * @params limit 每页拉多少
   * */
  const getContentData = (params) => {
    data.getContent(params).then((res) => {
      let now_tag = currentTag ? currentTag : "2";
      if (res.code === 1 && res.data && res.data.topic) {
        let newContent = { ...contentData };
        newContent[now_tag].topic = [
          ...contentData[now_tag].topic,
          ...res.data.topic,
        ];
        newContent[now_tag].pos = res.data.pos;
        setContentData(newContent);
      }
    });
  };

  //获取初始化全部数据
  const getInitData = async () => {
    let obj = {};
    let params = {
      pos: 1,
      limit: 10,
    };
    //全部
    await data.getContent({ ...params }).then((res) => {
      if (res.code === 1) {
        obj["2"] = res.data;
      }
    });
    //文章
    await data.getContent({ ...params, type: "0" }).then((res) => {
      if (res.code === 1) {
        obj["0"] = res.data;
      }
    });
    //视频
    await data.getContent({ ...params, type: "1" }).then((res) => {
      if (res.code === 1) {
        obj["1"] = res.data;
      }
    });
    if (Object.keys(obj).length === 3) {
      setContentData(obj);
      setCurrentTag("2");
    }
  };

  //跳转到详情
  const gotoDetail = (url) => {
    window.location.href = url;
  };

  //判断手机左右滑动
  function judge(event) {
    let startx; //让startx在touch事件函数里是全局性变量。
    let endx;
    let starty;
    let endy;
    var el = document.getElementById("io"); //触摸区域。
    function cons() {
      //独立封装这个事件可以保证执行顺序，从而能够访问得到应该访问的数据。
      let tagArr = ["2", "0", "1"];
      if (startx > endx) {
        //判断左右移动程序:LEFT
        let currentTagIndex = tagArr.findIndex((item) => {
          return item == currentTag;
        });
        currentTagIndex < 2 && changeTag(tagArr[currentTagIndex + 1]);
      } else if (startx < endx) {
        let currentTagIndex = tagArr.findIndex((item) => {
          return item == currentTag;
        });
        currentTagIndex > 0 && changeTag(tagArr[currentTagIndex - 1]);
        cancelDisMouseWheel()
      }
    }
    el &&
      el.addEventListener("touchstart", function (e) {
        var touch = e.changedTouches;
        startx = touch[0].clientX;
        starty = touch[0].clientY;
      });
    el &&
      el.addEventListener("touchend", function (e) {
        var touch = e.changedTouches;
        endx = touch[0].clientX;
        endy = touch[0].clientY;
        let offsetX = endx - startx;
        let offsetY = endy - starty;
        if (Math.abs(offsetY) <= Math.abs(offsetX)) {
          disabledMouseWheel()
          cons();
        }
      });
  }
//阻止浏览器事件
function disabledMouseWheel() {  
  document.addEventListener('DOMMouseScroll', scrollFunc, false);  
  document.addEventListener('mousewheel',scrollFunc,false);
}
//取消阻止浏览器事件
function cancelDisMouseWheel(){
  document.removeEventListener('DOMMouseScroll',scrollFunc,false);
  document.removeEventListener('mousewheel',scrollFunc,false);
}  
function scrollFunc(evt) {  
  evt = evt || window.event;  
   if(evt.preventDefault) {  
       // Firefox  
       evt.preventDefault();  
       evt.stopPropagation();  
       } else{  
       // IE  
       evt.cancelBubble=true;  
       evt.returnValue = false;  
}  
    return false;  
}
  useLayoutEffect(() => {
    window.onscroll = () => {
      let scrollTop = document.documentElement.scrollTop;
      let clientHeight =
        window.innerHeight ||
        Math.min(
          document.documentElement.clientHeight,
          document.body.clientHeight
        );
      let scrollHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight
      );
      let tagEle = document.querySelector(".tag");
      if (tagEle) {
        if (tagEle.offsetTop > 0 && scrollTop >= tagEle.offsetTop / 0.52) {
          setTagHeadShow(true);
        } else {
          setTagHeadShow(false);
        }
      }
      if (clientHeight + scrollTop >= scrollHeight) {
        let findTag = currentTag ? currentTag : "2";

        let params = {
          pos: contentData[findTag].pos,
          limit: 10,
        };
        if (findTag != "2") {
          params.type = findTag;
        }
        getContentData(params);
      }
    };
    // document.addEventListener("onscroll", function (e) {
    //   let tagEle = document.querySelector(".tag");
    //   if (
    //     tagEle &&
    //     document.documentElement.scrollTop >= tagEle.offsetTop * 0.52
    //   ) {
    //     setTagHeadShow(true)
    //     tagEle.style.top = "0";
    //   }
    // });
  }, [contentData]);

  //切换类型
  const changeTag = (tag_id) => {
    let ele = document.querySelector(".content");
    let moveEle = document.querySelector(".middle_move");
    let moveTopEle = document.querySelector(".top_move");
    let width =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;
    setCurrentTag(tag_id);
    if (tag_id == "2") {
      animate(ele, "marginLeft", 0);
      moveEle.style.left = "2.58rem";
      moveTopEle.style.left = "2.58rem";
    } else if (tag_id == "0") {
      animate(ele, "marginLeft", -1 * width);
      moveEle.style.left = "3.54rem";
      moveTopEle.style.left = "3.54rem";
    } else {
      animate(ele, "marginLeft", -2 * width);
      moveEle.style.left = "4.5rem";
      moveTopEle.style.left = "4.5rem";
    }
  };

  //变速动画
  function animate(element, attr, target) {
    clearInterval(element.timeId);

    element.timeId = setInterval(function () {
      var current = parseInt(getStyle(element, attr));
      var step = (target - current) / 10;
      step = step > 0 ? Math.ceil(step) : Math.floor(step);
      current += step;
      element.style[attr] = current + "px";
      if (current == target) {
        clearInterval(element.timeId);
      }
    }, 20);
  }
  function getStyle(element, attr) {
    return getComputedStyle
      ? getComputedStyle(element, null)[attr]
      : element.currentStyle[attr];
  }
  //下载app
  const handleDownloadChelun = () => {
    util.jumpLink("https://chelun.com/url/HNxFKg6K");
  };

  return headData ? (
    <div>
      <div className="bg_block">
        <img src={headData.wallpaper} />
      </div>
      <img src={headData.avatar} className="head_img" />
      <img src={headData.user_identity.logo} className="head_logo" />
      <div className="content_block">
        <div className="author_name bold_font">{headData.nick}</div>
        <div className="author_tag">{headData.user_identity.title}</div>
        <div className="author_des">{headData.sign}</div>
        <div className="author_num">
          {baseInfo &&
            baseInfo.map((item, index) => {
              return (
                <React.Fragment key={index}>
                  <span className="zan_num bold_font">{item.num}</span>
                  <span className="zan_text">{item.title}</span>
                </React.Fragment>
              );
            })}
        </div>
        <ul
          className="tag_head"
          style={{ display: tagHeadShow ? "flex" : "none" }}
        >
          {tags.map((item) => {
            return (
              <li
                className={
                  currentTag === item.id
                    ? "tag_item bold_font"
                    : "tag_item current_tag_item"
                }
                key={item.id}
                onClick={() => changeTag(item.id)}
              >
                {item.tagName}
              </li>
            );
          })}
          <li className="move top_move"> </li>
        </ul>
        <ul className="tag">
          {tags.map((item) => {
            return (
              <li
                className={
                  currentTag === item.id
                    ? "tag_item bold_font"
                    : "tag_item current_tag_item"
                }
                key={item.id}
                onClick={() => changeTag(item.id)}
              >
                {item.tagName}
              </li>
            );
          })}
          <li className="move middle_move"> </li>
        </ul>

        {contentData && (
          <div className="content" id="io">
            <AllContent
              contentData={contentData["2"].topic}
              gotoDetail={gotoDetail}
            />
            <ArticalContent
              contentData={contentData["0"].topic}
              gotoDetail={gotoDetail}
            />
            <VideoContent
              contentData={contentData["1"].topic}
              gotoDetail={gotoDetail}
            />
          </div>
        )}
      </div>
      <div className="footer">
        <div className="footer_left">
          <img src={iconImg} />
          <div className="des">
            <div className="app_name">车轮</div>
            <div className="app_des">一站式车主服务</div>
          </div>
        </div>
        <div className="down_btn" onClick={handleDownloadChelun}>
          下载APP
        </div>
      </div>
    </div>
  ) : (
    <div></div>
  );
};

export default Home;
