/*global
  angular
*/
//AddRecipe shows a list of recipes saved to the users device or profile
(function(){
  'use strict';
  angular.module('openbrews.editRecipe', [
    'openbrews.fermentableDirective',
    'openbrews.hopDirective',
    'openbrews.yeastDirective',
    'openbrews.otherIngredientDirective',
    'openbrews.recipeStore'
  ])
    .controller('EditRecipeCtrl', ['$scope', '$state', 'RecipeStore', function($scope, $state, RecipeStore) {

      /* remove the fermentable at the given index */
      $scope.deleteFermentable = function(index) {
        $scope.recipe.fermentables.splice(index,1);
      };

      /* Add a new fermentable */
      $scope.addFermentable = function() {
        $scope.recipe.fermentables.push(
          {
            method: "Mash",
            weight: 0,
            weightUnits: "Lbs",
            addTime: 0,
            ppg: 0,
            srm: 0
          }
        );
      };

      /* Add other ingredient. */
      $scope.addOther = function() {
        $scope.recipe.others.push({
          name: "Orange Peel",
          amount: 5.0,
          amountUnits: "oz",
          stage: "Boil",
          addTime: 60
        });
      };

      /* Delete other ingredient. */
      $scope.deleteOther = function(index) {
        $scope.recipe.others.splice(index,1);
      };

      /* remove the Hop at the given index */
      $scope.deleteHop = function(index) {
        $scope.recipe.hops.splice(index,1);
      };

      /* Add a new Hop */
      $scope.addHop = function() {
        $scope.recipe.hops.push(
          {
            weight: 0,
            aa: 0,
            stage: "Boil",
            addTime: 60
          }
        );
      };

      /* Delete the yeast at supplied index */
      $scope.deleteYeast = function(index) {
        $scope.recipe.yeasts.splice(index, 1);
      };

      /* Add a new yeast */
      $scope.addYeast = function() {
        $scope.recipe.yeasts.push(
          {
            attenuation: 0,
            flocculation: "Medium-Low",
            amountUnits: "G"
          }
        );
      };

      /* Save a recipe in LocalStorage */
      $scope.saveRecipe = function() {
        if ($state.params.isNew) {
          RecipeStore.insert($scope.recipe);
        } else {
          RecipeStore.update($scope.recipe);
        }
        $state.go("recipes");
      };

      const defaultRecipe = {
        name: "Citra Pale Ale",
        style: "American Pale Ale",
        boilSize: 5,
        boilSizeUnits: "Gal",
        boilTime: 60,
        estFermentationDays: 7,
        secondaryTimeDays: 7,
        mashEfficiency: 68,
        fermentables: [
          {
            name: "Pale Liquid Extract",
            method: "Extract",
            weight: 9.00,
            weightUnits: "Lbs",
            addTime: 15,
            ppg: 1.036,
            srm: 8.0
          }
        ],
        hops: [
          {
            name: "Citra",
            type: "Pellet",
            weight: 1,
            weightUnits: "oz",
            aa: 0.125,
            stage: "Boil",
            addTime: 60
          },
          {
            name: "Citra",
            type: "Pellet",
            weight: 1,
            weightUnits: "oz",
            aa: 0.125,
            stage: "Secondary",
            addTime: 0
          }
        ],
        yeasts: [
          {
            name: "WY1056 American Ale",
            attenuation: 0.75,
            flocculation: "Medium-Low",
            amount: "13.5",
            amountUnits: "G"
          }
        ],
        others: [
          {
            name: "Orange Peel",
            amount: 5.0,
            amountUnits: "oz",
            stage: "Boil",
            addTime: 60
          },
          {
            name: "Orange Peel",
            amount: 5.0,
            amountUnits: "oz",
            stage: "Secondary",
            addTime: 0
          }
        ],
        notes: [
          "Don't boil over!"
        ]
      };

      // Initializer
      (function () {
        // Differentiate between add or edit
        if ($state.params.recipeId) {
            const recipe = RecipeStore.get($state.params.recipeId);
            if (recipe) {
              $scope.recipe = recipe;
              $scope.pageTitle = 'Edit Recipe';
            } else {
              // This Recipe doesn't exist
              $state.go("recipes");
            }
        } else {
          if ($state.params.isNew) {
            $scope.recipe = defaultRecipe;
            $scope.pageTitle = 'Add Recipe';
          } else {
            // Wrong state: Has no recipe id and is not new
            $state.go("recipes");
          }
        }
      })();

    }]);
})();
