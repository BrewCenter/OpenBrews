angular.module('openbrews.otherIngredientDirective', [])
.directive('otherIngredient', function() {
  return {
  	restrict: 'E',
	otherIngredient: '=model',
    templateUrl: 'recipe/add/other-ingredient.html'
  };
});
