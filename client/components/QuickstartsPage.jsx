import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import TutorialNavigator from './TutorialNavigator/TutorialNavigator';
import TutorialStore from '../stores/TutorialStore';
import NavigationBar from './NavigationBar';
import Spinner from './Spinner';
import TryBanner from './TryBanner';

class QuickstartsPage extends React.Component {

  render() {
    const { isAuthenticated } = this.props;
    const isFramedMode = this.props.env.FRAMED_MODE;
    const tryBanner = isAuthenticated ? null : <TryBanner />;

    if (!this.props.quickstarts) {
      return (<Spinner />);
    }

    return (
      <div className="document docs-quickstart-selector">
        {isFramedMode ? undefined : <NavigationBar currentSection="quickstarts" />}
        <TutorialNavigator
          {...this.props}
        />
        {isFramedMode ? undefined : tryBanner}
      </div>
    );
  }

}

QuickstartsPage.contextTypes = {
  getStore: React.PropTypes.func
};

QuickstartsPage.propTypes = {
  isAuthenticated: React.PropTypes.bool,
  quickstarts: React.PropTypes.object
};


QuickstartsPage = connectToStores(QuickstartsPage, [TutorialStore], (context, props) => {
  const store = context.getStore(TutorialStore);
  return {
    quickstarts: store.getQuickstarts()
  };
});

export default QuickstartsPage;
