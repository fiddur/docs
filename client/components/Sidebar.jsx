import * as React from 'react';
import _ from 'lodash';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connectToStores } from 'fluxible-addons-react';
import { StickyContainer, Sticky } from 'react-sticky';
import NavigationStore from '../stores/NavigationStore';
import SidebarItem from './SidebarItem';
import normalizeUrl from '../util/normalizeUrl';

class Sidebar extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      openDropdown: false,
      breadcrumb: 'Jump to...'
    };

    this.onSidebarChange = _.throttle(this.onSidebarChange, 300);
    this.handleToggle = this.handleToggle.bind(this);
    this.getBreadcrumb = this.getBreadcrumb.bind(this);
  }

  componentDidMount() {
    const $activeItem = $(this.sidebar).find('.active');

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

    this.getBreadcrumb();
  }

  componentWillReceiveProps(nextProps) {
    this.getBreadcrumb();
  }

  shouldComponentUpdate(nextProps, nextState) {
    // There are situations when the pages are transitioning when the section or the url
    // may not yet be known. To provide a smooth transition we dont want to rerender this
    // component until the new page's values are set.
    if (!nextProps.section || !nextProps.url) {
      return false;
    }
    return PureRenderMixin.shouldComponentUpdate(this, nextProps, nextState);
  }

  componentDidUpdate() {
    this.onSidebarChange();
  }

  onSidebarChange() {
    this.setCurrentList();
  }

  setCurrentList() {
    const $sidebar = $(this.sidebar);
    const containers = '.sidebar-item-list-depth1, .sidebar-item-depth0';

    $(containers).removeClass('is-current');

    // Quick fix for quickstarts page and duplicate url
    // When entering to an url like http://auth0.com/docs/quickstart/native/android
    // display the first article of the technology as selected
    if (this.props.isQuickstart && this.props.items.length) {
      const firstElemUrl = normalizeUrl(this.props.items[0].url);
      const technologyUrl = firstElemUrl.substr(0, firstElemUrl.lastIndexOf('/'));

      if (technologyUrl === this.props.url) {
        return $(containers).first().addClass('is-current');
      }
    }

    return $sidebar.find('.active').parents(containers).addClass('is-current');
  }

  getActiveListOffset() {
    const $activeList = $(this.sidebar).find('.sidebar-item-depth0.is-current');

    if (!$activeList.length) {
      return 0;
    }

    return $activeList.position().top - 10;
  }

  getBreadcrumb() {
    const { items, url, includeSectionInBreadcrumb, isQuickstart, section } = this.props;

    const arrow = '<i class="arrow-icon icon-budicon-461"></i>';
    let breadcrumb = '';

    const checkPath = (item) => {
      // Check if the item path is equals to the pathname
      if (item.url === url) {
        breadcrumb = item.title;
        return true;
      }

      // Check all of the childrens
      if (item.children) {
        // If the children is the selected item, add all parents title to the breadcrumb
        if (item.children.some(checkPath)) {
          breadcrumb = `${item.title} ${arrow} ${breadcrumb}`;
          return true;
        }
      }

      return false;
    };

    items.some(checkPath);

    if (breadcrumb && includeSectionInBreadcrumb) {
      breadcrumb = `${section} ${arrow} ${breadcrumb}`;
    }

    // Quick fix for quickstarts page and duplicate url
    // When entering to an url like http://auth0.com/docs/quickstart/native/android
    // display the first article title as selected in the breadcrumb
    if (!breadcrumb && isQuickstart) {
      breadcrumb = items.length ? (
        `${section} ${arrow} ${items[0].title}`
      ) : (
        `${section}`
      );
    }

    if (breadcrumb) this.setState({ breadcrumb });
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

  renderItems() {
    return this.props.items.map(item => (
      <SidebarItem
        key={item.url}
        article={item}
        currentDepth={0}
        maxDepth={this.props.maxDepth}
        handleOnClick={this.handleToggle}
      />
    ));
  }

  render() {
    const { items, maxDepth, section } = this.props;
    const { openDropdown, breadcrumb } = this.state;

    return (
      <Sticky>
        <div ref={(c) => (this.sidebar = c)} className="sidebar">
          <div className="section-title">{section}</div>
          <ul
            ref={(e) => { this.sidebarContent = e; }}
            className={`
              sidebar-item-list
              sidebar-item-list-depth0
              ${openDropdown ? 'is-dropdown-open' : ''}
            `}
          >
            <div className="mobile-dropdown-trigger" onClick={this.handleToggle}>
              <h5 className="mobile-dropdown-title">
                <span dangerouslySetInnerHTML={{ __html: breadcrumb }} />
              </h5>
              <i className={`mobile-dropdown-icon icon-budicon-${openDropdown ? '462' : '460'}`} />
            </div>
            <div
              className="mobile-dropdown-content scrollable"
              ref={(e) => { this.sidebarScrollable = e; }}
            >
              { this.renderItems() }
            </div>
          </ul>
        </div>
      </Sticky>
    );
  }

}

Sidebar.propTypes = {
  // Note: section and url required because of state change, see shouldComponentUpdate
  items: React.PropTypes.array.isRequired,
  section: React.PropTypes.string,
  maxDepth: React.PropTypes.number,
  url: React.PropTypes.string,
  includeSectionInBreadcrumb: React.PropTypes.bool,
  isQuickstart: React.PropTypes.bool
};

Sidebar.defaultProps = {
  maxDepth: 2,
  includeSectionInBreadcrumb: false
};

export default Sidebar;
