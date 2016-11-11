  /*
   * Expected values calculated using online calculators such as
   * https://www.brewersfriend.com/homebrew/recipe/calculator/
   */
describe('RecipeUtils calcSRM', function() {
  var RecipeUtils;
  var recipe,fermentable1, fermentable2;

  // Before each test load our api.users module
  beforeEach(angular.mock.module('openbrews.recipeUtils'));

  // Before each test set our injected Users factory (_Users_) to our local Users variable
  beforeEach(inject(function(_RecipeUtils_) {
      RecipeUtils = _RecipeUtils_;
      /* define some basic data. */
      recipe = {
        boilSize: 5.5,
        boilSizeUnits: "Gal",
        mashEfficiency: 68,
        steepEfficiency: 30,
        fermentables: []
      };
      fermentable1 = {
        name: "American 2-Row",
        method: "Mash",
        weight: 3,
        weightUnits: "Lbs",
        srm: 23
      };
      fermentable2 = {
        name: "English 2-Row",
        method: "Mash",
        weight: 3,
        weightUnits: "Lbs",
        srm: 2
      };
  }));//end beforeEach

  it("simple SRM calculation", function() {
    recipe.fermentables = [fermentable1];
    expect(RecipeUtils.calcSRM(recipe)).toBeCloseTo(8.46);
  });


});