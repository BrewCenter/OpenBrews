angular.module('openbrews.breweryDB', [])
.service('BreweryDB', ['$rootScope', '$http', function ($rootScope,$http) {

  var URL = 'http://api.brewerydb.com/v2';

  var STYLES_KEY = 'stylesInStorage';
  var FERMENTABLES_KEY = 'fermentablesInStorage';
  var HOPS_KEY = 'hopsInStorage';
  var YEASTS_KEY = 'yeastsInStorage';

  /*
   * Called after all objects have been retrieved into their respective
   * sync arrays
   */
  var onLastPage = function(syncArray, numPages, key) {
    objects = [];
    for(var i = 1; i <= numPages; i++) {
      objects = objects.concat(syncArray[i])
    }
    localStorage.setItem(key, JSON.stringify(objects));
  };


  /* sync all objects in the local cache with breweryDB */
  this.syncDB = function() {
    this.syncStyles();
    this.syncFermentables();
    this.syncHops();
    this.syncYeasts();
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
      if(response.data) {
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
   * Transform the fermentable into an object with a name,
   * srm, ppg, and indication of whether it must be mashed.
   */
  var transformFermentables = function(fermentables) {
    fermentables = fermentables.map(function(fermentableObject) {//map to list of strings
      fermentable = {};
      fermentable.readableName = fermentableObject.name;
      fermentable.name = fermentableObject.name;
      fermentable.srm = fermentableObject.srmPrecise ? fermentableObject.srmPrecise : null;
      // convert potential to PPG. ex. if potential=1.037 => ppg = 27
      fermentable.ppg = fermentableObject.potential ? (fermentableObject.potential * 1000) % 1000 : null;
      return fermentable;
    });
    return fermentables;
  };

  /* 
   * Get's the fermantables page #p. Transforms the response and saves it in
   * the syncing array. This will make a recursive call to syncronize the next
   * page of results from the API if the current page isn't the first or last page.
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
      fermentablesSyncing[pageNum] = transformFermentables(response.data.data);

      if(p != 1) {//if it's not the first page
        if(pageNum != numPages) {//if it's not the last page
          getFermPage(pageNum+1);
        } else {
          onLastPage(fermentablesSyncing, numPages, FERMENTABLES_KEY);
        }
      }
      return response;
    }, function failureCallback(response) {
      console.log("Unable to sync fermentables.");
      return response;
    });
  };

  /*
   * Pull fermentables from the database. If there is a mismatch in the number
   * of fermentables we have and the number we get, we'll have to do a full sync.
   */
  this.syncFermentables = function() {
    fermentablesSyncing = {};
    /* make the first request to breweryDB to see if we need to sync */
    getFermPage(1).then(function successCallback(response) {
      if(response.data) {
        var fermentablesInStorage = getFermentables();
        var numFermentables = response.data.totalResults;

        /* if there is a mismatch in lengths then we need to sync */
        if(fermentablesInStorage.length != numFermentables) {
          getFermPage(2);
        }
      }
    }, function failureCallback(response) {
      console.log("Unable to sync fermentables.");
    });
  };

  /////////////////////////////////////
  // Hops
  /////////////////////////////////////

  /* a data map of pages to hops received from that page */
  var hopsSyncing = [];

  /* 
   * Get all beer styles from the local cache.
   * Transform them to our required format, and return them.
   */
  var getHops = function() {
    if (localStorage.getItem(HOPS_KEY)) {
      return JSON.parse(localStorage.getItem(HOPS_KEY));
    } else {
      return [];
    }
  };
  this.getHops = getHops;

  /*
   * Transform the hop into an object with a name,
   * srm, ppg, and indication of whether it must be mashed.
   */
  var transformHops = function(hops) {
    hops = hops.map(function(hopObject) {//map to list of strings
      hop = {};
      hop.name = hopObject.name;
      hop.readableName = hop.name;
      hop.alphaAcidMin = hopObject.alphaAcidMin ? hopObject.alphaAcidMin : null;
      hop.alphaAcidMax = hopObject.alphaAcidMax ? hopObject.alphaAcidMax : null;
      return hop;
    });
    return hops;
  };

  /* 
   * Get's the fermantables page #p. Transforms the response and saves it in
   * the syncing array. This will make a recursive call to syncronize the next
   * page of results from the API if the current page isn't the first or last page.
   */
  var getHopsPage = function(p) {
    return $http({
      method: 'GET',
      url: URL + '/hops',
      params: {
        key: $rootScope.config.BREWERY_DB_KEY,
        p: p
      }
    }).then(function successCallback(response) {
      var pageNum = response.data.currentPage;
      var numPages = response.data.numberOfPages;
      hopsSyncing[pageNum] = transformHops(response.data.data);

      if(p != 1) {//if it's not the first page
        if(pageNum != numPages) {//if it's not the last page
          getHopsPage(pageNum+1);
        } else {
          onLastPage(hopsSyncing, numPages, HOPS_KEY);
        }
      }
      return response;
    }, function failureCallback(response) {
      console.log("Unable to sync hops.");
      return response;
    });
  };

  /*
   * Pull hops from the database. If there is a mismatch in the number
   * of hops we have and the number we get, we'll have to do a full sync.
   */
  this.syncHops = function() {
    hopsSyncing = {};
    /* make the first request to breweryDB to see if we need to sync */
    getHopsPage(1).then(function successCallback(response) {
      if(response.data) {
        var hopsInStorage = getHops();
        var numHops = response.data.totalResults;

        /* if there is a mismatch in lengths then we need to sync */
        if(hopsInStorage.length != numHops) {
          getHopsPage(2);
        }
      }
    }, function failureCallback(response) {
      console.log("Unable to sync hops.");
    });
  };

  /////////////////////////////////////
  // Yeasts
  /////////////////////////////////////

  /* a data map of pages to yeasts received from that page */
  var yeastsSyncing = [];

  /* 
   * Get all beer styles from the local cache.
   * Transform them to our required format, and return them.
   */
  var getYeasts = function() {
    if (localStorage.getItem(YEASTS_KEY)) {
      return JSON.parse(localStorage.getItem(YEASTS_KEY));
    } else {
      return [];
    }
  };
  this.getYeasts = getYeasts;

  /*
   * Transform the yeast into an object with a name,
   * srm, ppg, and indication of whether it must be mashed.
   */
  var transformYeasts = function(yeasts) {
    yeasts = yeasts.map(function(yeastObject) {
      yeast = {};
      yeast.name = yeastObject.name;
      yeast.readableName = yeast.name;
      yeast.attenuationMax = yeastObject.attenuationMax ? yeastObject.attenuationMax : null;
      yeast.attenuationMin = yeastObject.attenuationMin ? yeastObject.attenuationMin : null;
      yeast.fermentTempMax = yeastObject.fermentTempMax ? yeastObject.fermentTempMax : null;
      yeast.fermentTempMin = yeastObject.fermentTempMin ? yeastObject.fermentTempMin : null;
      yeast.alcoholToleranceMin = yeastObject.alcoholToleranceMin ? yeastObject.alcoholToleranceMin : null;
      yeast.alcoholToleranceMax = yeastObject.alcoholToleranceMax ? yeastObject.alcoholToleranceMax : null;
      return yeast;
    });
    return yeasts;
  };

  /* 
   * Get's the fermantables page #p. Transforms the response and saves it in
   * the syncing array. This will make a recursive call to syncronize the next
   * page of results from the API if the current page isn't the first or last page.
   */
  var getYeastsPage = function(p) {
    return $http({
      method: 'GET',
      url: URL + '/yeasts',
      params: {
        key: $rootScope.config.BREWERY_DB_KEY,
        p: p
      }
    }).then(function successCallback(response) {
      var pageNum = response.data.currentPage;
      var numPages = response.data.numberOfPages;
      yeastsSyncing[pageNum] = transformYeasts(response.data.data);

      if(p != 1) {//if it's not the first page
        if(pageNum != numPages) {//if it's not the last page
          getYeastsPage(pageNum+1);
        } else {
          onLastPage(yeastsSyncing, numPages, YEASTS_KEY);
        }
      }
      return response;
    }, function failureCallback(response) {
      console.log("Unable to sync yeasts.");
      return response;
    });
  };

  /*
   * Pull yeasts from the database. If there is a mismatch in the number
   * of yeasts we have and the number we get, we'll have to do a full sync.
   */
  this.syncYeasts = function() {
    yeastsSyncing = {};
    /* make the first request to breweryDB to see if we need to sync */
    getYeastsPage(1).then(function successCallback(response) {
      if(response.data) {
        var yeastsInStorage = getYeasts();
        var numYeasts = response.data.totalResults;

        /* if there is a mismatch in lengths then we need to sync */
        if(yeastsInStorage.length != numYeasts) {
          getYeastsPage(2);
        }
      }
    }, function failureCallback(response) {
      console.log("Unable to sync yeasts.");
    });
  };

}]);
