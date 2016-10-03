import React from 'react';
import {connectToStores} from 'fluxible-addons-react';
import {TutorialNavigator} from 'auth0-tutorial-navigator';
import {quickstartNavigationAction} from '../action/quickstartNavigationAction';
import NavigationStore from '../stores/NavigationStore';
import CategoryCard from './CategoryCard';
import TryBanner from './TryBanner';
import SearchBox from './SearchBox';

class Home extends React.Component {

  render() {

    let {cardDefinitions, isAuthenticated} = this.props;
    let tryBanner = isAuthenticated ? null : <TryBanner/>;

    let cards = cardDefinitions.map(category => (
      <CategoryCard key={category.id} category={category} />
    ));

    return (
      <div className="docs-home">
        <div className="docs-header">
          <div className="container">
            <h1>Documentation</h1>
          </div>
        </div>
        <TutorialNavigator
          {...this.props}
          customNavigationAction={quickstartNavigationAction}
          componentLoadedInBrowser={() => {}}
        />
        {tryBanner}
        <div className="category-cards container center-block">
          <h1>Curated content to fully understand our platform</h1>
          <SearchBox />
          {cards}
        </div>
      </div>
    );
  }

}

Home.propTypes = {
  isAuthenticated: React.PropTypes.bool
}

Home.contextTypes = {
  getStore: React.PropTypes.func
};

Home = connectToStores(Home, [NavigationStore], (context, props) => ({
  cardDefinitions: context.getStore(NavigationStore).getCards()
}));

export default Home;
