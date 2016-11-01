angular.module('openbrews.recipeUtils', [])
.service('RecipeUtils', [function () {

  /**
   * Calculate the OG (Original Gravity)
   * that the recipe should have. */
  this.calcOG = function(recipe) {
    return 0;
  };

  /**
   * Calculate the FG (Original Gravity)
   * that the recipe should have. */
  this.calcFG = function(recipe) {
    return 0;
  };

  /**
   * Calculate the final ABV (Alcohol by Volumne)
   * that the recipe should yield. */
  this.calcABV = function(recipe) {
    return 0;
  };

  /**
   * Calculate the final ABW (Alcohol by Weight)
   * that the recipe should yield. */
   this.calcABW = function(recipe) {
     return 0;
   };

   /**
    * Calculate the final IBU (International Bitterness Units)
    * that the recipe should have when done. */
    this.calcIBU = function(recipe) {
      return 0;
    };

    /**
     * Calculate the SRM (Standard Reference Method), or
     * estimated color index of the finished product. */
     this.calcSRM = function(recipe) {
       return 0;
     };

}]);
