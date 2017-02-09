import React, { Component, PropTypes } from 'react';
import urljoin from 'url-join';
import { Select } from 'auth0-styleguide-react-components';
import { map } from 'lodash';
import { navigateAction } from 'fluxible-router';

class VersionSelector extends Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(evt) {
    const { doc } = this.props;
    const { baseUrl, versions } = doc.meta.versioning;

    const version = evt.target.value;
    const config = versions[version];

    // Resolve the path of the article relative to the version group's base URL.
    let path = doc.meta.url.replace(urljoin(baseUrl, doc.meta.version, '/'), '');

    // If the new target version defines a redirect for the path, use it instead.
    if (config.redirects && config.redirects[path]) path = config.redirects[path];

    // Build the URL for the corresponding article of the new target version. Use the
    // path defined by the target version if it exists, otherwise use the version name itself.
    const url = urljoin(baseUrl, config.path || version, path);

    // Redirect to that article. (NB: navigateAction doesn't seem to support absolute URLs,
    // so we have to create a relative one instead.)
    this.context.executeAction(navigateAction, {
      url: url.replace(window.env.DOMAIN_URL_DOCS, '/docs')
    });
  }

  render() {
    const { doc } = this.props;
    const { version, versioning } = doc.meta;

    const options = map(versioning.versions, (config, key) => ({
      label: key,
      value: key
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

VersionSelector.contextTypes = {
  executeAction: PropTypes.func
};

export default VersionSelector;
