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
    <span style={{'backgroundColor':'#f95'}}>A </span>
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

// console.log('jsx:', jsx, '\n\nFnComp:',FnComp,'\n\n<FnComp />',<FnComp title='FnComp'/>, 'ClassJsx',<ClassComp  title='ClassComp'/>);


class Home extends React.Component{
    state={
        num:0
    }
    addNum =()=>{
        this.setState({
            num:this.state.num+1
        })
    }
    shouldComponentUpdate(){
        console.log('shouldComponentUpdate');
    }
    componentWillReceiveProps(props){
        console.log('componentWillReceiveProps');
    }
    componentWillMount(){
        console.log('componentWillMount');
    }
    componentDidMount(){
        console.log('componentDidMount');
    }
    componentWillUpdate(){
        console.log('componentWillUpdate');
    }
    componentDidUpdate(){
        console.log('componentDidUpdate');
    }
    render(){
        const {
            num
        } = this.state;

        const config = {
            1:jsx,
            2:<FnComp title='FnComp'/>,
            3:<FnComp title='FnComp'/>,
            4:<ClassComp  title='ClassComp'/>
        }
        return  <div>
            <button onClick={this.addNum}>
                Home:num {num}
            </button>

            { config[num] || '其他组件'}
        </div>
    }
}


const root = document.getElementById('root');
ReactDOM.render(<Home key={111} name={123} />, root);


//这种方式 children没有挂载？
// ReactDOM.render(<Home name={123} >
//     <FnComp title='FnComp'/>
//     <ClassComp  title='ClassComp'/>
// </Home>, document.getElementById('root'));



serviceWorker.unregister();
