import React from 'react';
import { connectToStores } from 'fluxible-addons-react';
import Breadcrumbs from './Breadcrumbs';
import QuickstartList from './QuickstartList';
import PlatformList from './PlatformList';
import QuickstartStore from '../../stores/QuickstartStore';

class TutorialNavigator extends React.Component {

  render() {

    const { quickstart, firstQuestion } = this.props;

    let picker = undefined;
    let question = undefined;
    let breadcrumbs = undefined;


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
