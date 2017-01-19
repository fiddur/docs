import React, { PropTypes } from 'react';

const ModalLoader = ({ loading, children }) => {
  if (loading) {
    return (
      <div className="modal-loading">
        { children }
        <div className="loading-overlay">
          <div className="spinner spinner-md is-auth0">
            <div className="circle" />
          </div>
        </div>
      </div>
    );
  }
  return children;
};

ModalLoader.propTypes = {
  loading: PropTypes.bool.isRequired,
  children: PropTypes.element.isRequired
};

export default ModalLoader;
