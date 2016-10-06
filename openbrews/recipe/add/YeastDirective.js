angular.module('openbrews.yeastDirective', [])
.directive('yeast', function() {
  return {
    restrict: 'E',
    scope: {
      yeast: '=info',
    },
    index: '=index',
    templateUrl: 'recipe/add/yeast.html'
  };
});
