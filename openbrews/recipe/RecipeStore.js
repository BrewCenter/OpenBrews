angular.module('openbrews.recipeStore', [])
.service('RecipeStore', function () {

  const LOCAL_STORAGE_KEY = "recipesInStorage";

  this.all = function() {
    var oldItems = localStorage.getItem(LOCAL_STORAGE_KEY);
    var history = [];
    if (oldItems) {
      history = JSON.parse(oldItems);
    }
    return history;
  };

  this.insert = function(recipe) {
    console.log('insert ' + recipe);
    var oldItems = localStorage.getItem(LOCAL_STORAGE_KEY);
    var history = [];
    if (oldItems) {
      history = JSON.parse(oldItems);
    }
    history.push(recipe);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(history));
  };

});
