import {vnodeToDom, setComponentProps, renderComponent} from './index'


/**
 * diff只针对自定义组件进行diff处理
 *
 * 返回比对后的新节点
 *
 **/


export default function diff(newVdom, oldDom) {
    console.log('diff', newVdom);

    if(!oldDom){
        return vnodeToDom(newVdom)
    }

    if(typeof newVdom === 'boolean' || newVdom === undefined || newVdom === null){
        return
    }
    if(typeof newVdom ==='number'){
        newVdom=String(newVdom)
    } if(typeof newVdom ==='number'){
        newVdom=String(newVdom)
    }

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

    if (newVdom.childrens && newVdom.childrens.length) {
        diffChild(newVdom, oldDom);
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
        setComponentProps(oldDom._component, newVdom.attrs);
        renderComponent(oldDom._component);
    }

    return newDom;
}


/**
 * 新的虚拟Dom 和老的真实Dom进行比对
 * 子节点比对 先将老的dom子节点根据是否有key值 进行分类
 *
 * 优先级：
 * 虚拟dom节点先去查找同key值的旧dom 如果有，则直接将该虚拟dom子节点和旧的真实dom做映射，同时清除掉key值上的挂载项
 * 如果没有查找到key值，则从没有key值的子元素列表中查找同类型的节点
 *
 *
 * */
function diffChild(newVdom, oldDom) {
    console.log('diffChild', newVdom,oldDom,oldDom._component);

    const keyed = {};
    const childs = [];
    const oldChildDoms = oldDom ? oldDom.childNodes || [] : [];

    console.log('oldChildDoms:',oldChildDoms);
    for (let i = 0; i < oldChildDoms.length; i++) {
        let childNode = oldChildDoms[i];
        if (childNode.key) {
            keyed[childNode.key] = childNode;//这里保留的是真实的dom节点
        } else {
            childs.push(childNode);
        }
    }

    const newVdomChilds = newVdom.childrens || [];

    if (newVdomChilds && newVdomChilds.length) {
        let min = 0;
        let newVdomChildLength = newVdomChilds.length;

        for (let i = 0; i < newVdomChilds.length; i++) {
            let child;//真实dom节点
            let newVchild = newVdomChilds[i];

            const {
                key
            } = newVchild;
            if (keyed[key]) {//如果有key值 则直接取缓存中的Key值对应的真实dom
                child = keyed[key];
                keyed[key] = undefined;
            } else {//如果没有key值 则优先从缓存的老的Dom节点中查找同类型的第一个节点
                for (let j = min; j < newVdomChildLength; j++) {
                    const cachedNoKeyChildDom = childs[j];
                    if(cachedNoKeyChildDom && isSameNodeType(cachedNoKeyChildDom,newVchild)){
                        child = cachedNoKeyChildDom;
                        childs[j] = undefined;

                        //当有很多子节点 且匹配到中间位置的时候呢？ 从两头不断缩小查找范围
                        if(j===newVdomChildLength-1) newVdomChildLength--;
                        if(j===min) min++;
                        break;
                    }
                }
            }

            child = diff(newVchild,child);//如果没有匹配到 则直接生成虚拟dom的真实dom

            if(child && child !==oldDom && child !==oldChildDoms[i]){
                // 如果更新前的对应位置为空，说明此节点是新增的
                if(!oldChildDoms[i]){
                    oldDom.appendChild(child);
                }else if( oldChildDoms[i].nextSibling===child){// 如果更新后的节点和更新前对应位置的下一个节点一样，说明当前位置的节点被移除了
                    oldDom.removeChild(oldChildDoms[i])
                }else{// 注意insertBefore的用法，第一个参数是要插入的节点，第二个参数是已存在的节点
                    oldDom.insertBefore(child,oldChildDoms[i]);
                }
            }
            console.log('child:',child);
        }
    }

}


function isSameNodeType(dom,vdom) {
    if(typeof vdom === 'string'){//文本节点
        return dom && (typeof dom === 'string'  || dom.nodeType === 3)
    }else if(typeof vdom.tag === 'string'){// dom节点 节点类型一致
        return dom && dom.nodeName.toLowerCase() === vdom.tag.toLowerCase()
    }else if(typeof vdom.tag === 'function'){// 自定义组件
        return dom._component && dom._component.constructor === vdom.tag
    }
    return false;
}
