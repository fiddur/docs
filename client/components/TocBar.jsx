import React, { PropTypes } from 'react';
import _ from 'lodash';

class TocDropdown extends React.Component {
  constructor() {
    super();

    this.state = {
      open: false
    };

    this.renderItems = this.renderItems.bind(this);
    this.renderList = this.renderList.bind(this);
    this.buildArticleHierarchy = this.buildArticleHierarchy.bind(this);
    this.handleScroll = _.throttle(this.handleScroll, 200).bind(this);

    this.items = this.buildArticleHierarchy();
  }
  componentDidMount() {
    this.handleScroll();
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.handleScroll);
  }
  buildArticleHierarchy() {
    const titles = $('.docs-content').find('h2.anchor-heading, h3.anchor-heading');

    return $.makeArray(titles)
      .reduce((prev, current) => {
        const newHeadingNode = {
          name: $(current).text(),
          id: $(current).attr('id'),
          children: []
        };

        // Add an object representing the <h2> title to the array
        if (current.tagName === 'H2') return prev.concat(newHeadingNode);

        // Add an object representing the <h3> title to the last node of an <h2> title
        const lastTitleNode = prev[prev.length - 1];
        // Add the <h3> node to the children list of the <h2> node
        const newTitleNode = Object.assign({}, lastTitleNode, {
          children: lastTitleNode.children.concat(newHeadingNode)
        });
        return prev.slice(0, prev.length - 1).concat(newTitleNode);
      }, []);
  }
  handleScroll() {
    const bottomScroll = this.tocContainer.getBoundingClientRect().bottom;
    if (bottomScroll < -10) {
      // stick
      this.tocBar.classList.add('toc-sticky');
      this.tocBar.setAttribute('style', `width: ${this.tocContainer.offsetWidth}px`);
      this.tocBar.style.width = `${this.tocContainer.offsetWidth}px`;
      return;
    }

    // unstick
    this.tocBar.classList.remove('toc-sticky');
    this.tocBar.setAttribute('style', '');
    this.tocBar.style.width = '';
  }
  renderList(itemList, depth = 1) {
    return (
      <ul className={`toc-dropdown-list toc-dropdown-list-depth-${depth}`}>
        {
          itemList.map((item) =>
            <li className="toc-dropdown-item" key={item.id}>
              <a
                href={`#${item.id}`}
                className={`item-link item-link-depth-${depth}`}
                onClick={() => { this.setState({ open: false }); }}
              >
                {item.name}
              </a>
              { item.children && this.renderList(item.children, depth + 1) }
            </li>
          )
        }
      </ul>
    );
  }
  renderItems() {
    return this.renderList(this.items);
  }
  render() {
    return (
      <div className="toc-bar-container" ref={node => (this.tocContainer = node)}>
        <div className="toc-bar" ref={node => (this.tocBar = node)}>
          <h4 className="toc-title">{this.props.title}</h4>
          <div className={`toc-dropdown ${this.state.open ? 'toc-dropdown-open' : ''}`}>
            <div
              className="toc-dropdown-title"
              onClick={() => { this.setState({ open: !this.state.open }); }}
            >
              <span className="text">In this article</span>
              <i className="icon icon-budicon-460" />
            </div>
            <div className="toc-dropdown-content">
              {this.renderItems()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

TocDropdown.propTypes = {
  title: PropTypes.string.isRequired
};

export default TocDropdown;
