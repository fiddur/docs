import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import TutorialNavigator from './TutorialNavigator/TutorialNavigator';
import ApplicationStore from '../stores/ApplicationStore';
import TutorialStore from '../stores/TutorialStore';
import UserStore from '../stores/UserStore';
import NavigationBar from './NavigationBar';
import Spinner from './Spinner';
import TryBanner from './TryBanner';

class QuickstartsPage extends React.Component {

  render() {
    const { quickstarts, isAuthenticated, isFramedMode } = this.props;

    if (!quickstarts) {
      return <Spinner />;
    }

    let navigationBar;
    let tryBanner;
    if (!isFramedMode) {
      navigationBar = <NavigationBar currentSection="quickstarts" />;
    }
    if (isAuthenticated && !isFramedMode) {
      tryBanner = <TryBanner />;
    }

    return (
      <div className="document docs-quickstart-selector">
        {navigationBar}
        <TutorialNavigator {...this.props} />
        {tryBanner}
      </div>
    );
  }

}

QuickstartsPage.contextTypes = {
  getStore: React.PropTypes.func
};

QuickstartsPage.propTypes = {
  isAuthenticated: React.PropTypes.bool.isRequired,
  isFramedMode: React.PropTypes.bool.isRequired,
  quickstarts: React.PropTypes.object
};


QuickstartsPage = connectToStores(QuickstartsPage, [TutorialStore], (context, props) => {
  return {
    quickstarts: context.getStore(TutorialStore).getQuickstarts(),
    isAuthenticated: context.getStore(UserStore).isAuthenticated(),
    isFramedMode: context.getStore(ApplicationStore).isFramedMode()
  };
});

export default QuickstartsPage;
