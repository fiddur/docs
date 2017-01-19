import React, { Component, PropTypes } from 'react';

const getAnimationStyle = (delay) => ({
  animationDelay: `${delay}ms`,
  WebkitAnimationDelay: `${delay}ms`,
  animationDuration: '200ms',
  WebkitAnimationDuration: '200ms',
  animationTimingFunction: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
  WebkitAnimationTimingFunction: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)'
});

const QuickstartSuggestItem = ({ title, delay, handleClick }) =>
  <li className="animated scaleIn" style={getAnimationStyle(delay)}>
    <div
      className="circle-logo suggest-quickstart"
      onClick={handleClick}
    >
      <div className="logo" />
      <div className="title">{title}</div>
    </div>
  </li>;

QuickstartSuggestItem.propTypes = {
  title: PropTypes.string.isRequired,
  delay: PropTypes.number.isRequired,
  handleClick: PropTypes.func.isRequired
};

export default QuickstartSuggestItem;
