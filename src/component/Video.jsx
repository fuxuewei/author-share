import React, { useState, useEffect } from "react";

const VideoContent = (props) => {
  let { contentData, gotoDetail } = props;
  return (
    <div className="content_video demo">

<div>
      {contentData && contentData.map((item, index) => {
        /* 单图-大图 */
        return (
          <div onClick={() => gotoDetail(item.h5_url)} key={"content" + index}>
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
      })}</div>
    </div>
  );
};

export default VideoContent;
