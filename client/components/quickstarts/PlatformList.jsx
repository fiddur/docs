import React from 'react';
import { map, sortBy } from 'lodash';
import Platform from './Platform';

class PlatformList extends React.Component {

  render() {
    const { quickstart, isFramedMode } = this.props;

    const items = sortBy(quickstart.platforms, p => p.title.toLowerCase())
    .map((platform, i) => (
      <Platform
        key={quickstart.name + i}
        delay={20 * i}
        quickstart={quickstart}
        platform={platform}
        isFramedMode={isFramedMode}
      />
    ));

    return (
      <div className="container techlist">
        <ul className="circle-list">{items}</ul>
      </div>
    );
  }

}

PlatformList.propTypes = {
  quickstart: React.PropTypes.object,
  isFramedMode: React.PropTypes.bool.isRequired
};

export default PlatformList;
