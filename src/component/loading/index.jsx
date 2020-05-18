// 基础引入
import React from 'react'
import ReactDOM from 'react-dom';
// 样式引入
import './index.scss'
// 图片引入
import loadingImg from './loading.gif'

class LoadingComponent extends React.Component{
    render(){
        return (
            <div className='loading-container'>
                <img className='loading-img' src={loadingImg} alt=""/>
                <span className='loading-text'>{this.props.msg}</span>
            </div>
        )
    }
}

/**
 * 方法描述：触发loading
 * @param show {Boolean} 显示或隐藏
 * @param msg {String} 文案，默认“加载中”
 */
const Loading = (show=true, msg='加载中') => {
    if(show) {
        const div = document.createElement('div');
        div.classList.add('loading-dialog');
        ReactDOM.render((
            <LoadingComponent
                msg={msg}
            />
        ), div);
        document.body.appendChild(div);
    } else {
        const loading = document.querySelector('.loading-dialog');
        ReactDOM.unmountComponentAtNode(loading);
        document.body.removeChild(loading);
    }
}

export default Loading;
