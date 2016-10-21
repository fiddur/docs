import React from 'react';
import Platform from './Platform';

class PlatformList extends React.Component {

  render() {
    const { quickstart, isFramedMode } = this.props;

    const items = Object.keys(quickstart.platforms).map((name, i) => (
      <Platform
        key={quickstart.name + i}
        delay={20 * i}
        quickstart={quickstart}
        platform={quickstart.platforms[name]}
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
