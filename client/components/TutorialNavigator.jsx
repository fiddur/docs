import React from 'react';
import TutorialStore from '../stores/TutorialStore';
//import TenantSwitcher from './TenantSwitcher';
import Breadcrumbs from './Breadcrumbs';
import QuickstartList from './QuickstartList';
import TechList from './TechList';
import { connectToStores, provideContext } from 'fluxible-addons-react';
import {navigateAction} from 'fluxible-router';
import { getQuestion } from '../util/tutorials';

class TutorialNavigator extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = this.getStoreState();
  }
  getStoreState () {
    return this.context.getStore(TutorialStore).getState();
  }
  componentDidMount () {
    this.context
      .getStore(TutorialStore)
      .addChangeListener(this._onStoreChange.bind(this));
  }
  componentWillUnmount () {
    this.context
      .getStore(TutorialStore)
      .removeChangeListener(this._onStoreChange.bind(this));
  }
  _onStoreChange () {
    this.setState(this.getStoreState());
  }
  handleSkip() {
    //var platformSlug = this.context.getStore(TutorialStore).getPlatformSlug(this.state.appType);
    var url = '/quickstart/' + this.state.appType + '/' + this.state.tech1 + '/no-api/';
    this.context.executeAction(navigateAction, {
      url: url
    });
  }
  getTenantSwitcher() {
    if(!this.props.userTenants || this.props.userTenants.length < 2) {
      return false;
    }

    return (
      <TenantSwitcher />
    );
  }
  render() {
    var hasMoreTenants = this.props.userTenants && this.props.userTenants.length > 1;

    var picker;
    if (this.state.appType) {
      picker = (<TechList />);
    } else {
      picker = (<QuickstartList />);
    }

    return (
      <div id="tutorial-navigator">
        <div className='js-tutorial-navigator'>
          <div className="banner tutorial-wizard">
            <div className="container">
              <h1>Documentation</h1>

              <p className={(hasMoreTenants && !this.state.appType) ? 'hide' : 'question-text'}>{getQuestion(this.state.appType)}</p>

              {this.getTenantSwitcher()}

              <button href="#" data-skip onClick={this.handleSkip}
                className={(this.state.skippable) ? '' : 'hide' }>No, skip this</button>
              <br />
              <Breadcrumbs />

            </div>

            {picker}

          </div>
        </div>
      </div>
    );
  }
}

TutorialNavigator.contextTypes = {
  getStore: React.PropTypes.func,
  executeAction: React.PropTypes.func,
};

export default TutorialNavigator;
