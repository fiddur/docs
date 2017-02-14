import React, { Component, PropTypes } from 'react';
import urljoin from 'url-join';
import { Select } from 'auth0-styleguide-react-components';
import { map } from 'lodash';

class VersionSelector extends Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(evt) {
    const { doc } = this.props;
    const { baseUrl } = doc.meta.versioning;
    const version = evt.target.value;

    // Resolve the path of the article relative to the topic's base URL.
    const path = doc.meta.url.replace(urljoin(baseUrl, doc.meta.version, '/'), '');

    // Redirect to the corresponding article in the new target version.
    // NB: We can't do a partial refresh with navigateAction here, because we may end
    // up needing to redirect if the article doesn't exist in the target version.
    document.location = urljoin(baseUrl, version, path);
  }

  render() {
    const { doc } = this.props;
    const { version, versioning } = doc.meta;

    const options = versioning.versions.map(item => ({
      label: item,
      value: item
    }));

    let message;
    const classes = ['version-banner', 'alert'];

    if (version === versioning.current) {
      classes.push('alert-info');
      message = (
        <div className="version-selector-message">
          <strong>Heads up!</strong> This document explains the latest version ({version}).
          If you are still using an older version, you can see that documentation here:
        </div>
      );
    } else {
      classes.push('alert-warning');
      message = (
        <div className="version-selector-message">
          <strong>Heads up!</strong> This document explains an outdated version ({version}).
        </div>
      );
    }

    return (
      <div className={classes.join(' ')}>
        {message}
        <div className="version-selector">
          Switch to version:
          <Select
            options={options}
            selected={options.findIndex(v => v.value === version)}
            handleChange={this.handleChange}
          />
        </div>
      </div>
    );
  }

}

VersionSelector.propTypes = {
  doc: PropTypes.object
};

export default VersionSelector;
