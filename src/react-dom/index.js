
import React from '../react/'
import diff from './diff';

const render =(vnode,container)=>{
    return container.appendChild(vnodeToDom(vnode))
}


//将虚拟dom 转换为真实dom
export const vnodeToDom = (vnode)=>{

    // console.log('vnode:',vnode);

    if(vnode === null || vnode === undefined  || typeof vnode ==='boolean'){
        return null;
    }
    if(typeof vnode === 'number'){
        vnode = String(vnode)
    }

    if(typeof vnode === 'string'){
        return document.createTextNode(vnode);
    }

    //无状态组件、class组件
    if(typeof vnode.tag === 'function'){
        let component = createComponent(vnode.tag,vnode.attrs);//为什么不直接把vnode传递进去
        // 设置组件的props 并渲染组件
        setComponentProps(component, vnode.attrs);
        return component.base;
    }


    const {
        tag,
        attrs,
        childrens
    } = vnode;

    let dom = document.createElement(tag);
    attrs && (Object.keys(attrs)).map((attr)=>{
        setAttribute(dom,attr,attrs[attr]);
    });

    childrens && childrens.length && childrens.map((vnode)=>{
        return render(vnode,dom);
    });
    return dom;
}


//设置真实dom的 attr props
function setAttribute (dom,attr,value){
    //事件添加
    if(/on\w+/g.test(attr)){
        dom.addEventListener(attr.toLowerCase().substr(2),value);
        return;
    }

    // 样式处理
    if(attr === 'style'){
        if(typeof value==='string'){
            dom.setAttribute(attr,value);
            return;
        }
        if(typeof value==='object'){
            Object.keys(value).map((styleName)=>{
                dom.style[styleName]=value[styleName]
            });
            return;
        }
    }
    // className处理
    if(attr === 'className'){
        attr = 'class'
    }

    dom.setAttribute(attr,value)
}

//生成class组件
function createComponent(component,props){
    //函数组件
    if(!component.prototype){
        let comp = new React.Component(props);
        comp.constructor = component;
        comp.render = ()=>{return comp.constructor(props)};
        return comp;
    }
    // class组件
    if(component.prototype && component.prototype.render){
        return new component(props);
    }
}

/**
 * 设置组件的props 并设置生命周期
 *
 * 涉及到的生命周期：
 * 1 componentWillMount
 * 2 componentWillReceiveProps
 *
 *
 * componentWillMount 和 componentWillReceiveProps 哪一个先执行？
 *
**/

function setComponentProps(component,props){
    //生命周期
    if(!component.base){
        if(component.componentWillMount){
            component.componentWillMount();
        }
    }else{
        if(component.componentWillReceiveProps){
            component.componentWillReceiveProps(props);
        }
    }
    //赋值props
    component.props=props;
    renderComponent(component);
}

/**
 * 将组件渲染成真实dom 并添加生命周期
 * 组件实例上挂载 base【组件对应的真实dom】
 * 涉及到的生命周期：
 * 1、shouldComponentUpdate
 * 2、componentWillUpdate
 * 3、componentDidUpdate
 * 4、componentDidMount
 *
 **/


export function renderComponent(component){

    if(component.base && component.shouldComponentUpdate){
        let needUpdate = component.shouldComponentUpdate(component.props,component.state);
        if( needUpdate === false ){
            return false;
        }
    }

    const renderer = component.render();

    if(component.base && component.componentWillUpdate){
        component.componentWillUpdate();
    }

    let base;
    if(component.base){
        base =diff(component,component.base);//针对非组件形式的虚拟dom 由于不会调用renderComponent 所以都会导致重新渲染
    }else{
        base =vnodeToDom(renderer);
    }

    if(component.base){
        if(component.componentDidUpdate){
            component.componentDidUpdate();
        }
    }else{
        if(component.componentDidMount){
            component.componentDidMount();
        }
    }
    //didmount是在真正插入daom节点之前完成的？
    if ( component.base && component.base.parentNode ) {
        //组件更新是整个组件进行替换？
        component.base.parentNode.replaceChild( base, component.base );
    }

    //至关重要的一步，diff算法需要从这里取数据进行比对
    component.base = base;
    base._component = component;
}


export default {
    render
}
