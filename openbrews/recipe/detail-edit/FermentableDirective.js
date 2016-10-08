angular.module('openbrews.fermentableDirective', [])
.directive('fermentable', function() {
  return {
  	restrict: 'E',
	fermentable: '=model',
	index: '=index',
    templateUrl: 'recipe/detail-edit/fermentable.html'
  };
});
