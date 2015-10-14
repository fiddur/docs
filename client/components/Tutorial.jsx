import React from 'react';

class Tutorial extends React.Component {
    render() {
        return (
          <div className={(false) ? 'loading-tutorial' : 'hide' }>
            <div className='auth0-spinner'>
              <div className='spinner'></div>
            </div>
          </div>
        );
    }
}

export default Tutorial;
