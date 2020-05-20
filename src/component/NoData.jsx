import React from "react";
import noDataImg from "../img/nodata.png";
import "../scss/nodata.scss";

const NoData = () => {
  return (
    <div className="no_data">
      <img src={noDataImg}></img> 暂无数据
    </div>
  );
};

export default NoData;
