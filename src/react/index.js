import {renderComponent} from '../react-dom'

class Component {
    constructor(props={}){
        this.props=props;
        this.state={}
    }
    setState(changedState){
        Object.assign(this.state,changedState||{});
        renderComponent(this);
    }
}


const createElement = (tag,attrs,...childrens)=>{
    // createElement 为什么在组件更新的时候也会执行？

    // console.log('createElement');
    //移除冗余的attrs属性
    let {
        __source,
        __self,
        key,
        ..._attrs
    } =attrs;

    return {
        tag,
        attrs:_attrs,
        childrens,
        key
    }
}


export default {
    Component,
    createElement
};
