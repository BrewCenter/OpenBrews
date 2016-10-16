angular.module('openbrews.breweryDB', [])
.service('BreweryDB', ['$rootScope', '$http', function ($rootScope,$http) {

  /* 
   * Get all beer styles from BreweryDB.
   * Transform them to our required format, and return them.
   */
  this.getStyles = function() {
    var promise = $http({
      method: 'GET',
      url: "http://api.brewerydb.com/v2/styles",
      params: {
        key: $rootScope.config.BREWERY_DB_KEY
      }
    }).then(function successCallback(response) {
      var styles = response.data.data;
      styles = styles.map(function(styleObject) {
        styleObject.readableName = styleObject.name;
        return styleObject;
      });
      return styles;
      console.log($scope.styles);
    }, function failureCallback(response) {
      console.log("Failed to get styles");
      return [];
    });
    return promise;
  };

}]);
