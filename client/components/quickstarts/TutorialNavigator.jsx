import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import Breadcrumbs from './Breadcrumbs';
import QuickstartList from './QuickstartList';
import PlatformList from './PlatformList';
import {
    sendTutorialViewedEvent,
    sendPackageDownloadedEvent
} from '../../browser/quickstartMetrics';
import ApplicationStore from '../../stores/ApplicationStore';
import QuickstartStore from '../../stores/QuickstartStore';

const shouldSendMetrics = (quickstart, prevQuickstart = undefined) =>
  quickstart && (!prevQuickstart || prevQuickstart.slug !== quickstart.slug);

class TutorialNavigator extends React.Component {

  constructor() {
    super();

    this.state = {
      searchTerm: ''
    };

    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  componentDidMount() {
    if (shouldSendMetrics(this.props.quickstart)) this.handleMetrics();
  }

  componentDidUpdate(prevProps) {
    if (shouldSendMetrics(this.props.quickstart, prevProps.quickstart)) this.handleMetrics();
  }

  handleMetrics() {
    if (typeof document !== 'undefined') {
      sendTutorialViewedEvent(this.props);
    }
  }

  handleSearchChange(e) {
    this.setState({
      searchTerm: e.target.value
    });
  }

  render() {
    const { quickstart, firstQuestion } = this.props;

    let picker;
    let question;
    let breadcrumbs;

    if (quickstart) {
      picker = <PlatformList searchTerm={this.state.searchTerm} {...this.props} />;
      question = quickstart.question;
      breadcrumbs = <Breadcrumbs {...this.props} />;
    } else {
      picker = <QuickstartList {...this.props} />;
      question = firstQuestion;
    }

    return (
      <div id="tutorial-navigator">
        <div className="js-tutorial-navigator">
          <div className="banner tutorial-wizard">
            <div className="container">
              {breadcrumbs}
              <p className="question-text">{question}</p><br />
              { quickstart &&
                <input
                  className="form-control quickstart-search-input"
                  value={this.state.searchTerm}
                  placeholder="Search by technology name"
                  onChange={this.handleSearchChange}
                />
              }
            </div>
            {picker}
          </div>
        </div>
      </div>
    );
  }

}

TutorialNavigator.defaultProps = {
  firstQuestion: 'Choose your application type'
};

TutorialNavigator.propTypes = {
  quickstarts: React.PropTypes.object,
  quickstart: React.PropTypes.object,
  firstQuestion: React.PropTypes.string,
  isFramedMode: React.PropTypes.bool.isRequired
};

export default connectToStores(
  TutorialNavigator,
  [ApplicationStore, QuickstartStore],
  (context, props) => {
    const appStore = context.getStore(ApplicationStore);
    const quickstartStore = context.getStore(QuickstartStore);
    return {
      quickstarts: quickstartStore.getQuickstarts(),
      quickstart: quickstartStore.getCurrentQuickstart(),
      isFramedMode: appStore.isFramedMode()
    };
  }
);
