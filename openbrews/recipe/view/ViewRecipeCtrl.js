/* global angular */
// View Recipe lists the recipe at the given index, pulling data from
// LocalStorage

(function() {
  'use strict';
  angular.module('openbrews.viewRecipe', [])
  .controller('ViewRecipeCtrl', function($scope, $state) {
    console.log("[view-recipe] We are going to view the recipe number " + $state.params.recipeIndex);
    $scope.recipeNumber = $state.params.recipeIndex;
  });
})();
