angular.module('openbrews.unitConversions', [])
.service('UnitConversions', [function () {

  /* Converts liters into gallons */
  this.LToGal = function(val) {
    return val * 0.264172;
  };

  /* Converts Kilograms to Pounds */
  this.KgToLbs = function(val) {
    return val * 2.20462;
  };

}]);
