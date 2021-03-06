// import React from 'react';
// import ReactDOM from 'react-dom';

import React from './react/';
import ReactDOM from './react-dom/';


import * as serviceWorker from './serviceWorker';


// 虚拟dom  转换为真实dom  babel转换成虚拟dom
const jsx = <div title='title'
    className='jsx'
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
    return <div className={'Fn-Comp'}>
        FnComp {props.title}
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
        return <div className={'Class-Comp'}>
            ClassComp
        </div>;
    }
}

// console.log('jsx:', jsx, '\n\nFnComp:',FnComp,'\n\n<FnComp />',<FnComp title='FnComp'/>, 'ClassJsx',<ClassComp  title='ClassComp'/>);
console.log('FnComp\n',<FnComp title='FnComp'/>);

console.log('ClassComp\n',<ClassComp  title='ClassComp'/>);


class Home extends React.Component{
    state={
        num:1
    }
    addNum =()=>{
        for(let i=0;i<100;i++){
            this.setState((prevState)=>{
                console.log('prevState:',prevState.num);
                return {
                    num:prevState.num+1
                }
            })
        }
        console.log('this.state1',this.state.num);
        Promise.resolve().then(()=>{
            console.log('this.state',this.state.num);
        });
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
            2:<FnComp key={'FnComp'} title='FnComp'/>,
            3:<FnComp key={'FnComp1'} title='FnComp1'/>,
            4:<ClassComp  key={'ClassComp'} title='ClassComp'/>
        }

        return  <div key='Home-Container' className={'Home-Container'}>
            <button key={'button'} onClick={this.addNum}>
                {num}
                <span>
                    Home:num
                </span>
            </button>
            <ul>
                {
                    [1,2,3].map((item)=>{
                        return <p>{item}</p>
                    })
                }
            </ul>
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
