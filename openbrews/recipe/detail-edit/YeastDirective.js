angular.module('openbrews.yeastDirective', [])
.directive('yeast', function() {
  return {
    restrict: 'E',
    yeast: '=info',
    index: '=index',
    templateUrl: 'recipe/detail-edit/yeast.html'
  };
});
