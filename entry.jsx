import React from 'react';
import ReactDOM from 'react-dom';
// import $ from 'jquery';
// import environment from "./environment";

class Root extends React.Component {
	render() {
		return (<p>Hello world!</p>);
	}
}

document.addEventListener("DOMContentLoaded", () => {
	const root = document.getElementById("root");
	ReactDOM.render(<Root/>, root);
  });

  window.environment = environment;
