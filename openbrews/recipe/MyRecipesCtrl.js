/*global
  angular
*/
//MyRecipes shows a list of recipes saved to the users device or profile
(function(){
	'use strict';
  angular.module('openbrews.myRecipes', [])
    .controller('MyRecipesCtrl', function($scope, $state) {

      var LOCAL_STORAGE_KEY = "recipesInStorage";
      var oldItems = localStorage.getItem(LOCAL_STORAGE_KEY);
      var history = [];
      if (oldItems) {
        history = JSON.parse(oldItems);
      }

      $scope.recipes = history

      $scope.addRecipe = function() {
          $state.go("add-recipe");
      };

      $scope.data = { showDelete: false };

      $scope.deleteRecipe = function(recipe){
        console.log("Deleting...");
      };

      $scope.editRecipe = function(recipe){
        console.log("Editing...");
      };

    });
})();
