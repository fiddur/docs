import React, { createElement } from 'react';
import { render } from 'react-dom';
import Header from '../../universal/components/Header';

const renderHeader = () => render(<Header />, document.getElementById('header'));

export default renderHeader;
