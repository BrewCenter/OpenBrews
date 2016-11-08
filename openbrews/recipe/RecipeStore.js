/*jshint bitwise: false*/
(function(){
  'use strict';
  angular.module('openbrews.recipeStore', [])
  .service('RecipeStore', function () {

    var LOCAL_STORAGE_KEY = 'recipesInStorage';

    var uuid = function() {
      /* http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript/2117523#2117523 */
      var fmt = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
      return fmt.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
      });
    };

    this.get = function(id) {
      var items = this.all();
      return items.filter(function(element) { return element.id === id; })[0];
    };

    this.all = function() {
      var oldItems = localStorage.getItem(LOCAL_STORAGE_KEY);
      var items = [];
      if (oldItems) {
        items = JSON.parse(oldItems);
      }
      return items;
    };

    this.insert = function(recipe) {
      recipe.id = uuid();

      var items = this.all();
      items.push(recipe);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    };

    this.update = function(recipe) {
      var items = this.all();
      var index = items.map(function(e) { return e.id; }).indexOf(recipe.id);
      items[index] = recipe;
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    };

    this.delete = function(recipe) {
      var items = this.all();
      items = items.filter(function(element) { return element.id !== recipe.id; });
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    };

  });
})();