

class Component {
    constructor(props){
        this.props=props;
        this.state={}
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