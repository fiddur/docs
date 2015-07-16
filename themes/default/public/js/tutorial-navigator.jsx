var QUICKSTARTS = [
  {
    "title": "Native Mobile App",
    "name": "native-mobile",
    "description": "An app that runs natively in devices",
    "example": "eg. iOS SDK",
    "icon": "243"
  },
  {
    "title": "Single Page App",
    "name": "spa",
    "description": "A JavaScript front-end app that uses an API",
    "example": "eg. AngularJS + NodeJS",
    "icon": "453"
  },
  {
    "title": "Regular Web App",
    "name": "webapp",
    "description": "Traditional web app (with refresh)",
    "example": "eg. Java, ASP.NET",
    "icon": "349"
  },
  {
    "title": "Hybrid Mobile App",
    "name": "hybrid",
    "description": "A JS/HTML5 mobile app that runs in devices",
    "example": "eg. PhoneGap, Ionic",
    "icon": "641"
  },
  {
    "title": "API/Backend",
    "name": "backend",
    "description": "An API or service that does JWT validation",
    "example": "eg. Custom API",
    "icon": "649"
  }
];

var PLATFORMS = {};

PLATFORMS["client"] = [
  {
    "title": "Vanilla JS",
    "name": "javascript",
    "url": "/client-platforms/vanillajs",
    "image": "//auth0.com/lib/platforms-collection/img/html5.png"
  },
  {
    "title": "jQuery",
    "name": "jquery",
    "url": "/client-platforms/jquery",
    "image": "//upload.wikimedia.org/wikipedia/en/9/9e/JQuery_logo.svg"
  },
  {
    "title": "Angular.js",
    "name": "angular",
    "url": "/client-platforms/angularjs",
    "image": "//auth0.com/lib/platforms-collection/img/angular.png"
  },
  {
    "title": "React",
    "name": "react",
    "url": "/client-platforms/react",
    "image": "//auth0.com/lib/platforms-collection/img/react.png"
  },
  {
    "title": "Socket.io",
    "name": "socket-io",
    "url": "/client-platforms/socket-io",
    "image": "//auth0.com/lib/platforms-collection/img/socketio.svg"
  },
  {
    "title": "EmberJS",
    "name": "emberjs",
    "url": "/client-platforms/emberjs",
    "image": "//auth0.com/lib/platforms-collection/img/emberjs.png"
  }
];

PLATFORMS["native"] = [
  {
    "title": "iOS - Objective C",
    "name": "ios-objc",
    "url": "/native-platforms/ios-objc",
    "hybrid": false,
    "image": "//auth0.com/lib/platforms-collection/img/ios.png"
  },
  {
    "title": "iOS - Swift",
    "name": "ios-swift",
    "url": "/native-platforms/ios-swift",
    "hybrid": false,
    "image": "//auth0.com/lib/platforms-collection/img/ios.png"
  },
  {
    "title": "iOS - React Native",
    "name": "ios-react-native",
    "url": "/native-platforms/ios-reactnative",
    "hybrid": true,
    "image": "//auth0.com/lib/platforms-collection/img/react.png"
  },
  {
    "title": "Android",
    "name": "android",
    "url": "/native-platforms/android",
    "hybrid": false,
    "image": "//auth0.com/lib/platforms-collection/img/android.png"
  },
  {
    "title": "Windows Phone",
    "name": "windowsphone",
    "url": "/native-platforms/windowsphone",
    "hybrid": false,
    "image": "//auth0.com/lib/platforms-collection/img/windows-phone.png"
  },
  {
    "title": "Xamarin",
    "name": "xamarin",
    "url": "/native-platforms/xamarin",
    "hybrid": false,
    "image": "//auth0.com/lib/platforms-collection/img/xamarin.png"
  },
  {
    "title": "Cordova",
    "name": "cordova",
    "url": "/native-platforms/cordova",
    "hybrid": true,
    "image": "//auth0.com/lib/platforms-collection/img/phonegap.png"
  },
  {
    "title": "Phonegap",
    "name": "phonegap",
    "url": "/native-platforms/phonegap",
    "hybrid": true,
    "image": "//auth0.com/lib/platforms-collection/img/phonegap.png"
  },
  {
    "title": "Ionic",
    "name": "ionic",
    "url": "/native-platforms/ionic",
    "hybrid": true,
    "image": "//auth0.com/lib/platforms-collection/img/phonegap.png"
  },
  {
    "title": "Windows Store (JS)",
    "name": "windows-store-javascript",
    "url": "/native-platforms/windows-store-javascript",
    "hybrid": false,
    "image": "//auth0.com/lib/platforms-collection/img/windows-8.png"
  },
  {
    "title": "Windows Store (C#)",
    "name": "windows-store-csharp",
    "url": "/native-platforms/windows-store-csharp",
    "hybrid": false,
    "image": "//auth0.com/lib/platforms-collection/img/windows-8.png"
  },
  {
    "title": "WPF / Winforms",
    "name": "wpf-winforms",
    "url": "/native-platforms/wpf-winforms",
    "hybrid": false,
    "image": "//auth0.com/lib/platforms-collection/img/asp.png"
  }
];

