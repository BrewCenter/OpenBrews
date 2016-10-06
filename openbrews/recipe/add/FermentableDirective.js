angular.module('openbrews.fermentableDirective', [])
.directive('fermentable', function() {
  return {
  	restrict: 'E',
	fermentable: '=model',
	index: '=index',
    templateUrl: 'recipe/add/fermentable.html'
  };
});