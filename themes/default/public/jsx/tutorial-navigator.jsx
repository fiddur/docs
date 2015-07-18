/** @jsx React.DOM */

var Quickstart = React.createClass({
  handleClick: function(quickstart) {
    var question = this.props.getQuestion(quickstart.name);

    this.props.updateTutorial({
      question: question,
      options: quickstart.name,
      appType: quickstart.name
    });

    page('/quickstart/' + quickstart.name);
  },
  render: function() {
    var quickstart = this.props.model;
    
    return (
      <div className="quickstart" data-type={quickstart.name} onClick={this.handleClick.bind(this, quickstart)}>
        <div className="symbol">
          <i className={'icon-budicon-' + quickstart.budicon}></i>
        </div>
        <strong className="title">{quickstart.title}</strong>
        <p className="description">{quickstart.description}</p>
        <p className="sample">{quickstart.example}</p>
        <div className="cta">
          <button className="btn btn-success btn-sm">Launch Quickstart</button>
        </div>
      </div>
    );
  }
});

var QuickstartList = React.createClass({
  componentDidMount: function() {
    var $carousel = $(this.refs.carousel.getDOMNode());

    $carousel.on('initialized.owl.carousel', function() {
      var $module = $(this);
      if (window.requestAnimationFrame) {
        requestAnimationFrame(function() {
          $module.addClass('rendered');
        });
      } else {
        $module.addClass('rendered');
      }
    });

    $carousel.owlCarousel({
      margin: 20,
      center: true,
      dots: true,
      navContainerClass: 'nav',
      navClass: ['prev', 'next'],
      baseClass: 'js-carousel',
      itemClass: 'item',
      dotsClass: 'dots',
      dotClass: 'dot',
      nav: false,
      responsive: {
        0: {
          items: 1,
          stagePadding: 60
        },
        380: {
          items: 2,
          stagePadding: 0
        },
        570: {
          items: 3,
          stagePadding: 0
        },
        768: {
          items: 4,
          stagePadding: 0
        },
        992: {
          items: 5,
          stagePadding: 0,
          center: false,
          dots: false
        }
      }
    });
  },
  render: function() {
    var list = [];
    var hide = (this.props.tutorial.appType) ? 'hide ' : ''; 
  
    this.props.quickstarts.forEach(function(quickstart, i) {
        list.push(
          <Quickstart 
            updateTutorial={this.props.updateTutorial}
            getQuestion={this.props.getQuestion}
            key={i} 
            model={quickstart} 
          />);
    }.bind(this));
    
    return (
      <div className={hide + "quickstart-list container"}>
        <div className="js-carousel" ref="carousel">{list}</div>
      </div>
    );
  }
});

var Tech = React.createClass({
  handleClick: function(tech) {
    var tutorial = this.props.tutorial;
    var config = {
      path: '/' + tutorial.appType + '/' + tech.name + '/'
    };

    if(tutorial.options === 'backend' || tutorial.options === 'webapp') {
      config.skippable = false;

      if(tutorial.tech1) {
        config.path = '/' + tutorial.appType + '/' + tutorial.tech1 + '/' + tech.name;
      }
    }

    page('/quickstart' + config.path);
  },
  render: function() {
    var tech = this.props.model;
    var style = {
      animationDelay: this.props.delay + "ms",
      animationDuration: "400ms",
      animationTimingFunction: "cubic-bezier(0.455, 0.03, 0.515, 0.955)"
    };

    return (
      <li className="animated fadeIn" style={style}>
        <div data-name={tech.name} className="circle-logo" onClick={this.handleClick.bind(this, tech)}>
          <div className="logo"></div>
          <div className="title">{tech.title}</div>
        </div>
      </li>
    );
  }
});

var TechList = React.createClass({
  render: function() {
    var collection = [];
    var classString = '';

    if(!this.props.options) {
      return (
        <div></div>
      )
    }
      
    this.props.options.forEach(function(tech, i) {
      var time = 40 * i;

      collection.push(
        <Tech key={i} delay={time} model={tech} tutorial={this.props.tutorial} updateTutorial={this.props.updateTutorial} />
      );
    }.bind(this));
    
    return (
      <div key={this.props.tutorial.options} className={classString + "container"}>
        <ul className="circle-list">
          {collection}
        </ul>
      </div>
    );
  }
});

var Breadcrumbs = React.createClass({
  render: function() {
    return (<div></div>);
  }
});

var Tutorial = React.createClass({
  getInitialState: function() {
    return {
      content1: null,
      content2: null,
      ready: false
    };
  },
  fetchDocument: function(url, toUpdate) {
    var uri = 'https://auth0.com/docs' + url + '?e=1';
    var component = this;
    var config = {};

    $.ajax({
      url: uri,
      dataType: "jsonp",
      jsonpCallback: "__a0tn9",
      contentType: "application/json",
      success: function(response) {
        config[toUpdate] = response.html;

        component.setState(config);
        component.forceUpdate();

        if(!component.state.content2 && component.props.tutorialUrls.length > 1) {
          component.fetchDocument(component.props.tutorialUrls[1], "content2");
        } else {
          component.setState({ ready: true });
        }
      },
      error: function(status, err) {
        return console.log(err);
      }
    });
  },
  componentDidMount: function() {
    if(this.props.tutorialUrls.length) {
      this.fetchDocument(this.props.tutorialUrls[0], "content1");
    }
  },
  render: function() {
    return (
      <div>
        <div className={(this.state.ready) ? 'tutorial-ready' : 'hide' }>
          <div className="content-1" dangerouslySetInnerHTML={{__html: this.state.content1}}>
          </div>
          <div className="content-2" dangerouslySetInnerHTML={{__html: this.state.content2}}>
          </div>
        </div>
      </div>
    );
  }
});

