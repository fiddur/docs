import * as React from 'react';
import _ from 'lodash';
import { connectToStores } from 'fluxible-addons-react';
import NavigationStore from '../stores/NavigationStore';
import ArticleLink from './ArticleLink';
import { StickyContainer, Sticky } from 'react-sticky';

const SidebarItem = ({ article, currentDepth, maxDepth }) => {
  let children = undefined;
  if (article.children && currentDepth < maxDepth) {
    const newDepth = currentDepth + 1;
    const items = article.children.map(child => (
      <SidebarItem key={child.url} article={child} currentDepth={newDepth} maxDepth={maxDepth} />
    ));
    children = <ul className={'sidebar-item-list sidebar-item-list-depth' + newDepth}>{items}</ul>;
  }

  let icon = undefined;
  if (article.icon) {
    icon = <i className={'sidebar-item-icon ' + article.icon} />;
  }

  return (
    <li className={'sidebar-item sidebar-item-depth' + currentDepth}>
      <ArticleLink article={article}>
        <span className="sidebar-item-name">{article.title}</span>
      </ArticleLink>
      {children}
    </li>
  );
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

    const newDuration = this.getScrollDuration();
    const newOffset = this.getActiveListOffset();

    this.scrollScene.duration(newDuration);
    this.scrollScene.offset(newOffset);
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

  getScrollDuration() {
    const self = $(this._sidebar).height();
    const height = $('.docs-content').height() - Math.max(self, 600);

    if (height <= self || window.matchMedia('(max-width: 768px)').matches) {
      return 1;
    }

    return height;
  }

  handleToggle() {
    document.body.classList.toggle('overflow-hidden', !this.state.openDropdown)
    this.setState({
      openDropdown: !this.state.openDropdown
    });
  }

  componentDidMount() {
    const $activeItem = $(this._sidebar).find('.active');

    this.setCurrentList();

    this.scrollController = new ScrollMagic.Controller();
    this.scrollScene = new ScrollMagic.Scene({
      duration: this.getScrollDuration(),
      triggerElement: '.docs-content',
      triggerHook: 0,
      offset: $activeItem.length ? this.getActiveListOffset() : 0
    });

    this.scrollScene.setPin('.sidebar', { pushFollowers: false }).addTo(this.scrollController);

    $(window).on('resize', _.debounce(() => { this.onSidebarChange(); }, 200));
  }

  render() {
    let { articles, maxDepth } = this.props;

    let items = undefined;
    if (articles) {
      items = articles.map(article => (
        <SidebarItem key={article.url} article={article} currentDepth={0} maxDepth={maxDepth} />
      ));
    }

    if (this.scrollScene) {
      this.scrollScene.destroy(true);
      this.scrollController.destroy(true);
    }

    return (
      <Sticky>
        <div ref={(c) => this._sidebar = c} className="sidebar">
          { /* <div className="section-title">{this.props.sectionTitle}</div> */ }
          <ul className={`sidebar-item-list sidebar-item-list-depth0 ${this.state.openDropdown ? 'is-dropdown-open' : ''}`}>
            <div className="mobile-dropdown-trigger visible-xs" onClick={this.handleToggle}>
              <h5 className="mobile-dropdown-title">Jump to...</h5>
              <i className="mobile-dropdown-icon icon-budicon-460" />
            </div>
            <div className="mobile-dropdown-content">
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
    section: store.getCurrentSection(),
    articles: store.getCurrentSidebarArticles()
  };
});

export default Sidebar;
