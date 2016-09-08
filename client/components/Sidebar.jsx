import * as React from 'react';
import _ from 'lodash';
import NavigationStore from '../stores/NavigationStore';
import {connectToStores} from 'fluxible-addons-react';
import ArticleLink from './ArticleLink';

let SidebarItem = ({article, currentDepth, maxDepth}) => {

  let children = undefined;
  if (article.children && currentDepth < maxDepth) {
    let newDepth = currentDepth + 1;
    let items = article.children.map(child => (
      <SidebarItem key={child.url} article={child} currentDepth={newDepth} maxDepth={maxDepth} />
    ));
    children = <ul className={"sidebar-item-list sidebar-item-list-depth" + newDepth}>{items}</ul>;
  }

  let icon = undefined;
  if (article.icon) {
    icon = <i className={"sidebar-item-icon " + article.icon} />;
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
    this.onSidebarChange = _.throttle(this.onSidebarChange, 300);
  }
  
  componentDidUpdate() {
     this.onSidebarChange()
  }
  
  onSidebarChange() {
    this.setCurrentList();
    
    let newDuration = this.getScrollDuration();
    let newOffset = this.getActiveListOffset();
    
    this.scrollScene.duration(newDuration);
    this.scrollScene.offset(newOffset);
  }
  
  setCurrentList() {    
    let $sidebar = $(this._sidebar);
    let containers = '.sidebar-item-list-depth1, .sidebar-item-depth0';
    
    $(containers).removeClass('is-current');
    
    return $sidebar.find('.active').parents(containers).addClass('is-current');
  }
  
  getActiveListOffset() {  
    let $activeList = $(this._sidebar).find('.sidebar-item-depth0.is-current');
      
    if(!$activeList.length) {
      return 0;
    }
      
    return $activeList.position().top - 10;
  }
  
  getScrollDuration() {
    let self = $(this._sidebar).height();    
    let height = $('.docs-content').height() - Math.max(self, 600);
    
    if(height <= self || window.matchMedia("(max-width: 768px)").matches) {
      return 1;
    }
    
    return height;
  }
  
  componentDidMount() {  
    let $activeItem = $(this._sidebar).find('.active');
      
    this.setCurrentList();
    
    this.scrollController = new ScrollMagic.Controller();
    this.scrollScene = new ScrollMagic.Scene({
      duration: this.getScrollDuration(),
      triggerElement: ".docs-content",
      triggerHook: 0,
      offset: $activeItem.length ? this.getActiveListOffset() : 0
    });
  
    this.scrollScene.setPin(".sidebar", {pushFollowers: false}).addTo(this.scrollController);
    
    $(window).on('resize', _.debounce(() => { this.onSidebarChange() }, 200));
  }

  render() {
    let {articles, maxDepth} = this.props;

    let items = undefined;
    if (articles) {
      items = articles.map(article => (
        <SidebarItem key={article.url} article={article} currentDepth={0} maxDepth={maxDepth} />
      ));
    }

    return (
      <div ref={(c) => this._sidebar = c} className="sidebar">
        <div className="section-title">{this.props.sectionTitle}</div>
        <ul className="sidebar-item-list sidebar-item-list-depth0">
          {items}
        </ul>
      </div>
    );

  }

}

Sidebar.defaultProps = {
  maxDepth: 2
}

Sidebar.contextTypes = {
  getStore: React.PropTypes.func
};

Sidebar = connectToStores(Sidebar, [NavigationStore], (context, props) => {  
  return {
    articles: context.getStore(NavigationStore).getCurrentSidebarArticles()
  };
});

export default Sidebar;
