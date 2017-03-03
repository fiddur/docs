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

    const options = versioning.versions.map(value => {
      const marker = (value === versioning.current) ? ' (current)' : ' (outdated)';
      return {
        label: `Version ${value} ${marker}`,
        value
      };
    });

    return (
      <div className="version-selector">
        <Select
          options={options}
          selected={options.findIndex(v => v.value === version)}
          handleChange={this.handleChange}
        />
      </div>
    );
  }

}

VersionSelector.propTypes = {
  doc: PropTypes.object
};

export default VersionSelector;
