import React from 'react';
import ShowcaseItem from './ShowcaseItem';
import CircleLogo from './CircleLogo';
import HowTo from './HowTo';
import {NavLink} from 'fluxible-router';
import TableOfContents from './TableOfContents';





export default class HomeSectionContainer extends React.Component {
  render() {
    return (
      <section className="section-product" id={this.props.id}>
        <div className="container">
          <h2>
            <span>{this.props.name}</span>
            <span>{this.props.description}</span>
          </h2>
        </div>
        {this.props.children}
      </section>
    );
  }
};
