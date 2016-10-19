import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import TutorialNavigator from './TutorialNavigator/TutorialNavigator';
import TutorialStore from '../stores/TutorialStore';
import NavigationStore from '../stores/NavigationStore';
import CategoryCard from './CategoryCard';
import TryBanner from './TryBanner';
import SearchBox from './SearchBox';
import Spinner from './Spinner';

class Home extends React.Component {

  renderTutorialNav() {
    if (!this.props.quickstarts) {
      return <Spinner />;
    }

    return <TutorialNavigator {...this.props} />;
  }

  render() {
    const { cards, isAuthenticated } = this.props;
    const tryBanner = isAuthenticated ? null : <TryBanner />;

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
        {this.renderTutorialNav()}
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
  isAuthenticated: React.PropTypes.bool,
  quickstarts: React.PropTypes.object,
  cards: React.PropTypes.array
};

Home.contextTypes = {
  getStore: React.PropTypes.func
};

Home = connectToStores(Home, [NavigationStore, TutorialStore], (context, props) => ({
  quickstarts: context.getStore(TutorialStore).getQuickstarts(),
  cards: context.getStore(NavigationStore).getCards()
}));

export default Home;
