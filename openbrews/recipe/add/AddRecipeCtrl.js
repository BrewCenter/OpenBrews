/*global
  angular
*/
//AddRecipe shows a list of recipes saved to the users device or profile
(function(){
	'use strict';
  angular.module('openbrews.addRecipe', [])
    .controller('AddRecipeCtrl', function($scope) {

        $scope.recipe = {
          name: "Citra Pale Ale",
          style: "American Pale Ale",
          boilSize: 5,
          boilSizeUnits: "Gal",
          boilTime: 60,
          estFermTimeDays: 7,
          secondaryTimeDays: 7,
          mashEfficiency: 0.68,
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
              weightUnits: "OZ",
              aa: 0.125,
              stage: "Boil",
              addTime: 60
            },
            {
              name: "Citra",
              type: "Pellet",
              weight: 1,
              weightUnits: "OZ",
              aa: 0.125,
              stage: "Secondary"
            }
          ],
          yeast: [
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
              amountUnits: "OZ",
              stage: "Boil"
              addTime: "60"
            },
            {
              name: "Orange Peel",
              amount: 5.0,
              amountUnits: "OZ",
              stage: "Secondary"
            }
          ],
          notes: [
            "Don't boil over!"
          ]
        };

    });
})();
