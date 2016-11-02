angular.module('openbrews.recipeUtils', ['openbrews.unitConversions'])
.service('RecipeUtils', ['$http', 'UnitConversions', function ($http, UnitConversions) {

  var utilizationTable;
  $http.get('recipe/utils/UtilizationTable.json').then(function onSuccess(response) {
    utilizationTable = angular.fromJson(response.data);
    console.log(utilizationTable);
  });
  utilizationTable[1.03][0] = 1;

  /**
   * Calculate the OG (Original Gravity)
   * that the recipe should have. */
  this.calcOG = function(recipe) {
    var boilSizeInGallons = 0;
    if(recipe.boilSize) {
      //Convert boil size to gallons if needed
      if(recipe.boilSizeUnits == "L") {
        boilSizeInGallons = UnitConversions.LToGal(recipe.boilSize);
      } else {
        boilSizeInGallons = recipe.boilSize;
      }
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

   /*
    * this returns the % utilization of a hop based on it's boil time.
    * A boil time in a given range has a specific % yield.
    * values taken from http://www.homebrewing.org/International-Bittering-Units_ep_49-1.html */
   var getHopUtilization = function(hop) {
     if(hop.stage != "Boil") {// only boiling utilizes hops
       return 0;
     } else if(hop.addTime > 60) {
       return 31;
     } else if (hop.addTime > 50) {
       return 30;
     } else if (hop.addTime > 45) {
       return 28.1;
     } else if (hop.addTime > 40) {
       return 22.8;
     } else if (hop.addTime > 30) {
       return 15.3
     } else if (hop.addTime > 20) {
       return 12.1
     } else if (hop.addTime > 15) {
       return 10.1;
     } else if (hop.addTime > 10) {
       return 8;
     } else if (hop.addTime > 5) {
       return 6;
     } else if (hop.addTime > 0) {
       return 5;
     } else {
       return 0;
     }
   }

   /**
    * Calculate the final IBU (International Bitterness Units)
    * that the recipe should have when done.
    * formula: IBUs = U% * (ALPHA% * W_OZ * 0.7489) / (V_Gal)
    * taken from http://beersmith.com/blog/2008/04/20/calculating-hop-bitterness-how-much-hops-to-use/ */
    this.calcIBU = function(recipe) {
      var ibu = 0;
      var boilSizeInGallons = null;
      if(recipe.boilSize) {
        //Convert boil size to gallons if needed
        if(recipe.boilSizeUnits == "L") {
          boilSizeInGallons = UnitConversions.LToGal(recipe.boilSize);
        } else {
          boilSizeInGallons = recipe.boilSize;
        }
      } else {
        return ibu;
      }


      angular.forEach(recipe.hops, function(hop) {
        /* get the hop weight in ounces */
        var weightInOz = 0;
        if(hop.weight) {
          if(hop.weightUnits == "G") {
            weightInOz = UnitConversions.GToOz(hop.weight);
          } else {
            weightInOz = hop.weight;
          }
        }

        var hopIbu = hop.aa * weightInOz * getHopUtilization(hop) * 0.7489 / boilSizeInGallons;
        ibu += hopIbu;
      });
      return ibu;
    };

    /**
     * Calculate the SRM (Standard Reference Method), or
     * estimated color index of the finished product. */
     this.calcSRM = function(recipe) {
       return 0;
     };

}]);
