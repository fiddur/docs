import React from 'react';
import { TutorialNavigator } from 'auth0-tutorial-navigator';
import { quickstartNavigationAction } from '../action/quickstartNavigationAction';
import NavigationBar from './NavigationBar';

class QuickstartsPage extends React.Component {

  render() {
    return (
      <div className="document docs-quickstart-selector">
        <NavigationBar currentSection="quickstarts" />
        <TutorialNavigator
          {...this.props}
          customNavigationAction={quickstartNavigationAction}
          componentLoadedInBrowser={() => {}}
        />
      </div>
    );
  }

}

export default QuickstartsPage;
