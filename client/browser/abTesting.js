export default function abTesting(abExperiments) {
  if (!abExperiments) return;

  try {
    window.abTestingLib.load({ experiments: !abExperiments });
    window.abTestingLib.integration('auth0metrics').start({ metrics: window.metricsLib});
    window.abTestingLib.start();

    $('.container').css('visibility', 'hidden');
    
    window.abTestingLib.onReady(function (ab) {
      window.ABLibLoaded = true;
      try {
        window.ABExperiments = ab.getExperiments();
        executeABExperiments(window.ABExperiments);
      }
      catch (e) {
        window.console && console.error('Error running AB experiments.\n%s', e.message);
        $('.container').css('visibility', 'visible');
      }
    });

  }
  catch (e) {
    window.ABLibLoaded = true;
    window.console && console.error('Error initializing ABTesting lib. ABTesting will be disabled');
    $('.container').css('visibility', 'visible');
  }
};
  
function executeABExperiments(experiments) {
  var path = window.location.pathname;
  var experiments = experiments;

  if (!window.ABLibLoaded) {
    return;
  }
  
  if(!experiments) {
    // Restore content
    $('.container').css('visibility', 'visible');
    return;
  }

  try {
    var experimentsForPath = experiments.runAllByPath(path);
    var winningVariants = [];

    experimentsForPath.experiments.forEach(function (e) {
      winningVariants = winningVariants.concat(e.getCurrentVariant().getPropertiesByType('js'));
    });

    var variantContext = {};
    variantContext.$ = $;

    winningVariants.forEach(function(v) {
      v.runInContext(variantContext);
    });
  } catch (e) {
    window.console && console.error("Error running experiments for path:%s", path);
  } finally {
    // Restore content
    $('.container').css('visibility', 'visible');
  }
};
