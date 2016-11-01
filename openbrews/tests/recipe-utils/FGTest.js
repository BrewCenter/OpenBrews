  /*
   * Expected values calculated using online calculators such as
   * https://www.brewersfriend.com/homebrew/recipe/calculator/
   */
describe('RecipeUtils calcFG', function() {
  var RecipeUtils;
  var recipe,yeast1;

  // Before each test load our api.users module
  beforeEach(angular.mock.module('openbrews.recipeUtils'));

  // Before each test set our injected Users factory (_Users_) to our local Users variable
  beforeEach(inject(function(_RecipeUtils_) {
      RecipeUtils = _RecipeUtils_;
      /* define some basic data. */
      recipe = {
        yeasts: []
      };
      yeast1 = {
        amount: 11.5,
        attenuation: 75,
        flocculation: "Medium-Low",
        amountUnits: "G"
      };
  }));//end beforeEach

  it("should be 0", function() {
    recipe.og = 0;
    yeast1.attenuation = 0;
    recipe.yeasts = [yeast1];
    expect(RecipeUtils.calcFG(recipe)).toEqual(0);
  });

  it("different attenuations should calculate correctly", function() {
    recipe.og = 1.060;
    recipe.yeasts = [yeast1];
    expect(RecipeUtils.calcFG(recipe)).toEqual(1.015);
  });

});