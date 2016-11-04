/*global
  angular
*/
//MyRecipes shows a list of recipes saved to the users device or profile
(function(){
	'use strict';
  angular.module('openbrews.myRecipes', ['openbrews.recipeStore'])
    .controller('MyRecipesCtrl', function($scope, $state, $ionicModal, RecipeStore) {

      $scope.recipes = RecipeStore.all()
      $scope.bugReportModal = null;
      $scope.bugReportForm = {};

      $scope.addRecipe = function() {
        $state.go("add-recipe");
      };

      $scope.deleteRecipe = function(recipe){
        RecipeStore.delete(recipe);
				$scope.recipes = RecipeStore.all();
      };

      $scope.editRecipe = function(recipe){
        $state.go("edit-recipe", { recipeId: recipe.id });
      };

      $scope.viewRecipe = function(recipe) {
        $state.go("view-recipe", { recipeId: recipe.id });
      };

      /****************************************************
       * Bug Report Modal Code
       ****************************************************/

      $scope.openBugReport = function() {
        $scope.bugReportModal.show();
      };

      $scope.sendBugReport = function(form) {
        if(form.$valid) {
          if(window.plugins && window.plugins.emailComposer) {
              var body = 
                'From: ' + 
                $scope.bugReportForm.email + 
                '<br/><br/>Report:<br/>' + 
                $scope.bugReportForm.report;

              window.plugins.emailComposer.showEmailComposerWithCallback(function(result) {
                  console.log("Response -> " + result);
              }, 
              "OpenBrews Bug Report",      // Subject
              body,                        // Body
              ["mdw7326@rit.edu"],         // To
              null,                        // CC
              null,                        // BCC
              true,                        // isHTML
              null,                        // Attachments
              null);                       // Attachment Data
          }
          $scope.bugReportForm = {};
          $scope.closeBugReport();
          form.$setPristine();
        }
      };

      $scope.closeBugReport = function() {
        $scope.bugReportModal.hide();
      };
      // Cleanup the modal when we're done with it!
      $scope.$on('$destroy', function() {
        $scope.bugReportModal.remove();
      });
      // Execute action on hide modal
      $scope.$on('bugReportModal.hidden', function() {
        // Execute action
      });
      // Execute action on remove modal
      $scope.$on('bugReportModal.removed', function() {
        // Execute action
      });

      $ionicModal.fromTemplateUrl('recipe/BugReport.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(bugReportModal) {
        $scope.bugReportModal = bugReportModal;
      });

    });
})();
