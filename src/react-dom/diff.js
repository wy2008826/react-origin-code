import {vnodeToDom,setComponentProps, renderComponent} from './index'


/**
 * diff只针对自定义组件进行diff处理
 *
 *
 **/


export default function diff(newVdom, oldDom) {
    console.log('diff',newVdom);
    //新节点是文本节点
    if (typeof newVdom === 'string') {
        return diffTxtDom(newVdom, oldDom);
    }

    //新节点是普通的dom元素
    if (newVdom && typeof newVdom.tag === 'string') {
        if (newVdom.tag !== oldDom.nodeName.toLowerCase()) {
            diffNotTxtDom(newVdom, oldDom);
        }
    }

    //新节点是自定义组件
    if (newVdom && typeof newVdom.tag === 'function') {
        return diffComponent(newVdom, oldDom);
    }

    // diffAttribute();

    if(newVdom.childrens && newVdom.childrens.length){
        diffChild(newVdom,oldDom);
    }
    return oldDom;
}


function diffTxtDom(newVdom, oldDom) {
    console.log('diffTxtDom');
    let dom = oldDom;

    if (oldDom && oldDom.nodeType === 3) {//老节点是文本节点
        if (oldDom.textContent !== newVdom) {
            oldDom.textContent = newVdom
        }
    } else {//老节点是其它类型节点
        dom = document.createTextNode(newVdom);
        if (oldDom && oldDom.parentNode) {
            oldDom.parentNode.replaceChild(oldDom, dom)
        }
    }
    return dom;
}


function diffNotTxtDom(newVdom, oldDom) {
    console.log('diffNotTxtDom');
    const newDom = document.createElement(newVdom.tag);
    [...oldDom.childNodes].map(childNode => newDom.appendChild);//将旧节点子元素移动到新节点下

    if (oldDom && oldDom.parentNode) {
        oldDom.parentNode.replaceChild(oldDom, newDom)
    }
}

function diffComponent(newVdom, oldDom) {
    console.log('diffComponent');
    let newDom = oldDom
    if (oldDom._component && oldDom._component.constructor !== newVdom.tag) {//新组件和旧组件不是同一个
        newDom = vnodeToDom(newVdom);
        if (oldDom.parentNode) {
            oldDom.parentNode.replaceChild(oldDom, newDom)
        }
    } else {
        setComponentProps(oldDom._component,newVdom.attrs);
        renderComponent(oldDom._component);
    }

    return newDom;
}

function diffChild(newVdom,oldDom){
    console.log('diffChild',newVdom);

    const keyed = {};
    const childs=[];
    const oldChildDoms = oldDom ? oldDom.childNodes ||[]:[];
    
    for(let i=0;i<oldChildDoms.length;i++){
        let childNode = oldChildDoms[i];
        if(childNode.key){
            keyed[childNode.key]=childNode
        }else{
            childs.push(childNode);
        }
    }

    
    const newChildDoms = newVdom.childrens.map(child => vnodeToDom(child));


}