
import React from '../react/'

const render =(vnode,container)=>{
    return container.appendChild(_render(vnode))
}


//将虚拟dom 转换为真实dom
const _render = (vnode)=>{

    
    if(vnode === null || vnode === undefined  || typeof vnode ==='boolean'){
        return null;
    }
    if(typeof vnode === 'number'){
        vnode = String(vnode)
    }
    console.log('vnode:',vnode);

    if(typeof vnode === 'string'){
        let textNode = document.createTextNode(vnode);
        return textNode;
    }
    if(typeof vnode.tag === 'function'){
        let component = createComponent(vnode.tag,vnode.attrs);//为什么不直接把vnode传递进去
        setComponentProps(component,vnode.attrs);
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


//设置attr props
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
        let comp = new component(props);
        return comp;
    }
}


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


export function renderComponent(component){

    const renderer = component.render();

    if(component.base && component.componentWillUpdate){
        component.componentWillUpdate();
    }
    const base =_render(renderer);
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

    component.base = base;
    base._component = component;
}

export default {
    render
}