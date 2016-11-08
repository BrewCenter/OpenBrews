(function(){
  'use strict';
  angular.module('openbrews.hopDirective', [])
  .directive('hop', function() {
    return {
      restrict: 'E',
      hop: '=model',
      index: '=index',
      templateUrl: 'recipe/detail-edit/hop.html'
    };
  });
})();