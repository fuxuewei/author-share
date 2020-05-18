//组件直接继承此类

/**
 * 导入react库
 */
import {Component} from 'react';

/**
 * 简单事件处理，用于react组件间通信
 */
export default class ReactEvent extends Component{
	
	constructor(props){
		super(props);
		ReactEvent._uidIndex ++;
		this._uid = ReactEvent._uidIndex;
		this._bindedEvents = [];
	}
	
	/**
	 * 解绑事件
	 * @param eventType
	 */
	off(eventType){
		if(typeof eventType !== 'string'){
			return ;
		}
		if(ReactEvent.data[eventType] === undefined){
			return ;
		}
		if(ReactEvent.data[eventType][this._uid] === undefined){
			return ;
		}
		delete ReactEvent.data[eventType][this._uid];
	}
	
	/**
	 * 触发事件会导致事件回调调用
	 * @param eventType
	 * @param data
	 */
	emit(eventType, data = {}, f = false){
		if(typeof eventType !== 'string'){
			return ;
		}
		if(ReactEvent.data[eventType] === undefined){
			return ;
		}
		let event = {
			data,
			uid: this._uid,
			type: eventType
		};
		let callbackList = ReactEvent.data[eventType];
		let flag = false;
		for(var uid in callbackList){
			flag = true;
			if(callbackList.hasOwnProperty(uid)){
				let callbacks = callbackList[uid];
				let callbackLen = callbacks.length;
				for(let i=0; i<callbackLen; i++){
					callbacks[i](event);
				}
			}
		}
		if (f &&　flag == false){
			setTimeout(function(){
				for(var uid in callbackList){
					flag = true;
					if(callbackList.hasOwnProperty(uid)){
						let callbacks = callbackList[uid];
						let callbackLen = callbacks.length;
						for(let i=0; i<callbackLen; i++){
							callbacks[i](event);
						}
					}
				}
			}, 1000);
		}
	}
	
	/**
	 * 监听事件
	 * @param eventType
	 * @param callback
	 */
	on(eventType, callback = ()=>{}){
		if(typeof eventType !== 'string'){
			return ;
		}
		if(typeof callback !== 'function'){
			callback = ()=>{};
		}
		if(ReactEvent.data[eventType] === undefined){
			ReactEvent.data[eventType] = {
				[this._uid] : [callback]
			};
		} else {
			ReactEvent.data[eventType][this._uid].push(callback);
		}
		this._bindedEvents.push(eventType);
	}
	
	/**
	 * 相当于组件移除时执行清理
	 */
	componentWillUnmount(){
		this._bindedEvents.forEach((eventType)=>{
			delete ReactEvent.data[eventType][this._uid];
			if(Object.keys(ReactEvent.data[eventType]).length == 0) {
				delete ReactEvent.data[eventType];
			}
		})
	}
}

// 静态属性保存事件信息
// data = {
//     eventType1: {
//         uid1 : [callback1, callback2, ...],    //组件1
//         uid2 : [callback1, callback2, ...],    //组件2
//         uid3 : [callback1, callback2, ...],    //组件3
//         ...
//     },
//     eventType2: {
//         uid1 : [callback1, callback2, ...],    //组件1
//         uid2 : [callback1, callback2, ...],    //组件2
//         uid3 : [callback1, callback2, ...],    //组件3
//         ...
//     },
//     ...
// }
ReactEvent.data = {};

/**
 * 为每个组件生成唯一id的索引
 * @type {number}
 * @private
 */
ReactEvent._uidIndex = 0;