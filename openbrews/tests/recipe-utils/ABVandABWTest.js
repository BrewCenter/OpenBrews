  /*
   * Expected values calculated using online calculators such as
   * https://www.brewersfriend.com/homebrew/recipe/calculator/
   */
describe('RecipeUtils ABV and ABW Functions', function() {
  var RecipeUtils;
  var recipe;

  var roundTo = function(val, decimals) {
    return parseFloat(val.toFixed(decimals));
  };

  // Before each test load our api.users module
  beforeEach(angular.mock.module('openbrews.recipeUtils'));

  // Before each test set our injected Users factory (_Users_) to our local Users variable
  beforeEach(inject(function(_RecipeUtils_) {
      RecipeUtils = _RecipeUtils_;
      /* define some basic data. */
      recipe = {
        og: 1.060,
        fg: 1.015,
      };
  }));//end beforeEach

  it("equal gravities yield no alcohol", function() {
    recipe.og = recipe.fg = 1.060;
    expect(RecipeUtils.calcABV(recipe)).toEqual(0);
  });

  /* there is some variation here between other calculated values
    because of variations in formulas used for this. I am using a formula
    that does it's best to calculate values for all ranges of abv */
  it("standard gravities yield correct abv", function() {
    recipe.og = 1.060;
    recipe.fg = 1.015;
    expect(RecipeUtils.calcABV(recipe)).toBeCloseTo(5.910, 0);
    recipe.fg = 1;
    expect(RecipeUtils.calcABV(recipe)).toBeCloseTo(7.88, 0);
    recipe.og = 1.063;
    recipe.fg = 1.020;
    expect(RecipeUtils.calcABV(recipe)).toBeCloseTo(5.64, 0);

  });

  it("abv doesn't rise above yeast tolerance", function() {
    recipe.og = 1.060;
    recipe.fg = 1.015;
    //abv should be 5.910 normally, so we'll set our highest yeast tolerance at 5.8
    recipe.yeasts = [
      {
        alcoholTolerance: 5.8
      },
      {
        alcoholTolerance: 5
      }
    ];
    expect(RecipeUtils.calcABV(recipe)).toEqual(5.8);
  });

  it("abw is correctly calculated from abv", function() {
    recipe.abv = 0;
    expect(RecipeUtils.calcABW(recipe)).toEqual(0);
    recipe.abv = 5.91;
    expect(roundTo(RecipeUtils.calcABW(recipe), 3)).toEqual(4.728);
    recipe.abv = 6.56;
    expect(roundTo(RecipeUtils.calcABW(recipe), 3)).toEqual(5.248);
  });

});