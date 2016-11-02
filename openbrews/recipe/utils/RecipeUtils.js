angular.module('openbrews.recipeUtils', ['openbrews.unitConversions'])
.service('RecipeUtils', ['UnitConversions', function (UnitConversions) {

  /**
   * Calculate the OG (Original Gravity)
   * that the recipe should have. */
  this.calcOG = function(recipe) {

    //Convert boil size to gallons if needed
    if(recipe.boilSizeUnits == "L") {
      boilSizeInGallons = UnitConversions.LToGal(recipe.boilSize);
    } else {
      boilSizeInGallons = recipe.boilSize;
    }
    var mashEfficiency = recipe.mashEfficiency / 100;//mash efficiency as a decimal
    var steepEfficiency = recipe.steepEfficiency / 100;//steep efficiency as a decimal

    /* find the total number of gravity points first */
    var totalGravityPoints = 0;
    angular.forEach(recipe.fermentables, function(f) {
      var weightInLbs;
      if(f.weightUnits == "Kg") {
        weight = UnitConversions.KgToLbs(f.weight);
      }
      var points = f.ppg * f.weight;
      if(f.method == "Mash") {
        points *= mashEfficiency;
      } else if(f.method == "Steep") {

      }
      totalGravityPoints += points;
    });

    //divide the total by the boil size and convert from points to density relative to water
    var og = totalGravityPoints / boilSizeInGallons;
    og = (og + 1000) / 1000; //convert OG from gravity points to density relative to water.

    //round the OG to 3 decimal places
    return parseFloat(og.toFixed(3));
  };

  /**
   * Calculate the FG (Original Gravity)
   * that the recipe should have. */
  this.calcFG = function(recipe) {
    /* first convert the OG from a density to gravity points */
    var ogPoints = (recipe.og * 1000) - 1000;

    var attenuationPercent = 0;
    /* select the highest attenuation out of any yeast strains used */
    angular.forEach(recipe.yeasts, function(yeast) {
      if(yeast.attenuation > attenuationPercent) {
        attenuationPercent = yeast.attenuation;
      }
    });
    attenuationPercent /= 100; // put the percentin decimal form

    /* FG is 1 + (ogPoints * (1 - attenuationPercent)) / 1000 */
    var fg = 1 +  (ogPoints * (1 - attenuationPercent)) / 1000;
    return fg;
  };

  /**
   * Calculate the final ABV (Alcohol by Volumne)
   * that the recipe should yield.
   * (1.05/0.79) x ((OG – FG) / FG)  x 100 */
  this.calcABV = function(recipe) {
    var abv = (1.05/0.79) * ( (recipe.og - recipe.fg)/recipe.fg) * 100;
    /* make sure the calculated abv isn't higher than our highest yeast tolerance */
    var tolerance = null;
    angular.forEach(recipe.yeasts, function(yeast) {
      if(yeast.alcoholTolerance && (yeast.alcoholTolerance > tolerance || tolerance == null)) {
        tolerance = yeast.alcoholTolerance;
      }
    });

    /* if the abv exceeds our yeast tolerance, it's impossible */
    if(tolerance && abv > tolerance) {
      return tolerance;
    } else {
      return abv;
    }
  };

  /**
   * Calculate the final ABW (Alcohol by Weight)
   * that the recipe should yield. */
   this.calcABW = function(recipe) {
     return recipe.abv * 0.8;
   };

   /**
    * Calculate the final IBU (International Bitterness Units)
    * that the recipe should have when done. */
   this.IBU_implemented = false;
    this.calcIBU = function(recipe) {
      return 0;
    };

    /**
     * Calculate the SRM (Standard Reference Method), or
     * estimated color index of the finished product. */
    this.SRM_implemented = false;
     this.calcSRM = function(recipe) {
       return 0;
     };

  /**
   * Call this function to update recipe with appropriate values
   * just before saving it */
  this.updateRecipeWithCalculatedVals = function(recipe) {
    recipe.og = this.calcOG(recipe);
    recipe.fg = this.calcFG(recipe);

    if (this.SRM_implemented) recipe.srm = this.calcSRM(recipe);

    recipe.abv = this.calcABV(recipe);
    recipe.abw = this.calcABW(recipe);

    if (this.IBU_implemented) recipe.ibu = this.calcIBU(recipe);
    return recipe;
  };

}]);
