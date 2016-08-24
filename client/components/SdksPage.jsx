import React from 'react';
import NavigationStore from '../stores/NavigationStore';
import {NavLink} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import NavigationBar from './NavigationBar';
import CircleLogo from './CircleLogo';

class SdksPage extends React.Component {

  render() {

    let {platforms} = this.props;

    let items = undefined;
    if (platforms) {
      items = platforms.map((platform, idx) => {
        return <CircleLogo key={idx} platform={platform} delay={20 * idx} />;
      })
    }

    return (
      <div className="document">
        <NavigationBar />
        <div className="container">
          <ul className="sdk-platform-list circle-list">
            <h1>Select a platform</h1>
            {items}
          </ul>
        </div>
      </div>
    );

  }

}

SdksPage.contextTypes = {
  getStore: React.PropTypes.func
};

SdksPage = connectToStores(SdksPage, [NavigationStore], (context, props) => {
  return {
    platforms: context.getStore(NavigationStore).getPlatforms()
  };
});

export default SdksPage;
