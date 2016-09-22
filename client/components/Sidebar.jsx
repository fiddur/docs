import * as React from 'react';
import _ from 'lodash';
import { connectToStores } from 'fluxible-addons-react';
import { StickyContainer, Sticky } from 'react-sticky';
import NavigationStore from '../stores/NavigationStore';
import ArticleLink from './ArticleLink';

const SidebarItem = ({ article, currentDepth, maxDepth, handleOnClick }) => {
  let children;
  let icon;

  if (article.children && currentDepth < maxDepth) {
    const newDepth = currentDepth + 1;
    const items = article.children.map(child => (
      <SidebarItem
        handleOnClick={handleOnClick} key={child.url} article={child}
        currentDepth={newDepth} maxDepth={maxDepth}
      />
    ));
    children = <ul className={`sidebar-item-list sidebar-item-list-depth${newDepth}`}>{items}</ul>;
  }

  if (article.icon) {
    icon = <i className={`sidebar-item-icon ${article.icon}`} />;
  }

  return (
    <li className={`sidebar-item sidebar-item-depth${currentDepth}`} onClick={handleOnClick}>
      <ArticleLink article={article}>
        <span className="sidebar-item-name">{article.title}</span>
      </ArticleLink>
      {children}
    </li>
  );
};

SidebarItem.propTypes = {
  handleOnClick: React.PropTypes.func.isRequired
};

class Sidebar extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      openDropdown: false
    };

    this.onSidebarChange = _.throttle(this.onSidebarChange, 300);
    this.handleToggle = this.handleToggle.bind(this);
  }

  componentDidUpdate() {
    this.onSidebarChange();
  }

  onSidebarChange() {
    this.setCurrentList();
  }

  setCurrentList() {
    const $sidebar = $(this._sidebar);
    const containers = '.sidebar-item-list-depth1, .sidebar-item-depth0';

    $(containers).removeClass('is-current');

    return $sidebar.find('.active').parents(containers).addClass('is-current');
  }

  getActiveListOffset() {
    const $activeList = $(this._sidebar).find('.sidebar-item-depth0.is-current');

    if (!$activeList.length) {
      return 0;
    }

    return $activeList.position().top - 10;
  }

  handleToggle() {
    $('html, body').toggleClass('overflow-hidden', !this.state.openDropdown);

    // Set scrollable menu area acording to scroll offset
    const sidebarTopOffset = this.sidebarContent.getBoundingClientRect().top;
    const sidebarHeight = `calc(100vh - ${sidebarTopOffset.toString()}px)`;

    if (!this.state.openDropdown) {
      this.sidebarContent.style.height = sidebarHeight;
    } else {
      this.sidebarContent.style.height = '';
    }

    this.setState({
      openDropdown: !this.state.openDropdown
    });
  }

  componentDidMount() {
    const $activeItem = $(this._sidebar).find('.active');

    this.setCurrentList();

    $(window).on('resize', _.debounce(() => { this.onSidebarChange(); }, 200));

    // Fix Remove IOS Rubber effect
    // https://github.com/luster-io/prevent-overscroll/blob/master/index.js
    function removeIOSRubberEffect(element) {
      element.addEventListener('touchmove', () => {
        const top = element.scrollTop;
        const totalScroll = element.scrollHeight;
        const currentScroll = top + element.offsetHeight;

        if (top === 0) {
          element.scrollTop = 1;
        } else if (currentScroll === totalScroll) {
          element.scrollTop = top - 1;
        }
      });
    }

    removeIOSRubberEffect(this.sidebarScrollable);
  }

  render() {
    let { articles, maxDepth } = this.props;

    let items = undefined;
    if (articles) {
      items = articles.map(article => (
        <SidebarItem
          key={article.url}
          article={article}
          currentDepth={0}
          maxDepth={maxDepth}
          handleOnClick={this.handleToggle}
        />
      ));
    }

    return (
      <Sticky>
        <div ref={(c) => this._sidebar = c} className="sidebar">
          <div className="section-title">{this.props.section}</div>
          <ul
            ref={(e) => { this.sidebarContent = e; }}
            className={`sidebar-item-list sidebar-item-list-depth0 ${this.state.openDropdown ? 'is-dropdown-open' : ''}`}
          >
            <div className="mobile-dropdown-trigger" onClick={this.handleToggle}>
              <h5 className="mobile-dropdown-title">Jump to...</h5>
              <i className={`mobile-dropdown-icon icon-budicon-${this.state.openDropdown ? '462' : '460'}`} />
            </div>
            <div className="mobile-dropdown-content scrollable" ref={(e) => { this.sidebarScrollable = e; }}>
              {items}
            </div>
          </ul>
        </div>
      </Sticky>
    );
  }

}

Sidebar.defaultProps = {
  maxDepth: 2
};

Sidebar.contextTypes = {
  getStore: React.PropTypes.func
};

Sidebar = connectToStores(Sidebar, [NavigationStore], (context, props) => {
  let store = context.getStore(NavigationStore);
  return {
    articles: store.getSidebarArticles(props.section)
  };
});

export default Sidebar;
