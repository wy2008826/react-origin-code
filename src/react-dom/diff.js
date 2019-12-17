import {vnodeToDom} from './index'


/**
 * diff只针对自定义组件进行diff处理
 *
 *
 **/


export default function (newVdom, oldDom) {
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

    }

    return newDom;
}
