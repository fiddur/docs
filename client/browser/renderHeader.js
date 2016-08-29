import React from 'react';
import ReactDOM from 'react-dom';
import Header from '../components/Header';

export default () => {
  ReactDOM.render(React.createElement(Header, null), document.getElementById('header'));
};
