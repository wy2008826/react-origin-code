
import React from '../react/'

const render =(vnode,container)=>{
    return container.appendChild(_render(vnode))
}


//将虚拟dom 转换为真实dom
const _render = (vnode)=>{

    console.log('vnode:',vnode);
    if(!vnode || typeof vnode ==='boolean'){
        return null;
    }
    if(typeof vnode === 'number'){
        vnode = String(vnode)
    }
    if(typeof vnode === 'string'){
        let textNode = document.createTextNode(vnode);
        return textNode;
    }
    if(typeof vnode.tag === 'function'){
        let comp = createComponent(vnode)
        
        console.log('comp:',comp);
        return _render(comp.render())
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


function createComponent(vnode){
    //函数组件
    if(!vnode.tag.prototype){
        let comp = new React.Component(vnode.attrs);
        comp.constructor = vnode.tag;
        comp.render = vnode.tag;
        return comp;
    }
    // class组件
    if(vnode.tag.prototype && vnode.tag.prototype.render){
        let comp = new vnode.tag(vnode.attrs);
        return comp;
    }
}

export default {
    render
}