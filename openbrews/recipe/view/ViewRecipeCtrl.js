/* global angular */
// View Recipe lists the recipe at the given index, pulling data from
// LocalStorage

(function() {
  'use strict';
  angular.module('openbrews.viewRecipe', [])
  .controller('ViewRecipeCtrl', ["$scope", "$state", 'localStorageKey', function($scope, $state, localStorageKey) {
    console.log("[view-recipe] We are going to view the recipe number " + $state.params.recipeIndex);
    console.log("Local storage key is: " + localStorageKey);
    var recipes = JSON.parse(localStorage.getItem(localStorageKey)) || [];
    if ($state.params.recipeIndex < recipes.length) {
      $scope.recipe = recipes[$state.params.recipeIndex];
      console.log("[view-recipe] Recipe is in the scope!");
    } else {
      // This Recipe doesn't exist
      $state.go("recipes");
    }
  }]);
})();
