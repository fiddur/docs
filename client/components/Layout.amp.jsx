import React from 'react';
import { getAssetBundleUrl } from '../../lib/utils';

class LayoutAmp extends React.Component {

  ampScript() {
    var html = `{
  "@context": "http://schema.org",
  "@type": "NewsArticle",
  "headline": "Open-source framework for publishing content",
  "datePublished": "2015-10-07T12:02:41Z",
  "image": [
    "logo.jpg"
  ]
}`;
    return (
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: html}}></script>
    );
  }

  ampStyle() {
    var html = `body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}`;
    return (
      <style amp-boilerplate dangerouslySetInnerHTML={{__html: html}}></style>
    );
  }

  ampNoScript() {
    var html = `body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}`;
    return (
      <noscript>
        <style amp-boilerplate dangerouslySetInnerHTML={{__html: html}}></style>
      </noscript>
    );
  }

  render() {
    return (
      <html amp lang="en">
        <head>
          <title>{this.props.pageTitle}</title>
          <link rel="canonical" href="http://example.ampproject.org/article-metadata.html" />
          <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1" />
          {this.ampScript()}
          {this.ampStyle()}
          {this.ampNoScript()}
          <script async src="https://cdn.ampproject.org/v0.js"></script>
        </head>
        <body dangerouslySetInnerHTML={{__html: this.props.markup}}></body>
      </html>
    );
  }

}

export default LayoutAmp;