PLATFORMS["server"] = [
  {
    "title": "Node.js",
    "name": "nodejs",
    "url": "/server-platforms/nodejs",
    "image": "//auth0.com/lib/platforms-collection/img/node.png"
  },
  {
    "title": "ASP.NET",
    "name": "aspnet",
    "url": "/server-platforms/aspnet",
    "image": "//auth0.com/lib/platforms-collection/img/asp.png"
  },
  {
    "title": "Go",
    "name": "golang",
    "url": "/server-platforms/golang",
    "image": "//auth0.com/lib/platforms-collection/img/golang.png"
  },
  {
    "title": "ASP Classic",
    "name": "asp-classic",
    "url": "/server-platforms/asp-classic",
    "image": "//auth0.com/lib/platforms-collection/img/asp-classic.jpg"
  },
  {
    "title": "ASP.NET (OWIN)",
    "name": "aspnet-owin",
    "url": "/server-platforms/aspnet-owin",
    "image": "//auth0.com/lib/platforms-collection/img/asp.png"
  },
  {
    "title": "ServiceStack",
    "name": "servicestack",
    "url": "/server-platforms/servicestack",
    "image": "//auth0.com/lib/platforms-collection/img/service-stack.png"
  },
  {
    "title": "PHP",
    "name": "php",
    "url": "/server-platforms/php",
    "image": "//auth0.com/lib/platforms-collection/img/php.png"
  },
  {
    "title": "PHP (Laravel)",
    "name": "laravel",
    "url": "/server-platforms/laravel",
    "image": "//auth0.com/lib/platforms-collection/img/php.png"
  },
  {
    "title": "PHP (Symfony)",
    "name": "symfony",
    "url": "/server-platforms/symfony",
    "image": "//auth0.com/lib/platforms-collection/img/php.png"
  },
  {
    "title": "Ruby On Rails",
    "name": "ruby-on-rails",
    "url": "/server-platforms/rails",
    "image": "//auth0.com/lib/platforms-collection/img/rails.png"
  },
  {
    "title": "Play 2 Scala",
    "name": "play-2-scala",
    "url": "/server-platforms/scala",
    "image": "//auth0.com/lib/platforms-collection/img/play.png"
  },
  {
    "title": "Java",
    "name": "java",
    "url": "/server-platforms/java",
    "image": "//auth0.com/lib/platforms-collection/img/java.png"
  },
  {
    "title": "Python",
    "name": "python",
    "url": "/server-platforms/python",
    "image": "//auth0.com/lib/platforms-collection/img/python.png"
  },
  {
    "title": "Apache",
    "name": "apache",
    "url": "/server-platforms/apache",
    "image": "//auth0.com/lib/platforms-collection/img/apache.jpg"
  },
  {
    "title": "NancyFX",
    "name": "nancyfx",
    "url": "/server-platforms/nancyfx",
    "image": "//auth0.com/lib/platforms-collection/img/nancyfx.png"
  }
];

