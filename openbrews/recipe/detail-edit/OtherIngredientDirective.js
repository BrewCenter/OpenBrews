angular.module('openbrews.otherIngredientDirective', [])
.directive('otherIngredient', function() {
  return {
  	restrict: 'E',
	otherIngredient: '=model',
    templateUrl: 'recipe/detail-edit/other-ingredient.html'
  };
});
