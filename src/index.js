// import React from 'react';
// import ReactDOM from 'react-dom';

import React from './react/';
import ReactDOM from './react-dom/';


import * as serviceWorker from './serviceWorker';


// 虚拟dom  转换为真实dom  babel转换成虚拟dom
const jsx = <div title='title'>
    hello 
    <span>React</span>
</div>;

/** 
jsx = React.createElement("div", {
    title: "title"
}, "hello", React.createElement("span", null, "React"));
  
**/

console.log('jsx:',jsx);
ReactDOM.render(jsx, document.getElementById('root'));



serviceWorker.unregister();
