/*global
  angular
*/
//AddRecipe shows a list of recipes saved to the users device or profile
(function(){
  'use strict';
  angular.module('openbrews.addRecipe', ['openbrews.fermentableDirective', 'openbrews.hopDirective', 'openbrews.yeastDirective', 'openbrews.otherIngredientDirective'])
    .controller('AddRecipeCtrl', ['$scope', '$state', function($scope, $state) {

      var LOCAL_STORAGE_KEY = "recipesInStorage";

      $scope.recipe = {
        name: "",
        style: "",
        boilSize: 5,
        boilSizeUnits: "Gal",
        boilTime: 60,
        estFermentationDays: 7,
        secondaryTimeDays: 0,
        mashEfficiency: 68,
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
            method: "Mash",
            weight: 0,
            weightUnits: "Lbs",
            addTime: 0,
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
          name: "",
          amount: 0,
          amountUnits: "oz",
          stage: "Boil",
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
            weightUnits: "oz",
            type: "Pellet",
            aa: 0,
            stage: "Boil",
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
            flocculation: "Medium-Low",
            amountUnits: "G"
          }
        );
      };

      /* Save a recipe in LocalStorage */
      $scope.saveRecipe = function() {
        var oldItems = localStorage.getItem(LOCAL_STORAGE_KEY);
        var history = [];
        if (oldItems) {
          history = JSON.parse(oldItems);
        }
        history.push($scope.recipe);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(history));
        $state.go("recipes");
      };

    }]);
})();
