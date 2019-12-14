
import React from '../react/'

//将虚拟dom 转换为真实dom
const render = (virtualDom,container)=>{
    const {
        tag,
        attrs,
        childrens
    } = virtualDom;
   
    console.log('virtualDom:',virtualDom);


    let dom = document.createElement(tag);
    attrs && (Object.keys(attrs)).map((attr)=>{
        console.log('attr:',attr);
        dom.setAttribute(attr,attrs[attr])
    });

    childrens && childrens.length && childrens.map((virtualDom)=>{
        if(typeof virtualDom === 'string'){
            dom.appendChild(document.createTextNode(virtualDom));
        }else{
            dom.appendChild(render(virtualDom,dom));
        }
    });
    
    console.log('dom',dom);

    container.appendChild(dom);
    return dom;
}

export default {
    render
}