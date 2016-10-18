angular.module('openbrews.breweryDB', [])
.service('BreweryDB', ['$rootScope', '$http', function ($rootScope,$http) {

  var URL = 'http://api.brewerydb.com/v2';

  var STYLES_KEY = 'stylesInStorage';
  var FERMENTABLES_KEY = 'fermentablesInStorage';


  /* sync all objects in the local cache with breweryDB */
  this.syncDB = function() {
    this.syncStyles();
    this.syncFermentables();
  };

  /////////////////////////////////////
  // Beer Styles
  /////////////////////////////////////

  /* 
   * Get all beer styles from the local cache.
   * Transform them to our required format, and return them.
   */
  var getStyles = function() {
    if (localStorage.getItem(STYLES_KEY)) {
      return JSON.parse(localStorage.getItem(STYLES_KEY));
    } else {
      return [];
    }
  };
  this.getStyles = getStyles;

  this.syncStyles = function() {
    $http({
      method: 'GET',
      url: URL + '/styles',
      params: {
        key: $rootScope.config.BREWERY_DB_KEY
      }
    }).then(function successCallback(response) {
      var styles = response.data.data;
      var stylesInStorage = getStyles();
      /* 
       * if there are not the same number of styles in local storage,
       * then save the new styles in our cache */
      if(styles.length != stylesInStorage.length) {
        styles = styles.map(function(styleObject) {//map to list of strings
          styleObject = styleObject.name;
          return styleObject;
        });
        //save to the local styles cache
        localStorage.setItem(STYLES_KEY, JSON.stringify(styles));
        stylesInStorage = styles;
      }
    }, function failureCallback(response) {
      console.log("Unable to sync styles.");
    });
  };

  /////////////////////////////////////
  // Fermentables
  /////////////////////////////////////

  /* a data map of pages to fermentables received from that page */
  var fermentablesSyncing = [];

  /* transform fermentable into an object we can use */
  var parseFermentables = function(fermentables) {
    fermentables = fermentables.map(function(fermentableObject) {//map to list of strings
      return fermentableObject;
    });
    return fermentables;
  };

  /* 
   * Get all beer styles from the local cache.
   * Transform them to our required format, and return them.
   */
  var getFermentables = function() {
    if (localStorage.getItem(FERMENTABLES_KEY)) {
      return JSON.parse(localStorage.getItem(FERMENTABLES_KEY));
    } else {
      return [];
    }
  };
  this.getFermentables = getFermentables;

  /*
   * Called after all fermentables have been retrieved into the
   * fermentablesSyncing Array
   */
  var onLastPage = function(numPages) {
    fermentables = [];
    for(var i = 1; i <= numPages; i++) {
      fermentables = fermentables.concat(fermentablesSyncing[i])
    }
    localStorage.setItem(FERMENTABLES_KEY, JSON.stringify(fermentables));
    console.log(fermentables);
  };

  /* 
   * Get's the fermantables page #p. Transforms the response and saves it in
   * the syncing array.
   */
  var getFermPage = function(p) {
    return $http({
      method: 'GET',
      url: URL + '/fermentables',
      params: {
        key: $rootScope.config.BREWERY_DB_KEY,
        p: p
      }
    }).then(function successCallback(response) {
      var pageNum = response.data.currentPage;
      var numPages = response.data.numberOfPages;
      fermentablesSyncing[pageNum] = parseFermentables(response.data.data);
      if(pageNum != numPages && p > 1) {//if it's not the first or last page
        getFermPage(pageNum+1);
      } else {
        onLastPage(numPages);
      }
      return response;
    }, function failureCallback(response) {
      console.log("Unable to sync fermentables.");
      return response;
    });
  };

  this.syncFermentables = function() {
    fermentablesSyncing = {};
    /* make the first request to breweryDB to see if we need to sync */
    getFermPage(1).then(function successCallback(response) {
      var fermentablesInStorage = getFermentables();
      var numFermentables = response.data.totalResults;

      /* if there is a mismatch in lengths then we need to sync */
      if(fermentablesInStorage.length != numFermentables) {
        getFermPage(2);
      }
    }, function failureCallback(response) {
      console.log("Unable to sync fermentables.");
    });
  };

}]);
