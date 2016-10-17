import React from 'react';
import { getAssetBundleUrl } from '../../lib/utils';
import Footer from './Footer';

class Layout extends React.Component {

  title() {
    if (this.props.pageTitle) {
      return this.props.pageTitle;
    }
    else if (this.props.site && this.props.site.title) {
      return this.props.site.title;
    }
    else {
      return 'Auth0';
    }
  }

  description() {
    return this.props.pageDescription || 'Get started using Auth0. Implement authentication for any kind of application in minutes.';
  }

  canonicalUrl() {
    if (this.props.pageCanonicalUrl) {
      return <link rel="canonical" href={this.props.pageCanonicalUrl}/>;
    }
    else {
      return undefined;
    }
  }

  cssAssetBundle() {
    let url = getAssetBundleUrl('commons', 'css');
    if (url) {
      return <link rel="stylesheet" href={url}/>;
    }
    else {
      return undefined;
    }
  }

  getEnvScript() {
    let envString = JSON.stringify(this.props.env);
    let envCode = `window.env = ${envString};`;
    return (<script dangerouslySetInnerHTML={{__html: envCode}}></script>);
  }

  render() {
    return (
      <html>
        <head>

          <meta charSet="utf-8"/>
          <title>{this.title()}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="google-site-verification" content="4aSwkVvotRegQ6g32k-21r38Fls9sO8VT5LytKdin3o" />
          <meta name="description" content={this.description()} />
          <meta name="author" content="Auth0" />
          <meta name="keywords" content="auth0, authentication, sso, passwordless, user, profile, applications, identity, providers, nodejs, ruby, scala, angular, go, php, rails" />
          {this.canonicalUrl()}

          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image"/>
          <meta name="twitter:creator" content="@auth0"/>
          <meta name="twitter:title" content={this.title()}/>
          <meta name="twitter:description" content={this.description()}/>

          {/* Facebook */}
          <meta property='og:title' content={this.title()}/>
          <meta property='og:site_name' content='Auth0 - Pageation'/>
          <meta property='og:url' content='https://auth0.com/docs/'/>
          <meta name='og:image' content='https://cdn.auth0.com/docs/media/social-media/fb-card.png'/>
          <meta property='og:description' content={this.description()}/>
          <meta property='og:type' content='website'/>

          {/* Swiftype */}
          <meta className="swiftype" name="title" data-type="string" content={this.title()} />
          <meta className='swiftype' name='type' data-type='enum' content='article' />
          <meta className='swiftype' name='popularity' data-type='integer' content='2' />

          <link rel="shortcut icon" href="//cdn.auth0.com/styleguide/latest/lib/logos/img/favicon.png" />
          <link rel="stylesheet" href="https://cdn.auth0.com/styleguide-core/0.0.2/core.min.css" />
          <link rel="stylesheet" href="https://cdn.auth0.com/styleguide-components/0.0.1/components.min.css" />
          {this.cssAssetBundle()}

          {this.getEnvScript()}
          <script
            src="https://code.jquery.com/jquery-2.2.4.min.js" integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44="
            crossOrigin="anonymous"
          />
          <script src="https://cdn.ravenjs.com/3.7.0/raven.min.js" />
          <script src="//cdn.auth0.com/styleguide/vendor/bootstrap-3.2.0.min.js" />
          <script src="https://cdn.auth0.com/js/lock-9.2.min.js" />
          <script src={getAssetBundleUrl('commons')} />
          <script src={getAssetBundleUrl('browser')} />
        </head>
        <body>
          <div data-swiftype-index='false' className="docs-single">
            <div id="app" dangerouslySetInnerHTML={{__html: this.props.markup}}></div>
            {this.props.env.fullWidth ? undefined : <Footer />}
          </div>
          <script dangerouslySetInnerHTML={{__html: this.props.state}}></script>
          <script src={getAssetBundleUrl('client')}></script>
        </body>
      </html>
    );
  }
}

export default Layout;
