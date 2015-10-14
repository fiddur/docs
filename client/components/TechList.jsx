import React from 'react';
import TutorialStore from '../stores/TutorialStore';
import Tech from './Tech';
import { getPlatformCollection } from '../util/tutorials';

class TechList extends React.Component {
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
  render() {
    var collection = [];
    var classString = '';

    var platformType = this.state.appType;
    if (this.state.tech1) {
      platformType = 'backend';
    }

    var skippable = true;
    if(platformType === 'backend' || platformType === 'webapp') {
      skippable = false;
    }

    getPlatformCollection(this.state.quickstart, platformType)
    .forEach((tech, i) => {
      var time = 20 * i;

      collection.push(
        <Tech key={i} delay={time} model={tech} skippable={skippable} />
      );
    });

    return (
      <div className={classString + "container"}>
        <ul className="circle-list">
          {collection}
        </ul>
      </div>
    );
  }
}

TechList.contextTypes = {
  getStore: React.PropTypes.func,
  executeAction: React.PropTypes.func,
};

export default TechList;
