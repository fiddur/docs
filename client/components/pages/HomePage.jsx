import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import TutorialNavigator from '../quickstarts/TutorialNavigator';
import QuickstartStore from '../../stores/QuickstartStore';
import NavigationStore from '../../stores/NavigationStore';
import UserStore from '../../stores/UserStore';
import CategoryCard from '../CategoryCard';
import TryBanner from '../TryBanner';
import SearchBox from '../SearchBox';
import Spinner from '../Spinner';

class HomePage extends React.Component {

  render() {
    const { cards, quickstarts, isAuthenticated } = this.props;
    const tryBanner = isAuthenticated ? null : <TryBanner />;

    let tutorialNav = <Spinner />;
    if (quickstarts) {
      tutorialNav = <TutorialNavigator largeHeader={false} {...this.props} />;
    }

    let cardElements;
    if (cards) {
      cardElements = cards.map(category => (
        <CategoryCard key={category.id} category={category} />
      ));
    }

    return (
      <div className="docs-home">
        <div className="docs-header">
          <div className="container">
            <h1>Documentation</h1>
          </div>
        </div>
        {tutorialNav}
        {tryBanner}
        <div className="category-cards container center-block">
          <h1>Curated content to fully understand our platform</h1>
          <SearchBox />
          {cardElements}
        </div>
      </div>
    );
  }

}

HomePage.propTypes = {
  isAuthenticated: React.PropTypes.bool.isRequired,
  quickstarts: React.PropTypes.object,
  cards: React.PropTypes.array
};

HomePage.contextTypes = {
  getStore: React.PropTypes.func
};

HomePage = connectToStores(HomePage, [NavigationStore, QuickstartStore], (context, props) => ({
  isAuthenticated: context.getStore(UserStore).isAuthenticated(),
  quickstarts: context.getStore(QuickstartStore).getQuickstarts(),
  cards: context.getStore(NavigationStore).getCards()
}));

export default HomePage;
