var Tutorial = React.createClass({
  getInitialState: function() {
    return {
      content1: null,
      content2: null,
      ready: false
    };
  },
  getParam: function(appType) {
    var options = {
      'spa': 'frontend',
      'native-mobile': 'mobile',
      'webapp': 'backend',
      'hybrid': 'hybrid',
      'backend': 'api'
    };

    return options[appType];
  },
  setUrlParams: function(url) {
    var tutorial = this.props.tutorial;

    url += '&' + this.getParam(tutorial.appType) + '=' + tutorial.tech1;

    if(tutorial.tech2) {
      url += '&api=' + tutorial.tech2;
    }

    if(tutorial.clientID) {
      url += '&a=' + tutorial.clientID;
    }

    return url;
  },
  fetchDocument: function(url, toUpdate, jsonp) {
    var tutorial = this.props.tutorial;
    var prefix = tutorial.basePath || '';
    var uri = this.setUrlParams(prefix + url + '?e=1');
    var component = this;
    var config = {};

    return $.ajax({
      url: uri,
      dataType: 'jsonp',
      jsonpCallback: jsonp,
      contentType: 'application/json',
      error: function(status, err) {
        return console.log(err);
      }
    });
  },
  getBreadcrumbs: function() {
    return $(this.refs.breadcrumbs.getDOMNode()).clone();
  },
  getTitle: function(state) {
    var tutorial = this.props.tutorial;
    var title1 = this.props.getTechName(tutorial.appType, tutorial.tech1);
    var title2 = '';
    var title = title1 + ' Tutorial';

    if(state.content1 && state.content2) {
      title2 = this.props.getTechName('backend', tutorial.tech2);
      title = title1 + ' + ' + title2;
    }

    return {
      tutorial: title,
      tech1: title1,
      tech2: title2
    };
  },
  updateTemplate: function(state) {
    var template = this.props.template;
    var tutorial = this.props.tutorial;
    var titles = this.getTitle(state);

    $('.tutorial-title', template).text(titles.tutorial);
    $('.breadcrumbs', template).replaceWith(this.getBreadcrumbs());

    if(state.content1) {
      $('#tutorial-1', template).append(state.content1);
      $('.nav-tabs li', template).eq(0).find('a').text(titles.tech1);
    }

    if(state.content2) {
      $('#tutorial-2', template).append(state.content2);
      $('.nav-tabs li', template).eq(1).find('a').text(titles.tech2);
    }

    // Remove duplicate titles
    $('.tab-pane h1, .tab-pane h2', template).filter(':first-child').remove();

    // If only one tutorial, hide the tabs
    $('.nav-tabs', template).toggleClass('hide', !!!state.content2);
    $('.tab-pane', template).removeClass('active').eq(0).addClass('active');

    template.removeClass('hide');

    this.props.onLoad(template);
  },
  emptyTemplate: function($template) {
    $template.find('.tab-pane, .nav-tabs li a, .tutorial-title, .sidebar-sbs ul').html('');
  },
  resetTemplate: function($template) {
    $template.addClass('hide');

    this.emptyTemplate($template);
    this.props.onReset($template);
  },
  onReady: function(content1, content2) {
    if(!content2[0].html) {
      this.setState({
        ready: true,
        content1: content1.html
      });

      return this.updateTemplate(this.state);
    }

    if(content1[0] && content2[0]) {
      this.setState({
        ready: true,
        content1: content1[0].html,
        content2: content2[0].html
      });

      return this.updateTemplate(this.state);
    }
  },
  componentDidMount: function() {
    var tutorial = this.props.tutorial;

    this.resetTemplate(this.props.template);

    if(!tutorial.showTutorial) {
      return;
    }

    if(tutorial.tutorialUrls.length > 1) {
      return $.when(
        this.fetchDocument(tutorial.tutorialUrls[0], 'content1', '__a0tn1'),
        this.fetchDocument(tutorial.tutorialUrls[1], 'content2', '__a0tn2')
      ).then(this.onReady);
    }

    return $.when(
      this.fetchDocument(tutorial.tutorialUrls[0], 'content1', '__a0tn1')
    ).then(this.onReady);

  },
  render: function() {
    return (
      <div>
        <div className='hide'>
          <Breadcrumbs ref='breadcrumbs' tutorial={this.props.tutorial} getTechName={this.props.getTechName} />
        </div>
        <div className={(!this.state.ready) ? 'loading-tutorial' : 'hide' }>
          <div className='auth0-spinner'>
            <div className='spinner'></div>
          </div>
        </div>
      </div>
    );
  }
});

export default Tutorial;
