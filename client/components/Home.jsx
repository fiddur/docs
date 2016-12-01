import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import TutorialNavigator from './TutorialNavigator/TutorialNavigator';
import TutorialStore from '../stores/TutorialStore';
import NavigationStore from '../stores/NavigationStore';
import UserStore from '../stores/UserStore';
import CategoryCard from './CategoryCard';
import TryBanner from './TryBanner';
import SearchBox from './SearchBox';
import Spinner from './Spinner';

class Home extends React.Component {

  render() {
    const { cards, quickstarts, isAuthenticated } = this.props;
    const tryBanner = isAuthenticated ? null : <TryBanner />;

    let tutorialNav = <Spinner />;
    if (quickstarts) {
      tutorialNav = <TutorialNavigator {...this.props} />;
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

Home.propTypes = {
  isAuthenticated: React.PropTypes.bool.isRequired,
  quickstarts: React.PropTypes.object,
  cards: React.PropTypes.array
};

Home.contextTypes = {
  getStore: React.PropTypes.func
};

Home = connectToStores(Home, [NavigationStore, TutorialStore], (context, props) => ({
  isAuthenticated: context.getStore(UserStore).isAuthenticated(),
  quickstarts: context.getStore(TutorialStore).getQuickstarts(),
  cards: context.getStore(NavigationStore).getCards()
}));

export default Home;
