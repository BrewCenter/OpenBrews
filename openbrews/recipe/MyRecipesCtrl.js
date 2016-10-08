/*global
  angular
*/
//MyRecipes shows a list of recipes saved to the users device or profile
(function(){
	'use strict';
  angular.module('openbrews.myRecipes', ['openbrews.recipeStore'])
    .controller('MyRecipesCtrl', function($scope, $state, RecipeStore) {

      $scope.recipes = RecipeStore.all()

      $scope.addRecipe = function() {
          $state.go("add-recipe");
      };

      $scope.deleteRecipe = function(recipe){
        console.log("Deleting...");
      };

      $scope.editRecipe = function(recipe){
        console.log("Editing...");
      };

      $scope.viewRecipe = function(index) {
        console.log("We are going to view recipe #" + index);
        $state.go("view-recipe", { recipeIndex: index });
      };

    });
})();
