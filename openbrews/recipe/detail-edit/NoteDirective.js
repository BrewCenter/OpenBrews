angular.module('openbrews.noteDirective', [])
.directive('note', function() {
  return {
    restrict: 'E',
    note: '=model',
    index: '=index',
    templateUrl: 'recipe/detail-edit/note.html'
  };
});
