import React from 'react';
import FeedbackSender from './FeedbackSender';
import NavigationStore from '../stores/NavigationStore';
import { connectToStores } from 'fluxible-addons-react';

var CategorySection = ({category}) => {
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
    <div>
      <div className="nav-title">
        <h2>{category.name}</h2>
      </div>
      <ul className="nav-content">
        {links.map((doc, i) => {
          return (
            <li key={i}>
              <a href={doc.href}>{doc.name}</a>
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
          <nav className="sidebar-menu">
            <div>
              <div className="principal-title">
                <h2>Documentation</h2>
              </div>
              <div className="principal-content">
                {this.props.categories.map((category) => (
                  <CategorySection key={category.id} category={category} />
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