var TutorialNavigator = React.createClass({
  updateTutorial: function(change) {
    this.setState(change);
  },
  handleSkip: function() {
    var platformPath = this.getPlatformPath(this.state.appType);
    var path = '/quickstart/' + this.state.appType + '/' + this.state.tech1 + '/no-api/';

    this.setState({
      tech2: null,
      path: path,
      tutorialUrls: [platformPath + this.state.tech1],
      showTutorial: true
    });

    page(path);
  },
  getInitialState: function () {
    return {
      question: "Getting started?, Try our Quickstarts",
      appType: null,
      options: null,
      skippable: null,
      tech1: null,
      tech2: null,
      tutorialUrls: [],
      showTutorial: false,
      path: ''
    };
  },
  getQuestion: function(platformType) {
    var questions = {
      "spa": "What technology will you use in the FrontEnd?",
      "native-mobile": "Select a native SDK",
      "webapp": "What technology are you using for your WebApp?",
      "hybrid": "Select a Hybrid SDK",
      "backend": "Select an API or Backend platform"
    };

    return questions[platformType];
  },
  getOptions: function(platformType) {
    if(!platformType) {
      return false;
    }

    var options = {
      "spa": this.props.platforms.clientPlatforms,
      "native-mobile": this.props.platforms.nativePlatforms,
      "webapp": this.props.platforms.serverPlatforms,
      "hybrid": this.props.platforms.hybridPlatforms,
      "backend": this.props.platforms.serverApis
    };

    return options[platformType];
  },
  getPlatformPath: function(platformType) {
    var paths = {
      "spa": "client-platforms",
      "native-mobile": "native-platforms",
      "webapp": "server-platforms",
      "hybrid": "native-platforms",
      "backend": "server-apis"
    };

    return '/' + paths[platformType] + '/';
  },
  componentWillMount: function() {
    var component = this;

    page('/', function() {
      component.setState(component.getInitialState());
    });

    page('/quickstart/', function() {
      component.setState(component.getInitialState());
    });

    page('/quickstart/:apptype?', function(ctx) {
      component.setState({
        question: component.getQuestion(ctx.params.apptype),
        options: ctx.params.apptype,
        appType: ctx.params.apptype,
        path: '/quickstart/' + ctx.params.apptype,
        tutorialUrls: [],
        skippable: false,
        showTutorial: false
      });
    });

    page('/quickstart/:apptype/:platform?', function(ctx) {
      var platformPath = component.getPlatformPath(ctx.params.apptype);

      component.setState({
        options: 'backend', 
        appType: ctx.params.apptype, 
        question: "Will you use a Backend or API with your application?",
        skippable: true,
        tech1: ctx.params.platform,
        path: '/quickstart/' + ctx.params.apptype + [platformPath + ctx.params.platform],
        tutorialUrls: [platformPath + ctx.params.platform],
        showTutorial: false
      });
    });

    page('/quickstart/:apptype/:platform/:api?', function(ctx) {
      var platformPath = component.getPlatformPath(ctx.params.apptype);
      var tech2 = ctx.params.api;
      var tutorialUrls = [platformPath + ctx.params.platform, '/server-apis/' + ctx.params.api];

      if(ctx.params.api === 'no-api') {
        tech2 = null;
        tutorialUrls = [platformPath + ctx.params.platform]
      }

      component.setState({
        options: 'backend', 
        appType: ctx.params.apptype, 
        skippable: false,
        tech1: ctx.params.platform,
        tech2: tech2,
        path: '/quickstart/' + ctx.params.apptype + [platformPath + ctx.params.platform, '/server-apis/' + ctx.params.api],
        tutorialUrls: tutorialUrls,
        showTutorial: true
      });
    });

    page();
  },
  render: function() {
    return (
      <div className={(this.state.showTutorial) ? 'js-tutorial-navigator is-result' : 'js-tutorial-navigator'}>
        <div className="banner tutorial-wizard">
          <div className="container">
            <h1>Documentation</h1>
            <p>{this.state.question}</p>
            <button onClick={this.handleSkip} className={(this.state.skippable) ? 'btn btn-mid btn-success' : 'btn btn-mid btn-success hide' }>No, skip this</button>
          </div>

          <QuickstartList quickstarts={this.props.platforms.apptypes} updateTutorial={this.updateTutorial} getQuestion={this.getQuestion} tutorial={this.state} />
          <TechList options={this.getOptions(this.state.options)} updateTutorial={this.updateTutorial} tutorial={this.state} />
        </div>

        <div className="tutorial-content">
          <Tutorial key={this.state.tutorialUrls.length} tutorialUrls={this.state.tutorialUrls} navigation={this.props.navigation || null} />
        </div>
        
      </div>
    );
  }
});


