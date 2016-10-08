angular.module('openbrews.recipeStore', ['uuid'])
.service('RecipeStore', function (uuid4) {

  const LOCAL_STORAGE_KEY = "recipesInStorage";

  this.get = function(id) {
    var items = this.all();
    return items.filter(function(element) { return element.id === id; })[0];
  };

  this.all = function() {
    var oldItems = localStorage.getItem(LOCAL_STORAGE_KEY);
    var items = [];
    if (items) {
      items = JSON.parse(oldItems);
    }
    return items;
  };

  this.insert = function(recipe) {
    recipe.id = uuid4.generate();

    var items = this.all();
    items.push(recipe);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  };

  this.update = function(recipe) {
    var items = this.all();
    const index = items.map(function(e) { return e.id; }).indexOf(recipe.id);
    items[index] = recipe;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  }

  this.delete = function(recipe) {
    var items = this.all();
    items = items.filter(function(element) { return element.id != recipe.id; });
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  }

});
