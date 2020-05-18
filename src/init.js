
//baidu stat
const baidu = ()=>{
    window._hmt = window._hmt || [];
    const hmScript = document.createElement("script");
    hmScript.src = "//hm.baidu.com/hm.js?9f9fd730557c9f615b60a2133fb7616f";
    document.head.appendChild(hmScript);
    return true;
};

//chelun stat
// const chelun = ()=>{
//     const clScript = document.createElement("script");
//     clScript.src = "//tj.eclicks.cn/apps/resource/getJsSdk/H5WEB";
//     document.head.appendChild(clScript);
//     return true;
// }


//start
baidu();