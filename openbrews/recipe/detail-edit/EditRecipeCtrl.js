//AddRecipe shows a list of recipes saved to the users device or profile
(function(){
  'use strict';
  angular.module('openbrews.editRecipe', [
    'openbrews.fermentableDirective',
    'openbrews.hopDirective',
    'openbrews.yeastDirective',
    'openbrews.otherIngredientDirective',
    'openbrews.noteDirective',
    'openbrews.recipeStore',
    'openbrews.recipeUtils',
    'openbrews.breweryDB'
  ])
    .controller('EditRecipeCtrl', ['$scope', '$state', 'RecipeStore', 'RecipeUtils', 'BreweryDB', '$http', '$filter', '$q', function($scope, $state, RecipeStore, RecipeUtils, BreweryDB, $http, $filter, $q) {

      var defaultRecipe = {
        name: '',
        style: '',
        boilSize: 5,
        boilSizeUnits: 'Gal',
        boilTime: 60,
        estFermentationDays: 7,
        secondaryTimeDays: 0,
        mashEfficiency: 68,
        steepEfficiency: 30,
        og: 0,
        fg: 0,
        abv: 0,
        abw: 0,
        fermentables: [],
        hops: [],
        yeasts: [],
        others: [],
        notes: []
      };

      /* Add a new fermentable */
      $scope.addFermentable = function() {
        $scope.recipe.fermentables.push(
          {
            method: 'Mash',
            weight: 0,
            weightUnits: 'Lbs',
            addTime: 60,
            ppg: 0,
            srm: 0
          }
        );
      };

      /* remove the fermentable at the given index */
      $scope.deleteFermentable = function(index) {
        $scope.recipe.fermentables.splice(index,1);
      };

      /* Add other ingredient. */
      $scope.addOther = function() {
        $scope.recipe.others.push({
          name: '',
          amount: 0,
          amountUnits: 'oz',
          stage: 'Boil',
          addTime: 0
        });
      };

      /* Delete other ingredient. */
      $scope.deleteOther = function(index) {
        $scope.recipe.others.splice(index,1);
      };

      /* Add a new Hop */
      $scope.addHop = function() {
        $scope.recipe.hops.push(
          {
            weight: 0,
            weightUnits: 'oz',
            type: 'Pellet',
            aa: 0,
            stage: 'Boil',
            addTime: 0
          }
        );
      };

      /* remove the Hop at the given index */
      $scope.deleteHop = function(index) {
        $scope.recipe.hops.splice(index,1);
      };

      /* Delete the yeast at supplied index */
      $scope.deleteYeast = function(index) {
        $scope.recipe.yeasts.splice(index, 1);
      };

      /* Add a new yeast */
      $scope.addYeast = function() {
        $scope.recipe.yeasts.push(
          {
            amount: 0,
            attenuation: 0,
            alcoholTolerance: 0,
            flocculation: 'Medium-Low',
            amountUnits: 'G'
          }
        );
      };

      /* Add a new note */
      $scope.addNote = function() {
        $scope.recipe.notes.push({
          'text': ''
        });
      };

      /* Delete the given note */
      $scope.deleteNote = function(index) {
        $scope.recipe.notes.splice(index, 1);
      };

      /* Save a recipe in LocalStorage */
      $scope.saveRecipe = function() {
        if ($state.params.isNew) {
          RecipeStore.insert($scope.recipe);
        } else {
          RecipeStore.update($scope.recipe);
        }
        $state.go('recipes');
      };


      ////////////////////////////////////////////////////////////
      // Functions that watch variables and update calculated
      // values appropriately
      ///////////////////////////////////////////////////////////

      function updateOG () {
        $scope.recipe.og = RecipeUtils.calcOG($scope.recipe);
      }

      function updateFG () {
        $scope.recipe.fg = RecipeUtils.calcFG($scope.recipe);
      }

      function updateABV () {
        $scope.recipe.abv = RecipeUtils.calcABV($scope.recipe);
      }

      function updateABW () {
        $scope.recipe.abw = RecipeUtils.calcABW($scope.recipe);
      }

      function updateIBU() {
        $scope.recipe.ibu = RecipeUtils.calcIBU($scope.recipe);
      }

      function updateSRM() {
        $scope.recipe.srm = RecipeUtils.calcSRM($scope.recipe);
      }

      function srmWatcher() {
        updateSRM();
      }

      function ibuWatcher() {
        updateIBU();
      }

      function abvWatcher () {
        updateABW();
      }

      function fgWatcher () {
        updateFG();
        updateABV();
        updateABW();
      }

      function ogWatcher () {
        updateOG();
        updateFG();
        updateABV();
        updateABW();
        updateIBU();
      }

      /* Make OG recalculate when it's dependencies change */
      $scope.$watchGroup(
        [
          'recipe.boilSize',
          'recipe.boilSizeUnits',
          'recipe.mashEfficiency',
          'recipe.steepEfficiency'
        ],
        ogWatcher);

      /* recalculate srm when it's dependencies change */
      $scope.$watchGroup(
        [
          'recipe.boilSize',
          'recipe.boilSizeUnits'
        ],
        srmWatcher);

      /* for srm and og */
      $scope.$watchCollection(
        'recipe.fermentables',
        function (newVals) {
          var i;
          for(i = 0; i < newVals.length; ++i) {
            $scope.$watchCollection('recipe.fermentables[' + i + ']', ogWatcher);
            $scope.$watchCollection('recipe.fermentables[' + i + ']', srmWatcher);
          }
        });

      /* update FG and abv when it's dependencies change */
      $scope.$watchCollection(
        'recipe.yeasts',
        function (newVals) {
          var i;
          for(i = 0; i < newVals.length; ++i) {
            $scope.$watchCollection('recipe.yeasts[' + i + ']', fgWatcher);
            $scope.$watchCollection('recipe.yeasts[' + i + ']', abvWatcher);
          }
        });
      
      /* update ibu when it's dependencies change */
      $scope.$watchCollection(
        'recipe.hops',
        function (newVals) {
          var i;
          for(i = 0; i < newVals.length; ++i) {
            $scope.$watchCollection('recipe.hops[' + i + ']', ibuWatcher);
          }
        });

      /////////////////////////////////////////////////////////////
      // Smart Type Functions
      /////////////////////////////////////////////////////////////

      /* set the style selected */
      $scope.setStyle = function(item){
        $scope.recipe.style = item;
      };

      /* set the style selected */
      $scope.setFermentable = function(item, fermentable){
        fermentable.name = item.name;
        if(item.srm) {
          fermentable.srm = item.srm;
        }
        if(item.ppg) {
          fermentable.ppg = item.ppg;
        }
      };

      /* set the style selected */
      $scope.setHop = function(item, hop){
        hop.name = item.name;
        if(item.alphaAcidMin) {
          hop.aa = item.alphaAcidMin;
        }
      };

      /* set the style selected */
      $scope.setYeast = function(item, yeast){
        yeast.name = item.name;
        if(item.attenuationMin) {
          yeast.attenuation = item.attenuationMin;
        }
      };

      $scope.filterItems = function(styles, userInput) {
        return $q(function(resolve, reject) {
          var filter = $filter('filter');
          var items = filter(styles, userInput, false);
          if(items.length > 0) {
            resolve(items);
          } else {
            reject(items);
          }
        });
      };

      // Initializer
      (function () {
        // Differentiate between add or edit
        if ($state.params.recipeId) {
            var recipe = RecipeStore.get($state.params.recipeId);
            if (recipe) {
              $scope.recipe = recipe;
              $scope.pageTitle = 'Edit Recipe';
            } else {
              // This Recipe doesn't exist
              $state.go('recipes');
            }
        } else {
          if ($state.params.isNew) {
            $scope.recipe = defaultRecipe;
            $scope.pageTitle = 'Add Recipe';
          } else {
            // Wrong state: Has no recipe id and is not new
            $state.go('recipes');
          }
        }

        //load beer data
        $scope.styles = BreweryDB.getStyles();
        $scope.fermentables = BreweryDB.getFermentables();
        $scope.hops = BreweryDB.getHops();
        $scope.yeasts = BreweryDB.getYeasts();
      })();

    }]);
})();
