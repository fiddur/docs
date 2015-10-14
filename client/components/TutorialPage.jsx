import React from 'react';

class TutorialPage extends React.Component {
  componentDidMount () {
    if (document !== undefined) {
      var el = document.getElementById('homepage-content');
      el.classList.add('hide');
    }
  }
  render() {
      return (
        <div id="tutorial-template" class="docs-single animated fadeIn">
          <div class="navigation-bar">
            <div class="wrapper">
              <div class="container">
                <div class="breadcrumbs"><a href="/"><span class="text">Documentation</span></a><a><i class="icon-budicon-461"></i><span class="text">title</span></a></div>
                <form id="search" role="search" action="/search" autocomplete="off">
                  <div class="form-group search-control"><i class="icon-budicon-489"></i>
                    <input id="search-input-2" type="text" placeholder="Search for docs" name="stq" class="search-input form-control"/>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div class="js-doc-template container">
            <div class="row">
              <div class="col-sm-3">
                <div id="sidebar"></div>
              </div>
              <div class="col-sm-9">
                <section data-swiftype-index="true" class="docs-content">
                  <h1 class="tutorial-title"></h1>
                  <ul class="nav nav-tabs">
                    <li class="active"><a href="#tutorial-1" data-toggle="tab">Tutorial 1</a></li>
                    <li><a href="#tutorial-2" data-toggle="tab">Tutorial 2</a></li>
                  </ul>
                  <div class="tab-content">
                    <div id="tutorial-1" class="tab-pane active"></div>
                    <div id="tutorial-2" class="tab-pane"></div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      );
  }
}

export default TutorialPage;
