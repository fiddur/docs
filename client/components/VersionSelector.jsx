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

    const options = map(doc.meta.versioning.versions, (version, key) => ({
      label: key,
      value: key
    }));

    return (
      <div className="version-selector">
        <Select
          options={options}
          selected={options.findIndex(v => v.value === doc.meta.version)}
          handleChange={this.handleChange}
        />
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
