import React from 'react';
import Tech from './Tech';
import { getPlatformCollection } from '../util/tutorials';

class TechList extends React.Component {
  render() {
    var collection = [];
    var classString = '';

    var platformType = this.props.appType;
    if (this.props.tech1) {
      platformType = 'backend';
    }

    var skippable = true;
    if(platformType === 'backend' || platformType === 'webapp') {
      skippable = false;
    }

    getPlatformCollection(this.props.quickstart, platformType)
    .forEach((tech, i) => {
      var time = 20 * i;

      collection.push(
        <Tech key={i}
          delay={time}
          skippable={skippable}
          baseUrl={this.props.baseUrl}
          tech={tech}
          tech1={this.props.tech1}
          appType={this.props.appType} />
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

export default TechList;
