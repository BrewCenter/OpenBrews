//MyRecipes shows a list of recipes saved to the users device or profile
(function(){
	'use strict';
  angular.module('openbrews.myRecipes', ['openbrews.recipeStore'])
    .controller('MyRecipesCtrl', function($scope, $state, RecipeStore) {

      $scope.recipes = RecipeStore.all();
      $scope.bugReportModal = null;
      $scope.bugReportForm = {};

      $scope.addRecipe = function() {
        $state.go('add-recipe');
      };

      $scope.deleteRecipe = function(recipe){
        RecipeStore.delete(recipe);
				$scope.recipes = RecipeStore.all();
      };

      $scope.editRecipe = function(recipe){
        $state.go('edit-recipe', { recipeId: recipe.id });
      };

      $scope.viewRecipe = function(recipe) {
        $state.go('view-recipe', { recipeId: recipe.id });
      };
      
    });
})();
