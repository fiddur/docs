import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import Breadcrumbs from './Breadcrumbs';
import QuickstartList from './QuickstartList';
import PlatformList from './PlatformList';
import QuickstartSuggestModal from './QuickstartSuggestModal';
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
      showSuggestionModal: false,
      suggestionSent: false,
      searchTerm: '',
      searchActive: false
    };

    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.openSuggestionModal = this.openSuggestionModal.bind(this);
    this.closeSuggestionModal = this.closeSuggestionModal.bind(this);
    this.showSuggestionSent = this.showSuggestionSent.bind(this);
  }

  componentDidMount() {
    if (shouldSendMetrics(this.props.quickstart)) this.handleMetrics();
  }

  componentDidUpdate(prevProps) {
    if (shouldSendMetrics(this.props.quickstart, prevProps.quickstart)) this.handleMetrics();
  }

  openSuggestionModal() {
    this.setState({
      showSuggestionModal: true
    });
  }

  closeSuggestionModal() {
    this.setState({
      showSuggestionModal: false
    });
  }

  showSuggestionSent() {
    this.setState({
      suggestionSent: true
    });
  }

  handleMetrics() {
    if (typeof document !== 'undefined') {
      sendTutorialViewedEvent(this.props);
    }
  }

  handleSearchChange(e) {
    this.setState({
      searchTerm: e.target.value.substr(0, 80),
      searchActive: true
    });
  }

  render() {
    const { quickstart, firstQuestion, largeHeader } = this.props;

    let picker;
    let question;
    let breadcrumbs;

    if (quickstart) {
      picker = (
        <PlatformList
          searchActive={this.state.searchActive}
          searchTerm={this.state.searchTerm}
          handleSuggestClick={this.openSuggestionModal}
          {...this.props}
        />
      );
      question = quickstart.question;
      breadcrumbs = <Breadcrumbs {...this.props} />;
    } else {
      picker = <QuickstartList {...this.props} />;
      question = firstQuestion;
    }

    const TitleElementType = largeHeader ? 'h1' : 'p';

    return (
      <div id="tutorial-navigator">
        <div className="js-tutorial-navigator">
          <div className="banner tutorial-wizard">
            <div className="container">
              {breadcrumbs}
              <TitleElementType className="navigator-title">{question}</TitleElementType>
              <br />
              { quickstart &&
                <div>
                  <QuickstartSuggestModal
                    open={this.state.showSuggestionModal}
                    suggestion={this.state.searchTerm}
                    closeModal={this.closeSuggestionModal}
                    showSuggestionSent={this.showSuggestionSent}
                  />
                  <div className="quickstart-search-input">
                    <i className="icon icon-budicon-489" />
                    <input
                      className="form-control input"
                      value={this.state.searchTerm}
                      placeholder="Search by technology name"
                      onChange={this.handleSearchChange}
                    />
                  </div>
                  { this.state.suggestionSent &&
                    <p className="quickstart-suggestion-sent">
                      Your suggestion has been sent, thanks for your help!
                    </p>
                  }
                </div>
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
  firstQuestion: 'Choose your application type',
  largeHeader: true
};

TutorialNavigator.propTypes = {
  quickstarts: React.PropTypes.object,
  quickstart: React.PropTypes.object,
  firstQuestion: React.PropTypes.string,
  isFramedMode: React.PropTypes.bool.isRequired,
  largeHeader: React.PropTypes.bool
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
