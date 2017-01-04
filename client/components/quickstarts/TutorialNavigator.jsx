import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import Breadcrumbs from './Breadcrumbs';
import QuickstartList from './QuickstartList';
import PlatformList from './PlatformList';
import { sendTutorialViewedEvent, sendPackageDownloadedEvent } from '../../browser/quickstartMetrics';
import QuickstartStore from '../../stores/QuickstartStore';

const shouldSendMetrics = (quickstart, prevQuickstart = undefined) =>
  quickstart && (!prevQuickstart || prevQuickstart.slug !== quickstart.slug);

class TutorialNavigator extends React.Component {

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

  render() {
    const { quickstart, firstQuestion } = this.props;

    let picker;
    let question;
    let breadcrumbs;

    if (quickstart) {
      picker = <PlatformList {...this.props} />;
      question = quickstart.question;
      breadcrumbs = <Breadcrumbs {...this.props} />;
    } else {
      picker = <QuickstartList {...this.props} />;
      question = firstQuestion;
    }

    return (
      <div id="tutorial-navigator">
        <div className='js-tutorial-navigator'>
          <div className="banner tutorial-wizard">
            <div className="container">
              <p className='question-text'>{question}</p><br/>
              {breadcrumbs}
            </div>
            {picker}
          </div>
        </div>
      </div>
    );
  }

}

TutorialNavigator.defaultProps = {
  firstQuestion: "Choose your application type"
};

TutorialNavigator.propTypes = {
  quickstarts: React.PropTypes.object,
  quickstart: React.PropTypes.object,
  firstQuestion: React.PropTypes.string,
  isFramedMode: React.PropTypes.bool.isRequired
};

TutorialNavigator = connectToStores(TutorialNavigator, [QuickstartStore], (context, props) => {
  let store = context.getStore(QuickstartStore);
  return {
    quickstarts: store.getQuickstarts(),
    quickstart: store.getCurrentQuickstart()
  };
});


export default TutorialNavigator;
