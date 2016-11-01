  /*
   * Expected values calculated using online calculators such as
   * https://www.brewersfriend.com/homebrew/recipe/calculator/
   */
describe('RecipeUtils Function Definitions', function() {
  var RecipeUtils;

  // Before each test load our api.users module
  beforeEach(angular.mock.module('openbrews.recipeUtils'));

  // Before each test set our injected Users factory (_Users_) to our local Users variable
  beforeEach(inject(function(_RecipeUtils_) {
      RecipeUtils = _RecipeUtils_;
  }));

  it('simple grain-only test', function() {
    var recipe = {
      boilSize: 5,
      boilSizeUnits: "Gal",
      mashEfficiency: 68,
      fermentables: [
        {
          name: "American 2-Row",
          method: "Mash",
          weight: 11.5,
          weightUnits: "Lbs",
          addTime: 0,
          ppg: 38,
          srm: 1
        }
      ]
    }
    expect(RecipeUtils.calcOG(recipe)).toEqual(1.059);
  });
  
});