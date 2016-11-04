import React, { PropTypes } from 'react';
import _ from 'lodash';

// http://codereview.stackexchange.com/a/109905
const toSpinalTapCase = str =>
  str
    .replace(/(?!^)([A-Z])/g, ' $1')
    .replace(/[_\s]+(?=[a-zA-Z])/g, '-')
    .toLowerCase();

// If item doesn't have an id then default to the spinal tap case of the name
const replaceItemsID = list =>
  list.map(item =>
    Object.assign({}, item, {
      id: item.id ? item.id : toSpinalTapCase(item.name),
      children: item.children ? replaceItemsID(item.children) : undefined
    })
  );

class TocDropdown extends React.Component {
  constructor() {
    super();

    this.renderItems = this.renderItems.bind(this);
    this.renderList = this.renderList.bind(this);
    this.handleScroll = _.throttle(this.handleScroll, 200).bind(this);
  }
  componentDidMount() {
    document.onscroll = this.handleScroll;
  }
  handleScroll() {
    const bottomScroll = this.tocContainer.getBoundingClientRect().bottom;
    if (bottomScroll < -10) {
      // stick
      this.tocContainer.classList.add('toc-sticky');
      this.tocBar.setAttribute('style', `width: ${this.tocContainer.offsetWidth}px`);
      this.tocBar.style.width = `${this.tocContainer.offsetWidth}px`;
      return;
    }

    // unstick
    this.tocContainer.classList.remove('toc-sticky');
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
    return this.renderList(replaceItemsID(this.props.items));
  }
  render() {
    return (
      <div className="toc-bar-container" ref={node => (this.tocContainer = node)}>
        <div className="toc-bar" ref={node => (this.tocBar = node)}>
          <h4 className="toc-title">{this.props.title}</h4>
          <div className="toc-dropdown">
            <span className="toc-dropdown-title">
              <span className="text">On this article</span>
              <i className="icon icon-budicon-460" />
            </span>
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
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      id: PropTypes.string,
      children: PropTypes.array
    })
  ).isRequired
};

export default TocDropdown;
