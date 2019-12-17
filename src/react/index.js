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
    //移除冗余的attrs属性
    const {
        __source,
        __self,
        ..._attrs
    } =attrs;

    return {
        tag,
        attrs:_attrs,
        childrens
    }
}


export default {
    Component,
    createElement
};
