angular.module('openbrews.recipeUtils', ['openbrews.unitConversions'])
.service('RecipeUtils', ['$http', 'UnitConversions', function ($http, UnitConversions) {

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
    } else {
      return 0;
    }
    var mashEfficiency = recipe.mashEfficiency / 100;//mash efficiency as a decimal
    var steepEfficiency = recipe.steepEfficiency / 100;//steep efficiency as a decimal

    /* find the total number of gravity points first */
    var totalGravityPoints = 0;
    angular.forEach(recipe.fermentables, function(f) {
      var weightInLbs;
      if(f.weightUnits == "Kg") {
        weight = UnitConversions.KgToLbs(f.weight);
      } else {
        weightInLbs = f.weight;
      }
      var points = f.ppg * weightInLbs;
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
    return parseFloat(fg.toFixed(3));
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

    var returnedAbv = abv;

    /* if the abv exceeds our yeast tolerance, it's impossible */
    if(tolerance && abv > tolerance) {
      returnedAbv = tolerance;
    }

    return parseFloat(returnedAbv.toFixed(2));
  };

  /**
   * Calculate the final ABW (Alcohol by Weight)
   * that the recipe should yield. */
   this.calcABW = function(recipe) {
     return parseFloat((recipe.abv * 0.8).toFixed(2));
   };

   /*
    * this returns the % utilization of a hop based on it's boil time.
    * A boil time in a given range has a specific % yield.
    * Formula from http://realbeer.com/hops/research.html */
  var getHopUtilization = function(recipe, hop) {
     if(hop.stage != "Boil") {// only boiling utilizes hops
       return 0;
     } else {
       //Bigness factor = 1.65 * 0.000125^(wort gravity - 1)
       var bignessFactor = 0;
       if(recipe.og) {
         bignessFactor = 1.65 * Math.pow(0.000125,recipe.og - 1);
       }
       //Boil Time factor = (1 - e^(-0.04 * time in mins))/4.15
       var boilTimeFactor = 0;
       if(recipe.boilTime) {
         boilTimeFactor = (1 - Math.pow(Math.E, -0.04 * hop.addTime))/4.15;
       }
       return bignessFactor * boilTimeFactor;
     }
  }
  this.getHopUtilization = getHopUtilization;

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
        // IBUs = decimal alpha acid utilization * mg/l of added alpha acids
        // mg/l of added alpha acids = (decimal AA rating * ozs hops * 7490)/boilSize
        // utilization => see getHopUtilization
        var mgl = (hop.aa * weightInOz * 74.90)/boilSizeInGallons;
        var hopIbu = getHopUtilization(recipe, hop) * mgl;
        ibu += hopIbu;
      });
    return parseFloat(ibu.toFixed(1));
    };

    /**
     * Calculate the SRM (Standard Reference Method), or
     * estimated color index of the finished product. */
    this.calcSRM = function(recipe) {
      var boilSizeInGallons = null;
      if(recipe.boilSize) {
        //Convert boil size to gallons if needed
        if(recipe.boilSizeUnits == "L") {
          boilSizeInGallons = UnitConversions.LToGal(recipe.boilSize);
        } else {
          boilSizeInGallons = recipe.boilSize;
        }
      } else {
        return 0;
      }

      var srm = 0;
      /* add the srm of each fermentable */
      angular.forEach(recipe.fermentables, function(f) {
        var weightInLbs;
        if(f.weightUnits == "Kg") {
          weight = UnitConversions.KgToLbs(f.weight);
        } else {
          weightInLbs = f.weight;
        }
        if(f.srm && weightInLbs) {
          var mcu = (weightInLbs * f.srm) / boilSizeInGallons;
          srm += 1.4922 * Math.pow(mcu, 0.6859);
        }
      });
    return parseFloat(srm.toFixed(2));
    };

}]);
