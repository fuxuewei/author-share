import React, { useState, useEffect } from "react";
import iconImg from "../img/icon.png";
import "../scss/home.scss";
import data from "../common/data";
import util from "../common/util";

const Home = (props) => {
  let tags = [
    { id: "2", tagName: "全部" },
    { id: "0", tagName: "文章" },
    { id: "1", tagName: "视频" },
  ];

  let [headData, setHeadData] = useState(),
    [baseInfo, setBaseInfo] = useState(),
    [currentTag, setCurrentTag] = useState("2"),
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
  const getContentData = (params, type) => {
    data.getContent(params).then((res) => {
      if (res.code === 1) {
        let newContent = {...contentData};
        newContent[type] = res.data.topic;
        setContentData(newContent);
      }
    });
  };

  const getInitData = async () => {
    let obj = {};
    let params = {
      pos: "1",
      limit: "10",
    };
    //全部
    await data.getContent({ ...params }).then((res) => {
      if (res.code === 1) {
        obj["2"] = res.data.topic;
      }
    });
    //文章
    await data.getContent({ ...params, type: "0" }).then((res) => {
      if (res.code === 1) {
        obj["0"] = res.data.topic;
      }
    });
    //视频
    await data.getContent({ ...params, type: "1" }).then((res) => {
      if (res.code === 1) {
        obj["1"] = res.data.topic;
      }
    });
    if (Object.keys(obj).length === 3) {
      setContentData(obj);
    }
  };

  //跳转到详情
  const gotoDetail = (url) => {
    window.location.href = url;
  };

  //切换类型
  const changeTag = (tag_id) => {
    setCurrentTag(tag_id);
    if (tag_id === "2") {
      getContentData();
    } else {
      getContentData(tag_id);
    }
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
          <li className="move"> </li>
        </ul>
        {/* 全部 */}
        {contentData &&
          currentTag === "2" &&
          contentData["2"].map((item, index) => {
            /* 三图 */
            if (item.imgs_count === 3) {
              return (
                <div
                  onClick={() => gotoDetail(item.h5_url)}
                  key={"content" + index}
                >
                  <div className="content_item three_cover">
                    <div className="title">{item.title}</div>
                    <div className="cover_pic">
                      {item.imgs.map((img, index) => {
                        return (
                          <img
                            src={img}
                            className="pic_small"
                            key={"img" + index}
                          />
                        );
                      })}
                    </div>
                    <div className="msg">
                      <span>{item.ctime}</span>
                      <span>
                        <span>评论 {item.posts}</span>
                        <span className="msg_num">浏览量 {item.pv}</span>
                      </span>
                    </div>
                  </div>
                  <div className="split_line"></div>
                </div>
              );
            } else if (item.show_type == "2") {
              /* 单图-大图 */
              return (
                <div
                  onClick={() => gotoDetail(item.h5_url)}
                  key={"content" + index}
                >
                  <div className="content_item single_big_cover">
                    <div className="title">{item.title}</div>
                    {item.video && (
                      <video
                        poster={item.imgs[0]}
                        controls
                        className="cover_pic"
                        style={{
                          width: "6.86rem",
                          height: "3.86rem",
                          objectFit: "fill",
                        }}
                      >
                        <source src={item.video[0].url} type="video/mp4" />
                        你的浏览器不支持video
                      </video>
                    )}
                    {!item.video && (
                      <div className="cover_pic">
                        <img src={item.imgs[0]} className="pic_big" />
                      </div>
                    )}
                    <div className="msg">
                      <span>{item.ctime}</span>
                      <span>
                        <span>评论 {item.posts}</span>
                        <span className="msg_num">浏览量 {item.pv}</span>
                      </span>
                    </div>
                  </div>
                  <div className="split_line"></div>
                </div>
              );
            } else {
              /* 单图-小图 */
              return (
                <div
                  onClick={() => gotoDetail(item.h5_url)}
                  key={"content" + index}
                >
                  <div className="content_item single_small_cover">
                    <div className="left_content">
                      <div className="title">{item.title}</div>
                      <div className="msg">
                        <span>{item.ctime}</span>
                        <span>
                          <span>评论 {item.posts}</span>
                          <span className="msg_num">浏览量 {item.pv}</span>
                        </span>
                      </div>
                    </div>
                    <div className="cover_pic">
                      <img src={item.imgs[0]} className="pic_small" />
                    </div>
                  </div>
                  <div className="split_line"></div>
                </div>
              );
            }
          })}

        {/* 文章 */}
        {contentData &&
          currentTag === "0" &&
          contentData["0"].map((item, index) => {
            /* 三图 */
            if (item.imgs_count === 3) {
              return (
                <div
                  onClick={() => gotoDetail(item.h5_url)}
                  key={"content" + index}
                >
                  <div className="content_item three_cover">
                    <div className="title">{item.title}</div>
                    <div className="cover_pic">
                      {item.imgs.map((img, index) => {
                        return (
                          <img
                            src={img}
                            className="pic_small"
                            key={"img" + index}
                          />
                        );
                      })}
                    </div>
                    <div className="msg">
                      <span>{item.ctime}</span>
                      <span>
                        <span>评论 {item.posts}</span>
                        <span className="msg_num">浏览量 {item.pv}</span>
                      </span>
                    </div>
                  </div>
                  <div className="split_line"></div>
                </div>
              );
            } else if (item.show_type == "2") {
              /* 单图-大图 */
              return (
                <div
                  onClick={() => gotoDetail(item.h5_url)}
                  key={"content" + index}
                >
                  <div className="content_item single_big_cover">
                    <div className="title">{item.title}</div>
                    <div className="cover_pic">
                      <img src={item.imgs[0]} className="pic_big" />
                    </div>
                    <div className="msg">
                      <span>{item.ctime}</span>
                      <span>
                        <span>评论 {item.posts}</span>
                        <span className="msg_num">浏览量 {item.pv}</span>
                      </span>
                    </div>
                  </div>
                  <div className="split_line"></div>
                </div>
              );
            } else {
              /* 单图-小图 */
              return (
                <div
                  onClick={() => gotoDetail(item.h5_url)}
                  key={"content" + index}
                >
                  <div className="content_item single_small_cover">
                    <div className="left_content">
                      <div className="title">{item.title}</div>
                      <div className="msg">
                        <span>{item.ctime}</span>
                        <span>
                          <span>评论 {item.posts}</span>
                          <span className="msg_num">浏览量 {item.pv}</span>
                        </span>
                      </div>
                    </div>
                    <div className="cover_pic">
                      <img src={item.imgs[0]} className="pic_small" />
                    </div>
                  </div>
                  <div className="split_line"></div>
                </div>
              );
            }
          })}

        {/* 视频 */}
        {contentData &&
          currentTag === "1" &&
          contentData["1"].map((item, index) => {
            /* 单图-大图 */
            return (
              <div
                onClick={() => gotoDetail(item.h5_url)}
                key={"content" + index}
              >
                <div className="content_item single_big_cover">
                  <div className="title">{item.title}</div>
                  <video
                    poster={item.imgs[0]}
                    controls
                    className="cover_pic"
                    style={{
                      width: "6.86rem",
                      height: "3.86rem",
                      objectFit: "fill",
                    }}
                  >
                    <source src={item.video[0].url} type="video/mp4" />
                    你的浏览器不支持video
                  </video>
                  <div className="msg">
                    <span>{item.ctime}</span>
                    <span>
                      <span>评论 {item.posts}</span>
                      <span className="msg_num">浏览量 {item.pv}</span>
                    </span>
                  </div>
                </div>
                <div className="split_line"></div>
              </div>
            );
          })}
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
