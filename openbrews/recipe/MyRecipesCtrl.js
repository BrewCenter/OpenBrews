/*global
  angular
*/
//MyRecipes shows a list of recipes saved to the users device or profile
(function(){
	'use strict';
  angular.module('openbrews.myRecipes', [])
    .controller('MyRecipesCtrl', function($scope) {

    	$scope.recipes = [
    		{
    			name: 'Citra Pale Ale',
    			type: 'American Pale Ale'
    		},
    		{
    			name: 'Dark Chocolate Porter',
    			type: 'American Porter'
    		}
    	];

    });
})();
