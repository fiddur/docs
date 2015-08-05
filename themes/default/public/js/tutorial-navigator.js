/** @jsx React.DOM */
TutorialNavigator = (function($, window, document) {
  var Quickstart = React.createClass({displayName: "Quickstart",
    handleClick: function(quickstart) {
      var question = this.props.getQuestion(quickstart.name);

      page('/quickstart/' + quickstart.name);
    },
    render: function() {
      var quickstart = this.props.model;
      
      return (
        React.createElement("div", {className: "quickstart", "data-type": quickstart.name, onClick: this.handleClick.bind(this, quickstart)}, 
          React.createElement("div", {className: "symbol"}), 
          React.createElement("strong", {className: "title"}, quickstart.title), 
          React.createElement("p", {className: "description"}, quickstart.description), 
          React.createElement("p", {className: "sample"}, quickstart.example), 
          React.createElement("div", {className: "cta"}, 
            React.createElement("button", {className: "btn btn-success btn-sm"}, "Launch Quickstart")
          )
        )
      );
    }
  });

  var QuickstartList = React.createClass({displayName: "QuickstartList",
    componentDidMount: function() {
      var $carousel = $(this.refs.carousel.getDOMNode());

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
            React.createElement(Quickstart, {
              getQuestion: this.props.getQuestion, 
              key: i, 
              model: quickstart}
            ));
      }.bind(this));
      
      return (
        React.createElement("div", {key: this.props.tutorial, className: hide + "quickstart-list container"}, 
          React.createElement("div", {className: "js-carousel", ref: "carousel"}, list)
        )
      );
    }
  });

  var Tech = React.createClass({displayName: "Tech",
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
        animationDuration: "200ms",
        animationTimingFunction: "cubic-bezier(0.455, 0.03, 0.515, 0.955)"
      };

      return (
        React.createElement("li", {className: "animated scaleIn", style: style}, 
          React.createElement("div", {"data-name": tech.name, className: "circle-logo", onClick: this.handleClick.bind(this, tech)}, 
            React.createElement("div", {className: "logo"}), 
            React.createElement("div", {className: "title"}, tech.title)
          )
        )
      );
    }
  });

  var TechList = React.createClass({displayName: "TechList",
    render: function() {
      var collection = [];
      var classString = '';

      if(!this.props.options) {
        return (
          React.createElement("div", null)
        )
      }
        
      this.props.options.forEach(function(tech, i) {
        var time = 20 * i;

        collection.push(
          React.createElement(Tech, {key: i, delay: time, model: tech, tutorial: this.props.tutorial})
        );
      }.bind(this));
      
      return (
        React.createElement("div", {key: this.props.tutorial.options, className: classString + "container"}, 
          React.createElement("ul", {className: "circle-list"}, 
            collection
          )
        )
      );
    }
  });

  var Breadcrumbs = React.createClass({displayName: "Breadcrumbs",
    getAppTypeName: function(appType) {
      var options = {
        "spa": "Single Page App",
        "native-mobile": "Native Mobile App",
        "webapp": "Regular Web Application",
        "hybrid": "Hybrid Mobile App",
        "backend": "Backend/API"
      };

      return options[appType];
    },
    render: function() {
      var list = [];
      var tutorial = this.props.tutorial;

      if(tutorial.appType) {
        list.push(React.createElement("a", {href: "/quickstart/"}, React.createElement("span", {className: "text"}, this.getAppTypeName(tutorial.appType))));
      } else {
        return (React.createElement("div", null));
      }

      if(tutorial.tech1) {
        list.push(React.createElement("a", {href: "/quickstart/" + tutorial.appType + "/"}, React.createElement("i", {className: "icon-budicon-461"}), React.createElement("span", {className: "text"}, this.props.getTechName(tutorial.appType, tutorial.tech1))));
      }

      if(tutorial.tech2) {
        list.push(React.createElement("a", {href: "/quickstart/" + tutorial.appType + "/" + tutorial.tech1}, React.createElement("i", {className: "icon-budicon-461"}), React.createElement("span", {className: "text"}, this.props.getTechName('backend', tutorial.tech2))));
      }

      return (React.createElement("div", {className: "breadcrumbs"}, list));
    }
  });

  var Tutorial = React.createClass({displayName: "Tutorial",
    getInitialState: function() {
      return {
        content1: null,
        content2: null,
        ready: false
      };
    },
    getParam: function(appType) {
      var options = {
        "spa": "frontend",
        "native-mobile": "mobile",
        "webapp": "backend",
        "hybrid": "hybrid",
        "backend": "api"
      };

      return options[appType];
    },
    setUrlParams: function(url) {
      var tutorial = this.props.tutorial;
      var url = url;

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
      var uri = this.setUrlParams('/docs' + url + '?e=1');
      var component = this;
      var config = {};

      return $.ajax({
        url: uri,
        dataType: "jsonp",
        jsonpCallback: jsonp,
        contentType: "application/json",
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
        React.createElement("div", null, 
          React.createElement("div", {className: "hide"}, 
            React.createElement(Breadcrumbs, {ref: "breadcrumbs", tutorial: this.props.tutorial, getTechName: this.props.getTechName})
          ), 
          React.createElement("div", {className: (!this.state.ready) ? 'loading-tutorial' : 'hide'}, 
            React.createElement("div", {className: "auth0-spinner"}, 
              React.createElement("div", {className: "spinner"})
            )
          )
        )
      );
    }
  });

  var TenantSwitcher = React.createClass({displayName: "TenantSwitcher",
    getInitialState: function () {
      return {
        tenant: this.props.tenants[0],
        client: this.props.tenants[0].clients[0]
      };
    },
    getClients: function() {
      var clientArray = this.state.tenant.clients;
      var list = [];

      clientArray.forEach(function(client, i) {
        list.push(
          React.createElement("option", {key: i, value: i}, client.name)
        );
      });

      return list;
    },
    getTenants: function() {
      var tenants = this.props.tenants;
      var list = [];

      tenants.forEach(function(item, i) {
        list.push(
          React.createElement("option", {key: i, value: i}, item.tenant)
        );
      });

      return list;
    },
    onClientChange: function(event) {
      var currentClient = this.state.tenant.clients[event.target.value];

      this.setState({
        client: currentClient
      });

      this.props.updateTutorial({
        clientID: currentClient.clientID
      });
    },
    onTenantChange: function(event) {
      var currentTenant = this.props.tenants[event.target.value];

      this.setState({
        tenant: currentTenant,
        client: currentTenant.clients[0]
      });

      this.props.updateTutorial({
        clientID: currentTenant.clients[0].clientID
      });
    },
    render: function() {
      var cssClass = (this.props.tutorial.appType) ? 'hide tenant-switcher' : 'tenant-switcher';

      return (
        React.createElement("div", {key: this.props.tutorial.appType, className: cssClass}, 
          React.createElement("div", {className: "text"}, "Choose an Account and Aplication to customize your Tutorials"), 
          React.createElement("span", {className: "icon icon-budicon-300"}), 
          React.createElement("div", {className: "custom-select"}, 
            React.createElement("span", {"data-select-value": true}, this.state.tenant.tenant, " ", React.createElement("i", {className: "icon-budicon-460"})), 
            React.createElement("select", {name: "tenant", onChange: this.onTenantChange}, 
              this.getTenants()
            )
          ), 
          React.createElement("span", {className: "icon icon-budicon-375"}), 
          React.createElement("div", {className: "custom-select"}, 
            React.createElement("span", {"data-select-value": true}, this.state.client.name, " ", React.createElement("i", {className: "icon-budicon-460"})), 
            React.createElement("select", {name: "app", onChange: this.onClientChange}, 
              this.getClients()
            )
          )
        )
      );
    }
  });

  var TutorialNavigator = React.createClass({displayName: "TutorialNavigator",
    updateTutorial: function(change) {
      this.setState(change);
    },
    handleSkip: function() {
      var platformPath = this.getPlatformPath(this.state.appType);
      var path = '/quickstart/' + this.state.appType + '/' + this.state.tech1 + '/no-api/';

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
        path: '',
        clientID: (this.props.userTenants) ? this.props.userTenants[0].clients[0].clientID : null
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
    getTechName: function(platformType, tech) {
      var collection = this.getOptions(platformType);

      var result = $.grep(collection, function(e){ return e.name == tech; });

      if(result.length) {
        return result[0].title;
      }
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
          tech1: null,
          tech2: null,
          showTutorial: false
        });
      });

      page('/quickstart/:apptype/:platform?', function(ctx) {
        var platformPath = component.getPlatformPath(ctx.params.apptype);

        if(ctx.params.apptype !== 'backend' && ctx.params.apptype !== 'webapp') {
          component.setState({
            options: 'backend', 
            appType: ctx.params.apptype,
            question: "Will you use a Backend or API with your application?",
            skippable: true,
            tech1: ctx.params.platform,
            tech2: null,
            path: '/quickstart/' + ctx.params.apptype + [platformPath + ctx.params.platform],
            tutorialUrls: [platformPath + ctx.params.platform],
            showTutorial: false
          });
        } else {
          component.setState({
            options: null, 
            appType: ctx.params.apptype,
            question: null,
            skippable: false,
            tech1: ctx.params.platform,
            tech2: null,
            path: '/quickstart/' + ctx.params.apptype + [platformPath + ctx.params.platform],
            tutorialUrls: [platformPath + ctx.params.platform],
            showTutorial: true,
            noApi: null
          });
        }
      });

      page('/quickstart/:apptype/:platform/:api?', function(ctx) {
        var platformPath = component.getPlatformPath(ctx.params.apptype);
        var tech2 = ctx.params.api;
        var tutorialUrls = [platformPath + ctx.params.platform, '/server-apis/' + ctx.params.api];
        var noApi = null;

        if(ctx.params.api === 'no-api') {
          tech2 = null;
          tutorialUrls = [platformPath + ctx.params.platform]
          noApi = true;
        }

        component.setState({
          options: 'backend', 
          appType: ctx.params.apptype, 
          skippable: false,
          tech1: ctx.params.platform,
          tech2: tech2,
          path: '/quickstart/' + ctx.params.apptype + [platformPath + ctx.params.platform, '/server-apis/' + ctx.params.api],
          tutorialUrls: tutorialUrls,
          showTutorial: true,
          noApi: noApi
        });
      });

      page();
    },
    getTenantSwitcher: function() {
      if(!this.props.userTenants || this.props.userTenants.length < 2) {
        return false;
      }

      return (
        React.createElement(TenantSwitcher, {tenants: this.props.userTenants, updateTutorial: this.updateTutorial, tutorial: this.state})
      );
    },
    render: function() {
      var hasMoreTenants = this.props.userTenants && this.props.userTenants.length > 1;

      return (
        React.createElement("div", {className: (this.state.showTutorial) ? 'js-tutorial-navigator is-result' : 'js-tutorial-navigator'}, 
          React.createElement("div", {className: "banner tutorial-wizard"}, 
            React.createElement("div", {className: "container"}, 
              React.createElement("h1", null, "Documentation"), 
              
              React.createElement("p", {className: (hasMoreTenants && !this.state.appType) ? 'hide' : 'question-text'}, this.state.question), 

              this.getTenantSwitcher(), 

              React.createElement("button", {href: "#", "data-skip": true, onClick: this.handleSkip, className: (this.state.skippable) ? '' : 'hide'}, "No, skip this"), 
              React.createElement("br", null), 
              React.createElement(Breadcrumbs, {tutorial: this.state, getTechName: this.getTechName})
            ), 

            React.createElement(QuickstartList, {quickstarts: this.props.platforms.apptypes, getQuestion: this.getQuestion, tutorial: this.state}), 
            React.createElement(TechList, {options: this.getOptions(this.state.options), tutorial: this.state})
          ), 

          React.createElement("div", {className: "tutorial-content"}, 
            React.createElement(Tutorial, {key: this.state.showTutorial, tutorial: this.state, getTechName: this.getTechName, template: this.props.singleTpl, onLoad: this.props.onTutorialLoad, onReset: this.props.onTutorialReset})
          )
          
        )
      );
    }
  });

  return {
    init: TutorialNavigator
  }
})(jQuery, window, document);


