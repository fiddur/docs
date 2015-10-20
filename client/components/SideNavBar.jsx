import React from 'react';
import {NavLink} from 'fluxible-router';
import FeedbackSender from './FeedbackSender';
import NavigationStore from '../stores/NavigationStore';
import { connectToStores } from 'fluxible-addons-react';

var CategorySection = ({category, baseUrl}) => {
  var links = category.links || [];
  if (links.length === 0) {
    for (let key in category.sections) {
      var section = category.sections[key];
      if (section.href) {
        links.push(section);
      }
    }
  }
  return (
    <div className="accordion" data-accordion="data-accordion">
      <div className="nav-title" data-control="data-control">
        <i className="icon-budicon-461"></i>
        <h2>{category.name}</h2>
      </div>
      <ul className="nav-content" data-content="data-content">
        {links.map((doc, i) => {
          return (
            <li key={i}>
              <a href={baseUrl + doc.href}>{doc.name}</a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

class SideNavBar extends React.Component {
  render() {
    if (this.props && this.props.categories) {
      return (
        <div id="sidebar">
          <nav className="sidebar-menu" data-accordion-group="data-accordion-group">
            <div className="accordion" data-accordion="data-accordion">
              <div className="principal-title" data-control="data-control">
                <i className="plus"></i>
                <h2>Documentation</h2>
              </div>
              <div className="principal-content" data-content="data-content">
                {this.props.categories.map((category) => (
                  <CategorySection key={category.id} category={category} baseUrl={this.props.baseUrl} />
                ))}
              </div>
            </div>
          </nav>
          <FeedbackSender/>
        </div>
      );
    } else {
      return (<div />)
    }
  }
}

SideNavBar.contextTypes = {
  getStore: React.PropTypes.func
};

SideNavBar = connectToStores(SideNavBar, [NavigationStore], (context, props) => ({
  categories: context.getStore(NavigationStore).getCategories()
}));

export default SideNavBar;
