import React from 'react';
import SearchBox from './SearchBox';
import Breadcrumbs from './Breadcrumbs';
import { CategorySection } from './NavigationSections';
import NavigationStore from '../stores/NavigationStore';
import { connectToStores, provideContext } from 'fluxible-addons-react';
import { handleHistory } from 'fluxible-router';
import _ from 'lodash';

class CategorySectionPage extends React.Component {


  render() {
    var page = this.props.currentRoute.get('page');
    var category = _.find(this.props.categories, { id: page });
    if (!category) {
      return (<div />);
    }

    var breadcrumbs = [{ name: category.name }];

    return (
      <div className="docs-single">
        <div className="navigation-bar">
          <div className="wrapper">
            <div className="container">
              <Breadcrumbs links={breadcrumbs} />
              <SearchBox />
            </div>
          </div>
        </div>
        <CategorySection category={category} linkTo={false} />
      </div>
    );
  }
}

CategorySectionPage.contextTypes = {
  getStore: React.PropTypes.func
};

CategorySectionPage = handleHistory(CategorySectionPage);
CategorySectionPage = connectToStores(CategorySectionPage, [NavigationStore], (context, props) => ({
  categories: context.getStore(NavigationStore).getCategories()
}));

export default CategorySectionPage;
