import React, { useState, useEffect } from "react";

const AllContent = (props) => {
  let { contentData, gotoDetail } = props;
  return (
    <div className="content_all">
      {contentData && contentData.map((item, index) => {
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
    </div>
  );
};

export default AllContent;
