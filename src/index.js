// import React from 'react';
// import ReactDOM from 'react-dom';

import React from './react/';
import ReactDOM from './react-dom/';


import * as serviceWorker from './serviceWorker';


// 虚拟dom  转换为真实dom  babel转换成虚拟dom
const jsx = <div title='title'
    className='title-head'
    onClick={() => { alert(123) }}
>
    <span style='background-color:#f95'>hello</span>
    <span style={{ color: 'red' ,'backgroundColor':'#f95'}}>jsx</span>
</div>;

/** 
 *以上代码经过babel转换后，相当于如下代码：  
jsx = React.createElement("div", {
    title: "title"
}, "hello", React.createElement("span", null, "React"));

所以只要有jsx的地方  都需要引入 React,因为jsx会转换成 React.createElement

**/


/**
 * jsx经过 React.createElement 处理后，转换成层级很深的object对象 
 * ReactDom.render 函数会处理这个Object对象转换成真实的dom对象
 * 
 * **/


const FnComp= (props) => {
    return <div>
        {jsx}
        {/* {props.title} */}
    </div>;
}

class ClassComp extends React.Component {
    constructor(props){
        super(props);
        this.state ={
            num:0
        }
    }
    render() {
        return <div>
            {jsx}
            <p onClick={()=>{this.setState({num:this.state.num+1})}}>
                {this.state.num}
            </p>
            {/* {this.props.title} */}
        </div>;
    }
}

console.log('jsx:', jsx, 'Fnjsx:',<FnComp title='FnComp'/>, 'ClassJsx',<ClassComp  title='ClassComp'/>);

ReactDOM.render(<div>
    {jsx}
    <FnComp title='FnComp'/>
    <ClassComp  title='ClassComp'/> 
</div>, document.getElementById('root'));



serviceWorker.unregister();
