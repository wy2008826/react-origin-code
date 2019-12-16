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
    return {
        tag,
        attrs,
        childrens
    }
}


export default {
    Component,
    createElement
};