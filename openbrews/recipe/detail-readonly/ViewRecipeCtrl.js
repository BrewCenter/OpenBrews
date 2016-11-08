/* global angular */
// View Recipe lists the recipe at the given index, pulling data from
// LocalStorage

(function() {
  'use strict';
  angular.module('openbrews.viewRecipe', ['openbrews.recipeStore'])
    .controller('ViewRecipeCtrl', ['$scope', '$state', 'RecipeStore', function($scope, $state, RecipeStore) {

      // Initializer
      (function() {
        const recipe = RecipeStore.get($state.params.recipeId);
        if (recipe) {
          $scope.recipe = recipe;
        } else {
          // This Recipe doesn't exist
          $state.go('recipes');
        }
      })();

  }]);
})();
