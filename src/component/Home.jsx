import React, { useState, useEffect, useLayoutEffect } from "react";
import iconImg from "../img/icon.png";
import "../scss/home.scss";
import data from "../common/data";
import util from "../common/util";
import AllContent from "./All";
import ArticalContent from "./Artical";
import VideoContent from "./Video";
import Swiper from "swiper/js/swiper.min.js";
import "swiper/css/swiper.min.css";

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
    [tagHeadTop, setTagHeadTop] = useState(),
    [mySwiper, setMySwiper] = useState(),
    [scrollTop, setScrollTop] = useState({ "2": 0, "0": 0, "1": 0 }),
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

  /**获取文章 | 视频列表
   * @params type 类型 不传全部  0 文章  1 视频
   * @params pos  页数
   * @params limit 每页拉多少
   * */
  const getContentData = (params) => {
    data.getContent(params).then((res) => {
      let now_tag = params.type ? params.type : "2";
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

  useEffect(() => {
    if (tagHeadShow) {
      let docscrollTop =
        document.documentElement.scrollTop ||
        window.pageYOffset ||
        document.body.scrollTop;
        console.log(tagHeadShow,docscrollTop)
      setTagHeadTop(docscrollTop);
    }
  }, [tagHeadShow]);

  //下拉加载更多 & 头悬浮
  useLayoutEffect(() => {
    let findTag = currentTag ? currentTag : "2";
    window.onscroll = () => {
      contentChangeScroll();
    };
    document.addEventListener("onscroll", function (e) {
      contentChangeScroll();
    });
    let index = tags.findIndex((item) => {
      return item.id == findTag;
    });
    let cc = new Swiper(".swiper-container", {
      freeMode: false,
      initialSlide: index,
      observer: true,
      on: {
        slideChangeTransitionStart: function () {
          let tag_id = tags[this.activeIndex].id;
          changeTagId(tag_id);
        },
      },
      observeParents: false,
      onSlideChangeEnd: function (swiper) {
        swiper.update();
        swiper.startAutoplay();
        swiper.reLoop();
      },
    });
    setMySwiper(cc);
  }, [contentData]);

  //下拉加载更多 & 头悬浮
  useLayoutEffect(() => {
    window.onscroll = () => {
      tagChangeScroll();
    };
    document.addEventListener("onscroll", function (e) {
      tagChangeScroll();
    });
  }, [currentTag]);

  const contentChangeScroll = () => {
    let findTag = currentTag ? currentTag : "2";
    let docscrollTop =
      document.documentElement.scrollTop ||
      window.pageYOffset ||
      document.body.scrollTop;
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
      if (tagEle.offsetTop > 0 && docscrollTop >= tagEle.offsetTop / 0.52) {
        setTagHeadShow(true);
      } else {
        setTagHeadShow(false);
      }
    }
    if (clientHeight + docscrollTop >= scrollHeight) {
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

  const tagChangeScroll = () => {
    let docscrollTop =
      document.documentElement.scrollTop ||
      window.pageYOffset ||
      document.body.scrollTop;
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
      if (tagEle.offsetTop > 0 && docscrollTop >= tagEle.offsetTop / 0.52) {
        setTagHeadShow(true);
      } else {
        setTagHeadShow(false);
      }
    }
    if (clientHeight + docscrollTop >= scrollHeight) {
      let findTag = currentTag ? currentTag : "2";
      let newSc = { ...scrollTop };
      newSc[findTag] = docscrollTop;
      setScrollTop(newSc);
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
  //切换类型
  const changeTag = (tag_id, index) => {
    mySwiper.slideTo(index, 500, false); //切换到slide，速度为500ms
    //保存当前tag的scrollTop
    let newST = { ...scrollTop };
    let docscrollTop =
      document.documentElement.scrollTop ||
      window.pageYOffset ||
      document.body.scrollTop;
    newST[currentTag] = docscrollTop;
    setScrollTop(newST);
    changeTagId(tag_id);
  };

  const changeTagId = (tag_id) => {
    setCurrentTag(tag_id);
    console.log(tagHeadTop)
    let currentTop =
      tagHeadShow && scrollTop[tag_id] < tagHeadTop
        ? tagHeadTop
        : scrollTop[tag_id];
    let moveEle = document.querySelector(".middle_move");
    let moveTopEle = document.querySelector(".top_move");
    if (tag_id == "2") {
      moveEle.style.left = "2.58rem";
      moveTopEle.style.left = "2.58rem";
    } else if (tag_id == "0") {
      moveEle.style.left = "3.54rem";
      moveTopEle.style.left = "3.54rem";
    } else {
      moveEle.style.left = "4.5rem";
      moveTopEle.style.left = "4.5rem";
    }
    window.scrollTo(0, currentTop);
  };

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
          {tags.map((item, index) => {
            return (
              <li
                className={
                  currentTag === item.id
                    ? "tag_item bold_font"
                    : "tag_item current_tag_item"
                }
                key={item.id}
                onClick={() => changeTag(item.id, index)}
              >
                {item.tagName}
              </li>
            );
          })}
          <li className="move top_move"> </li>
        </ul>
        <ul className="tag">
          {tags.map((item, index) => {
            return (
              <li
                className={
                  currentTag === item.id
                    ? "tag_item bold_font"
                    : "tag_item current_tag_item"
                }
                key={item.id}
                onClick={() => changeTag(item.id, index)}
              >
                {item.tagName}
              </li>
            );
          })}
          <li className="move middle_move"> </li>
        </ul>

        {contentData && (
          <div className="swiper-container">
            <div className="swiper-wrapper">
              <div className="swiper-slide">
                <div style={{ display: currentTag != "2" ? "none" : "block" }}>
                  <AllContent
                    contentData={contentData["2"].topic}
                    gotoDetail={gotoDetail}
                  />
                </div>
              </div>
              <div
                className="swiper-slide"
                style={{ height: currentTag != "0" && "0" }}
              >
                <div style={{ display: currentTag != "0" ? "none" : "block" }}>
                  <ArticalContent
                    contentData={contentData["0"].topic}
                    gotoDetail={gotoDetail}
                  />
                </div>
              </div>
              <div className="swiper-slide">
                <div style={{ display: currentTag != "1" ? "none" : "block" }}>
                  <VideoContent
                    contentData={contentData["1"].topic}
                    gotoDetail={gotoDetail}
                  />
                </div>
              </div>
            </div>
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
