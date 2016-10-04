/*global
  angular
*/
//AddRecipe shows a list of recipes saved to the users device or profile
(function(){
	'use strict';
  angular.module('openbrews.addRecipe', [])
    .controller('AddRecipeCtrl', function($scope) {

        $scope.recipe = {
            name: "",
            style: "",
            boilSize: "",
            boilSizeUnits: "gal",
            boilTime: "",
            grainMethod: "",
            mashEfficiency: 0.68,
            fermentables: [],
            hops: [],
            yeast: [],
            others: [],
            notes: []
        };

    });
})();
