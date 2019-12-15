
import React from '../react/'

//将虚拟dom 转换为真实dom
const render = (vnode,container)=>{

    if(!vnode){
        return null;
    }

    if(typeof vnode === 'string'){
        let textNode = document.createTextNode(vnode);
        container.appendChild(textNode);
        return textNode;
    }
    if(typeof vnode === 'function'){
        //函数组件
        if(!vnode.prototype){
            return render(vnode(),container);
        }

        // class组件
        if(vnode.prototype && vnode.prototype.render){
            let comp = new vnode();
            return render(comp.render(),container);
        }
    }

    const {
        tag,
        attrs,
        childrens
    } = vnode;
   
    console.log('vnode:',vnode);

    let dom = document.createElement(tag);
    attrs && (Object.keys(attrs)).map((attr)=>{
        setAttribute(dom,attr,attrs[attr]);
        
    });

    childrens && childrens.length && childrens.map((vnode)=>{
        dom.appendChild(render(vnode,dom));
    });
    
    console.log('dom',dom);

    container.appendChild(dom);
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

export default {
    render
}