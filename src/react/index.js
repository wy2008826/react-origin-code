import {renderComponent} from '../react-dom'
import _ from 'wy-utils';

//
const defer = fn => Promise.resolve().then(() => {
    fn()
});


const queue = [];
const renderQueue = [];//组件队列
function enqueueState(stateChange, component) {
    queue.push({
        stateChange,
        component
    });

    //插入需要更新的component队列 不能重复 避免重复render
    if(!renderQueue.some(renderComp =>renderComp ===component)){
        renderQueue.push(component);
    }
}

function flush(){
    let change,component;

    //清空queue队列
    while(change = queue.shift()){
        const {
            stateChange,
            component
        } = change
        if(!component.prevState){
            component.prevState = Object.assign({},component.state)
        }
        Object.assign(change.component.state,_.isFunction(stateChange) ? stateChange(component.prevState,component.props) : stateChange,stateChange);
        component.prevState = component.state;//这里需要更新prevState
    }

    //执行render
    while(component = renderQueue.shift()){
        console.log('renderQueue:',component,component.state,renderQueue.length);
        renderComponent(component)
    }
}


class Component {
    constructor(props = {}) {
        this.props = props;
        this.state = {}
    }

    /**
     * 支持函数式传参
     * 优化，避免段时间内不停地setState导致的频繁渲染问题
     * 关键：
     * 1、同步更新component.state
     * 2、将需要更新的组件放入renderComponent队列中，队列中的组件不能重复，避免组件重复渲染
     * 3、异步渲染renderComponent队列
     *
     *
     * **/

    setState(changedState) {
        //将changedState放入 队列中  同步更新
        // enqueueState(_.isFunction(changedState) ? changedState(this.state) : changedState, this);
        enqueueState(changedState, this);
        //异步渲染
        defer(flush);


        // Object.assign(this.state, _.isFunction(changedState) ? changedState(this.state) : this.state, changedState || {});
        // renderComponent(this);
    }
}


const createElement = (tag, attrs, ...childrens) => {
    /**
     * createElement 为什么在组件更新的时候也会执行？
     * 在每一次渲染组件的时候执行
     * 执行完之后上一次挂载的 _component 和 base 为什么没有销毁？
     * base挂载在组件实例上，组件实例是浏览器加载后就初始化了的
     * 而_component则是挂载在真实dom上的，也不会被销毁
     */

        // console.log('createElement');
        //移除冗余的attrs属性
    let {
            __source,
            __self,
            key,
            ..._attrs
        } = attrs;

    return {
        tag,
        attrs: _attrs,
        childrens,
        key
    }
}


export default {
    Component,
    createElement
};
