import React, { useState, useEffect } from "react";
import NoData from "./NoData";

const ArticalContent = (props) => {
  let { contentData, gotoDetail } = props;
  return (
    <div className="content">
      {contentData && contentData.length > 0 ? (
        contentData.map((item, index) => {
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
        })
      ) : (
        <NoData />
      )}
    </div>
  );
};

export default ArticalContent;
