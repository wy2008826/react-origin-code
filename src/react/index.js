

class Component {
    constructor(){

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
    createElement
};