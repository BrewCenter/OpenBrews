angular.module('openbrews.breweryDB', [])
.service('BreweryDB', ['$rootScope', '$http', function ($rootScope,$http) {

  var URL = 'http://api.brewerydb.com/v2';

  var STYLES_KEY = 'stylesInStorage';


  /* sync all objects in the local cache with breweryDB */
  this.syncDB = function() {
    this.syncStyles();
  };

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
      return stylesInStorage;
    }, function failureCallback(response) {
      return [];
    });
  };

}]);