PLATFORMS["api"] = [
  {
    "title": "ASP.NET Web API",
    "name": "aspnetweb-api",
    "url": "/server-apis/aspnet-webapi",
    "thirdParty": false,
    "image": "//auth0.com/lib/platforms-collection/img/asp.png"
  },
  {
    "title": "ASP.NET Web API (OWIN)",
    "name": "aspnetweb-owin-api",
    "url": "/server-apis/webapi-owin",
    "thirdParty": false,
    "image": "//auth0.com/lib/platforms-collection/img/asp.png"
  },
  {
    "title": "Node.js API",
    "name": "node-api",
    "url": "/server-apis/nodejs",
    "thirdParty": false,
    "image": "//auth0.com/lib/platforms-collection/img/node.png"
  },
  {
    "title": "Go",
    "name": "golang",
    "url": "/server-apis/golang",
    "image": "//auth0.com/lib/platforms-collection/img/golang.png"
  },
  {
    "title": "Ruby API",
    "name": "ruby-api",
    "url": "/server-apis/ruby",
    "thirdParty": false,
    "image": "//auth0.com/lib/platforms-collection/img/rails.png"
  },
  {
    "title": "Ruby On Rails API",
    "name": "rails-api",
    "url": "/server-apis/rails",
    "thirdParty": false,
    "image": "//auth0.com/lib/platforms-collection/img/rails.png"
  },
  {
    "title": "PHP API",
    "name": "php-api",
    "url": "/server-apis/php",
    "thirdParty": false,
    "image": "//auth0.com/lib/platforms-collection/img/php.png"
  },
  {
    "title": "PHP (Laravel) API",
    "name": "laravel-api",
    "url": "/server-apis/php-laravel",
    "thirdParty": false,
    "image": "//auth0.com/lib/platforms-collection/img/php.png"
  },
  {
    "title": "PHP (Symfony) API",
    "name": "symfony-api",
    "url": "/server-apis/php-symfony",
    "thirdParty": false,
    "image": "//auth0.com/lib/platforms-collection/img/php.png"
  },
  {
    "title": "Java API",
    "name": "java-api",
    "url": "/server-apis/java",
    "thirdParty": false,
    "image": "//auth0.com/lib/platforms-collection/img/java.png"
  },
  {
    "title": "Spring Security Java API",
    "name": "java-spring-security",
    "url": "/server-apis/java-spring-security",
    "thirdParty": false,
    "image": "//auth0.com/lib/platforms-collection/img/java.png"
  },
  {
    "title": "Python API",
    "name": "python-api",
    "url": "/server-apis/python",
    "thirdParty": false,
    "image": "//auth0.com/lib/platforms-collection/img/python.png"
  },
  {
    "title": ".NET WCF",
    "name": "wcf-api",
    "url": "/server-apis/wcf-tutorial",
    "thirdParty": false,
    "image": "//auth0.com/lib/platforms-collection/img/wcf.png"
  },
  {
    "title": "AWS",
    "name": "aws",
    "url": "/server-apis/aws",
    "thirdParty": true,
    "image": "//auth0.com/lib/saas-collection/img/aws.png"
  },
  {
    "title": "Azure Mobile Services",
    "name": "wams",
    "url": "/server-apis/azure-mobile-services",
    "thirdParty": true,
    "image": "//auth0.com/lib/platforms-collection/img/azure.png"
  },
  {
    "title": "Firebase",
    "name": "firebase",
    "url": "/server-apis/firebase",
    "thirdParty": true,
    "image": "//auth0.com/lib/saas-collection/img/firebase.png"
  },
  {
    "title": "Salesforce",
    "name": "salesforce",
    "url": "/server-apis/salesforce",
    "thirdParty": true,
    "image": "//auth0.com/lib/saas-collection/img/salesforce.png"
  },
  {
    "title": "Salesforce (sandbox)",
    "name": "salesforce-sandbox",
    "url": "/server-apis/salesforce-sandbox",
    "thirdParty": true,
    "image": "//auth0.com/lib/saas-collection/img/salesforce.png"
  },
  {
    "title": "SAP OData",
    "name": "sap-odata",
    "url": "/server-apis/sap-odata",
    "thirdParty": true,
    "image": "//auth0.com/lib/saas-collection/img/sap.png"
  }
];

var Quickstart = React.createClass({
  handleClick: function(quickstart) {
    var question = this.props.getQuestion(quickstart.name);

    this.props.updateTutorial({
      question: question,
      options: quickstart.name,
      appType: quickstart.name
    });
  },
  render: function() {
    var quickstart = this.props.model;
    
    return (
      <div className="quickstart" data-type={quickstart.name} onClick={this.handleClick.bind(this, quickstart)}>
        <div className="symbol">
          <i className={'icon-budicon-' + quickstart.icon}></i>
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
      tech1: tech.name,
      url: tech.url,
      skippable: true
    };

    if(tutorial.appType === 'native-mobile' || tutorial.appType === 'hybrid') {
      config.question = "Will you use a Backend or API with your mobile application?";
      config.options = "backend";
    }

    if(tutorial.appType === 'spa') {
      config.question = "Will you use a Backend or API with your Javascript Application?";
      config.options = "backend";
    }

    if(tutorial.options === 'backend' || tutorial.options === 'webapp') {
      if(tutorial.tech1) {
        config.tech1 = tutorial.tech1;
        config.tech2 = tech.name;

        // build combined url
        config.url = '/' + tutorial.appType + '/' + tutorial.tech1 + '/' + tech.name;
      }

      alert('redirect to ' + config.url);
      // perform redirect or fetch document
    }

    this.props.updateTutorial(config);
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


var TutorialNavigator = React.createClass({
  updateTutorial: function(change) {
    this.setState(change);
  },
  getInitialState: function () {
    return {
      question: "Getting started?, Try our Quickstarts",
      options: null,
      skippable: null,
      tech1: null,
      tech2: null,
      url: null
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
      "spa": this.props.platforms.client,
      "native-mobile": [],
      "webapp": this.props.platforms.server,
      "hybrid": [],
      "backend": this.props.platforms.api
    };

    this.props.platforms.native.forEach(function(tech) {
      if(tech.hybrid) {
        options["hybrid"].push(tech)
      } else {
        options["native-mobile"].push(tech);
      }
    });

    return options[platformType];
  },
  render: function() {
    return (
      <div className="js-tutorial-navigator">
        <div className="container">
          <h1>Documentation</h1>
          <p>{this.state.question}</p>
        </div>

        <QuickstartList quickstarts={this.props.quickstarts} updateTutorial={this.updateTutorial} getQuestion={this.getQuestion} tutorial={this.state} />
        <TechList options={this.getOptions(this.state.options)} updateTutorial={this.updateTutorial} tutorial={this.state} />
      </div>
    );
  }
});

React.render(
  <TutorialNavigator quickstarts={QUICKSTARTS} platforms={PLATFORMS} />,
  document.getElementById('tutorial-navigator')
);