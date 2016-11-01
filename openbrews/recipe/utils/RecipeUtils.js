angular.module('openbrews.recipeUtils', [])
.service('RecipeUtils', [function () {

  /**
   * Calculate the OG (Original Gravity)
   * that the recipe should have. */
  this.calcOG = function(recipe) {
    var boilSizeInGallons = recipe.boilSize;
    var mashEfficiency = recipe.mashEfficiency / 100;//mash efficiency as a decimal

    /* find the total number of gravity points first */
    var totalPPG = 0;
    angular.forEach(recipe.fermentables, function(f) {
      totalPPG += (f.ppg * f.weight);
    });
    totalPPG *= mashEfficiency;

    var og = totalPPG / boilSizeInGallons;
    og = (og + 1000) / 1000; //convert OG from gravity points to density relative to water.
    return parseFloat(og.toFixed(3)); //round the OG to 3 decimal places
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
