/*
 * Expected values calculated using online calculators such as
 * https://www.brewersfriend.com/homebrew/recipe/calculator/
 */
describe('RecipeUtils calcIBU', function() {
  var RecipeUtils;
  var recipe,hop1,hop2;

  // Before each test load our api.users module
  beforeEach(angular.mock.module('openbrews.recipeUtils'));

  // Before each test set our injected Users factory (_Users_) to our local Users variable
  beforeEach(inject(function(_RecipeUtils_) {
      RecipeUtils = _RecipeUtils_;
      /* define some basic data. */
      recipe = {
        boilSize: 5,
        boilSizeUnits: "Gal",
        hops: []
      };
      hop1 = {
        weight: 2,
        weightUnits: "oz",
        stage: "Boil",
        aa: 12,
        addTime: 60
      };
      hop2 = {
        weight: 1,
        weightUnits: "G",
        stage: "Boil",
        aa: 8,
        addTime: 30
      };
  }));//end beforeEach

  it("empty recipe is 0 ibu", function() {
    expect(RecipeUtils.calcIBU(recipe)).toEqual(0);
  });

  it("single hop yields expected ibu", function() {
    recipe.hops = [hop1];
    expect(RecipeUtils.calcIBU(recipe)).toEqual(0);
  });

});